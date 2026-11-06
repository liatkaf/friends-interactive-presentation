// Dependency-free Edge/Chromium smoke test. First run: node serve.cjs
// Then: node tests/browser-test.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const pause = ms => new Promise(resolve=>setTimeout(resolve,ms));
const port = 9364;
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


  await waitFor("window.FriendsLab&&document.querySelector('.evidence-map .evidence-row')",'v1.0 layout initialized');
  await evaluate("goTo(9);document.querySelector('[data-answer=mood][data-value=happy]').click();goTo(10);document.querySelector('#profile-stress').value=8;document.querySelector('#profile-stress').dispatchEvent(new Event('input'));goTo(11);document.querySelector('[data-answer=character][data-value=Ross]').click();goTo(12);document.querySelector('[data-answer=quote]').click();goTo(13);document.querySelector('[data-answer=experience][data-value=laughter]').click();goTo(14);document.querySelector('[data-answer=familiarity][data-value=rewatcher]').click();document.querySelector('[data-answer=nostalgia][data-value=high]').click()");
  for(const width of [1440,1024,768,390,320]){
    await send('Emulation.setDeviceMetricsOverride',{width,height:width<600?844:1000,deviceScaleFactor:1,mobile:width<600});
    await evaluate('goTo(2);document.querySelectorAll("[data-pillar]")[0].click()');
    await check("[...document.querySelectorAll('#slide-3 .pillar-detail')].every(x=>x.hidden?getComputedStyle(x).display==='none':getComputedStyle(x).display==='block')&&sections[2].scrollWidth<=sections[2].clientWidth",'expanded concept text remains readable without inherited columns '+width);
    for(const [slide,ids] of [[5,[0,1,2,3]],[6,[4,5,6]]]){
      await evaluate('goTo('+slide+');if(current===5)document.querySelector("#belonging-evidence").open=true');
      for(const id of ids){
        await evaluate(`document.querySelector('[data-inline-figure="${id}"]').click()`);await pause(90);
        await check("sections[current].scrollWidth<=sections[current].clientWidth",'research map no horizontal overflow '+width+'/'+id);
        await check("[...document.querySelectorAll('.slide.active .python-canvas')].some(x=>x.getBoundingClientRect().width>200)",'Python player remains readable '+width+'/'+id);
      }
      if(width===1440&&slide===6)await check("sections[current].scrollHeight<=sections[current].clientHeight+1",'research fits standard desktop slide '+slide);
    }
    await evaluate('goTo(16);presentation.focus();FriendsNavigation.hide()');await waitFor('FriendsLab.result','result ready');await pause(500);
    await check("getComputedStyle(document.querySelector('#back-to-start')).backgroundColor==='rgb(244, 197, 66)'&&document.querySelector('.home-action').getBoundingClientRect().top>=document.querySelector('.final-actions').getBoundingClientRect().bottom",'prominent lower Back to Start '+width);
    await check("sections[16].scrollWidth<=sections[16].clientWidth&&document.querySelectorAll('.alternatives article').length===2",'result cards fit '+width);
    if(width===1440||width===390)await screenshot('v10-final-'+(width===1440?'desktop':'mobile')+'-17');
  }
  await send('Emulation.setDeviceMetricsOverride',{width:1366,height:768,deviceScaleFactor:1,mobile:false});
  for(const [slide,ids] of [[5,[0,1,2,3]],[6,[4,5,6]]]){
    await evaluate('goTo('+slide+');if(current===5)document.querySelector("#belonging-evidence").open=true');
    for(const id of ids){await evaluate(`document.querySelector('[data-inline-figure="${id}"]').click()`);await check("current===5?(document.querySelector('#belonging-evidence').open&&sections[5].getBoundingClientRect().height<=innerHeight):sections[current].scrollHeight<=sections[current].clientHeight+1",'lab fits laptop; optional evidence stays in slide scroll container '+id);}
    await evaluate(`document.querySelector('[data-inline-figure="${ids[0]}"]').click();presentation.focus();FriendsNavigation.hide()`);await pause(500);await screenshot('v10-final-laptop-'+(slide+1));
  }
  await evaluate("document.querySelector('#comfort-mood').value='night';document.querySelector('#comfort-mood').dispatchEvent(new Event('change'));goTo(5)");
  await check("getComputedStyle(document.querySelector('.study-finding')).color==='rgb(227, 198, 143)'",'research text remains legible in optional night theme');
  test(errors.length===0,'no unexpected layout errors: '+errors.join(' '));
  const report={passed:checks,errors,suite:'v1.0 categorical chart and final-action layout at five widths'};
  fs.writeFileSync(path.join(root,'test-results','v10-final-layout-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));await send('Browser.close');ownedBrowser=false;
})().catch(async error=>{console.error(error);if(send&&ws?.readyState===1)try{await send('Browser.close');}catch{}if(ownedBrowser)browser?.kill();process.exitCode=1;});
