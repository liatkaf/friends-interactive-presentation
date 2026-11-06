// Dependency-free Edge/Chromium smoke test. First run: node serve.cjs
// Then: node tests/browser-test.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const pause = ms => new Promise(resolve=>setTimeout(resolve,ms));
const port = 9366;
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
  await send('Page.navigate',{url:base});await send('Page.bringToFront');


  await waitFor('window.FriendsLab&&sections.length===17','17-slide presentation initialized');
  const phase=process.env.PROFILE_PHASE||'after';
  if(phase==='before'){
    test(!await evaluate("!!document.querySelector('.profile-enhanced')"),'before capture must run on the actual pre-upgrade UI');
    test(!fs.existsSync(path.join(root,'tests','fixtures','pre-profile-recommendations.json')),'do not overwrite the saved pre-upgrade scoring fixture');
    const profiles=[{},{stress:0},{stress:10},...await evaluate('FRIENDS_V05.quotes.map(q=>({quote:q.id}))'),...['new','some','rewatcher'].flatMap(familiarity=>['low','medium','high'].map(nostalgia=>({familiarity,nostalgia}))),{mood:'stressed',stress:8,character:'Joey',quote:"How you doin'?",experience:'warmth',familiarity:'rewatcher',nostalgia:'high'},{mood:'happy',stress:2,character:'Monica',quote:'I know!',experience:'laughter',familiarity:'some',nostalgia:'medium'}];
    const cases=await evaluate(`(${JSON.stringify(profiles)}).map(profile=>({profile,recommendations:FriendsLab.fallbackRecommend(profile).recommendations}))`);
    fs.mkdirSync(path.join(root,'tests','fixtures'),{recursive:true});fs.writeFileSync(path.join(root,'tests','fixtures','pre-profile-recommendations.json'),JSON.stringify({baselineCommit:'b9e1c2c406f817d03b604376d79938b82cf2554e',cases},null,2));
  }
  await evaluate("goTo(9);document.querySelector('[data-answer=mood][data-value=happy]').click();goTo(10);document.querySelector('#profile-stress').value=5;document.querySelector('#profile-stress').dispatchEvent(new Event('input'));goTo(11);document.querySelector('[data-answer=character][data-value=Monica]').click();goTo(12);document.querySelector('[data-answer=quote][data-value=\"I know!\"]').click();goTo(13);document.querySelector('[data-answer=experience][data-value=warmth]').click();goTo(14);document.querySelector('[data-answer=familiarity][data-value=rewatcher]').click();document.querySelector('[data-answer=nostalgia][data-value=high]').click()");
  for(const width of [1440,390]){
    await send('Emulation.setDeviceMetricsOverride',{width,height:width===390?844:1000,deviceScaleFactor:1,mobile:width===390});
    for(let index=9;index<=14;index++){
      await evaluate(`goTo(${index});presentation.focus();FriendsNavigation.hide()`);await pause(500);
      await check('sections[current].scrollWidth<=sections[current].clientWidth','no horizontal overflow '+width+'/'+index);
      await screenshot('profile-'+phase+'-'+(width===390?'mobile':'desktop')+'-'+(index+1));
    }
  }
  test(errors.length===0,'no unexpected capture errors: '+errors.join(' '));
  const report={passed:checks,errors,phase,slides:[10,11,12,13,14,15],desktop:'1440x1000',mobile:'390x844'};
  fs.writeFileSync(path.join(root,'test-results','profile-'+phase+'-capture-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));await send('Browser.close');ownedBrowser=false;
})().catch(async error=>{console.error(error);if(send&&ws?.readyState===1)try{await send('Browser.close');}catch{}if(ownedBrowser)browser?.kill();process.exitCode=1;});
