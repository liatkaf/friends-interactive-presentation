// Dependency-free Edge/Chromium smoke test. First run: node serve.cjs
// Then: node tests/browser-test.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const pause = ms => new Promise(resolve=>setTimeout(resolve,ms));
const port = 9368;
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


  await waitFor('window.FriendsLab','profile initialized');
  await evaluate("document.querySelector('[data-answer=mood][data-value=overwhelmed]').click();document.querySelector('#profile-stress').value=10;document.querySelector('#profile-stress').dispatchEvent(new Event('input'));document.querySelector('[data-answer=character][data-value=Phoebe]').click();document.querySelectorAll('[data-answer=quote]')[3].click();document.querySelector('[data-answer=experience][data-value=warmth]').click();document.querySelector('[data-answer=familiarity][data-value=rewatcher]').click();document.querySelector('[data-answer=nostalgia][data-value=high]').click()");
  const results=[];
  for(const [width,height] of [[1440,1000],[1366,768],[1024,768],[768,1000],[390,844],[320,844]]){
    await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<600});
    for(let index=9;index<=14;index++){
      await evaluate(`goTo(${index});presentation.focus();FriendsNavigation.hide()`);await pause(50);
      const row=await evaluate(`(()=>{const s=sections[current],r=x=>Math.round(s.querySelector(x)?.getBoundingClientRect().height||0);return {slide:current+1,scroll:s.scrollHeight,client:s.clientHeight,width:s.scrollWidth,clientWidth:s.clientWidth,h2:r('h2'),progress:r('.question-progress'),foot:r('.question-foot'),body:r('.profile-enhanced')};})()`);
      results.push({width,height,...row});
      if(row.scroll>row.client+1||row.width>row.clientWidth)await screenshot('profile-layout-'+width+'-'+(index+1));
    }
  }
  const failures=results.filter(r=>r.scroll>r.client+1||r.width>r.clientWidth);
  fs.writeFileSync(path.join(root,'test-results','profile-layout-results.json'),JSON.stringify({measurements:results,failures,errors},null,2));console.log(JSON.stringify({failures,errors}));await send('Browser.close');ownedBrowser=false;
  test(failures.length===0&&errors.length===0,'profile layouts fit all tested viewports');
})().catch(async error=>{console.error(error);if(send&&ws?.readyState===1)try{await send('Browser.close');}catch{}if(ownedBrowser)browser?.kill();process.exitCode=1;});
