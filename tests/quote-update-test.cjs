// Dependency-free Edge/Chromium smoke test. First run: node serve.cjs
// Then: node tests/browser-test.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const pause = ms => new Promise(resolve=>setTimeout(resolve,ms));
const port = 9385;
const root=path.resolve(__dirname,'..');
const base=process.env.TEST_BASE || 'http://127.0.0.1:8000';
const edge=process.env.BROWSER_PATH || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
let browser,ws,send,ownedBrowser=false;
(async()=>{
  const {advanceYaw,approachSpeed,REST_YAW}=await import(pathToFileURL(path.join(root,'animation-timeline.mjs')));
  let checks=0;
  const test=(value,label)=>{assert.ok(value,label);checks++;};
  await fetch(base).catch(()=>{throw Error('Start the local server first: node serve.cjs');});
  const profile=fs.mkdtempSync(path.join(os.tmpdir(),'friends-mug-test-'));
  browser=spawn(edge,['--headless','--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows','--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader',`--remote-debugging-port=${port}`,`--user-data-dir=${profile}`,'about:blank'],{windowsHide:true,stdio:'ignore'});
  ownedBrowser=true;
  let targets;
  for(let i=0;i<100;i++){try{targets=await(await fetch(`http://127.0.0.1:${port}/json/list`)).json();break;}catch{await pause(100);}}
  if(!targets)throw Error('Could not launch Edge; set BROWSER_PATH to a Chromium executable.');
  ws=new WebSocket(targets.find(target=>target.type==='page').webSocketDebuggerUrl);
  await new Promise(resolve=>ws.addEventListener('open',resolve,{once:true}));
  let sequence=0;const pending=new Map(),errors=[],requests=[];
  ws.addEventListener('message',event=>{
    const message=JSON.parse(event.data);
    if(message.id){const pair=pending.get(message.id);if(pair){pending.delete(message.id);message.error?pair.reject(message.error):pair.resolve(message.result);}}
    if(message.method==='Runtime.exceptionThrown')errors.push(message.params.exceptionDetails.exception?.description||message.params.exceptionDetails.text);
    if(message.method==='Runtime.consoleAPICalled'&&message.params.type==='error')errors.push(message.params.args.map(a=>a.value||a.description).join(' '));
    if(message.method==='Network.requestWillBeSent')requests.push(message.params.request.url);
  });
  send=(method,params={})=>new Promise((resolve,reject)=>{const id=++sequence;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
  const evaluate=async expression=>{
    const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
    if(result.exceptionDetails)throw Error(result.exceptionDetails.exception?.description||result.exceptionDetails.text);
    return result.result.value;
  };
  const check=async(expression,label)=>test(await evaluate(expression),label);
  const waitFor=async(expression,label,timeout=15000)=>{
    const start=Date.now();while(Date.now()-start<timeout){if(await evaluate(expression)){checks++;return;}await pause(40);}throw Error('Timed out: '+label+'; status: '+await evaluate(`document.querySelector('#mug-status')?.textContent`)+'; errors: '+errors.join('\n'));
  };
  const screenshot=async name=>{const result=await send('Page.captureScreenshot',{format:'png'});fs.mkdirSync(path.join(root,'test-results'),{recursive:true});fs.writeFileSync(path.join(root,'test-results',name+'.png'),Buffer.from(result.data,'base64'));};
  await send('Runtime.enable');await send('Page.enable');await send('Network.enable');
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await send('Page.navigate',{url:base});

  const expected=[
    ["I'm gonna go get one of those job things.",'Rachel Green','Finding independence, one awkward step at a time.'],
    ["How you doin'?",'Joey Tribbiani'],['We were on a break!','Ross Geller'],
    ["I make jokes when I'm uncomfortable.",'Chandler Bing','Turning awkward moments into laughter.'],
    ['Smelly Cat','Phoebe Buffay'],['I know!','Monica Geller']
  ];
  await waitFor('window.FriendsLab&&sections.length===17','17-slide final deck');
  await send('Page.bringToFront');
  await evaluate('goTo(12)');
  const actual=await evaluate("[...sections[12].querySelectorAll('[data-answer=quote]')].map(b=>[b.querySelector('strong').textContent,b.querySelector('.quote-character').textContent,b.querySelector('.quote-reveal>span:last-child').textContent])");
  for(let i=0;i<6;i++)test(actual[i][0]===expected[i][0]&&actual[i][1]===expected[i][1]&&(!expected[i][2]||actual[i][2]===expected[i][2]),'exact quote, character and description at position '+i);
  test(new Set(actual.map(x=>x[1])).size===6,'each character exactly once');
  await evaluate("document.querySelector('[data-answer=mood][data-value=happy]').click()");
  for(const index of [0,3]){
    await evaluate(`goTo(12);document.querySelectorAll('[data-answer=quote]')[${index}].click()`);
    await evaluate(`getComputedStyle(document.querySelectorAll('.quote-reveal')[${index}]).opacity`);
    await send('Page.captureScreenshot',{format:'png'});
    await waitFor(`getComputedStyle(document.querySelectorAll('.quote-reveal')[${index}]).visibility==='visible'`,'selection transition finishes '+index);
    await check(`FriendsLab.profile.quote===${JSON.stringify(expected[index][0])}&&document.querySelectorAll('.quote-wall [aria-pressed=true]').length===1&&getComputedStyle(document.querySelectorAll('.quote-reveal')[${index}]).visibility==='visible'`,'new quote selects and description animates '+index);
    await evaluate('goTo(11);goTo(13);goTo(12)');
    await check(`FriendsLab.profile.quote===${JSON.stringify(expected[index][0])}`,'navigation preserves '+index);
    await send('Page.reload');await waitFor('window.FriendsLab','reloaded');
    await check(`FriendsLab.profile.quote===${JSON.stringify(expected[index][0])}&&FriendsLab.profile.mood==='happy'`,'reload preserves quote and other answer '+index);
    await evaluate('goTo(12)');
    const result=await evaluate(`FriendsLab.fallbackRecommend({quote:${JSON.stringify(expected[index][0])}})`);
    test(result.recommendations[0].episode.id===(index===0?'s01e01':'s04e08'),'meaningful themed top episode '+index);
    test(result.recommendations[0].factors[0].points===18&&result.recommendations[0].explanation.includes('no exact scene or health effect claimed'),'honest editorial explanation '+index);
    if(process.env.TEST_PYTHON==='1'){
      const py=await fetch(base+'/api/recommend',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({quote:expected[index][0]})}).then(r=>r.json());
      const canonical=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b))):v);
      test(canonical(py.recommendations)===canonical(result.recommendations),'Python/JavaScript parity '+index);
    }
    await evaluate("document.querySelector('[data-clear-step=\"4\"]').click()");
    await check("!('quote' in FriendsLab.profile)&&FriendsLab.profile.mood==='happy'&&!document.querySelector('.quote-wall [aria-pressed=true]')",'clear only quote '+index);
  }
  await evaluate("sections[12].querySelector('.question-foot [data-go]').click()");
  await check("current===13&&!FriendsLab.profile.quote",'skip leaves quote unanswered');
  await evaluate("goTo(12);document.querySelectorAll('[data-answer=quote]')[3].focus()");
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r'});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
  await check(`current===12&&FriendsLab.profile.quote===${JSON.stringify(expected[3][0])}`,'native keyboard selection');
  const layouts=[];
  for(const [width,height] of [[1440,1000],[1366,768],[1024,768],[390,844],[320,844]]){
    await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<600});
    for(const selected of [0,3,5]){
      await evaluate(`goTo(12);document.querySelectorAll('[data-answer=quote]')[${selected}].click();presentation.focus();FriendsNavigation.hide()`);await pause(350);
      const row=await evaluate("(()=>{const s=sections[12];return {scroll:s.scrollHeight,client:s.clientHeight,width:s.scrollWidth,clientWidth:s.clientWidth,labels:[...s.querySelectorAll('.quote-choice strong')].every(x=>x.scrollWidth<=x.clientWidth+1)}})()");
      layouts.push({width,height,selected,...row});
      if(!(row.width<=row.clientWidth&&row.scroll<=row.client+1&&row.labels)){console.log(JSON.stringify({width,height,selected,...row}));await screenshot('quote-update-layout-failure');}
      test(row.width<=row.clientWidth&&row.scroll<=row.client+1&&row.labels,'all six cards readable '+width+'/'+selected);
      if(width===1440&&selected===5)await screenshot('quote-update-desktop');
      if(width===390)await screenshot('quote-update-mobile-'+selected);
    }
  }
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await evaluate('goTo(16)');await waitFor('FriendsLab.result','result generated');await evaluate("document.querySelector('#try-again').click()");
  await check("current===9&&Object.keys(FriendsLab.profile).length===0&&!document.querySelector('.quote-wall [aria-pressed=true]')",'Try Again clears all answers');
  for(let i=0;i<17;i++){await evaluate(`goTo(${i})`);await check(`current===${i}&&sections.filter(s=>!s.hidden).length===1`,'all 17 slides navigate '+i);}
  await evaluate('goTo(4)');await waitFor("document.querySelector('#stairwell-view').dataset.mode==='three'",'real PIVOT scene');
  await evaluate("document.querySelector('#reset-challenge').click();document.querySelector('#move-up').click();document.querySelector('#move-up').click();document.querySelector('#pivot-couch').click();document.querySelector('#move-up').click()");
  await check('PivotChallenge.state.stage===3&&PivotChallenge.state.score===100','PIVOT perfect sequence unchanged');
  test(errors.length===0,'no unexpected JavaScript errors '+errors.join(' '));
  const report={passed:checks,errors,quotes:actual,layouts,primarySlides:17,mode:process.env.TEST_PYTHON==='1'?'Local Python and JavaScript':'Static hosting'};
  fs.mkdirSync(path.join(root,'test-results'),{recursive:true});fs.writeFileSync(path.join(root,'test-results','quote-update-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({passed:checks,errors,layoutCases:layouts.length,primarySlides:17}));
  await send('Browser.close');ownedBrowser=false;
})().catch(async error=>{console.error(error);if(send&&ws?.readyState===1)try{await send('Browser.close');}catch{}if(ownedBrowser)browser?.kill();process.exitCode=1;});
