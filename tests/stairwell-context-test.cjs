// Dependency-free Edge/Chromium smoke test. First run: node serve.cjs
// Then: node tests/browser-test.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const pause = ms => new Promise(resolve=>setTimeout(resolve,ms));
const port = 9343;
const root=path.resolve(__dirname,'..');
const base=process.env.TEST_BASE || 'http://127.0.0.1:8000';
const edge=process.env.BROWSER_PATH || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
let browser,ws,send,ownedBrowser=false;
(async()=>{
  const {advanceYaw,approachSpeed,REST_YAW}=await import(pathToFileURL(path.join(root,'animation-timeline.mjs')));
  let checks=0;
  const test=(value,label)=>{assert.ok(value,label);checks++;};
  test(Math.abs(advanceYaw(1,50)-1.011)<1e-9,'continuous visible-frame integration');
  test(advanceYaw(1,-1)===1,'negative time ignored');
  test(Math.abs(advanceYaw(0,60000)-.022)<1e-9,'large gaps cannot cause an angle jump');
  test(approachSpeed(0,.22,50)>0&&approachSpeed(0,.22,50)<.22,'speed resumes smoothly');
  test(advanceYaw(100,50)>100,'yaw never wraps or resets at a full turn');
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
  await send('Page.bringToFront');

  await waitFor("window.PivotChallenge",'challenge initialized');
  await evaluate('goTo(4)');await waitFor("document.querySelector('#stairwell-view').dataset.mode==='three'",'stairwell WebGL ready');
  await check("!!document.querySelector('#stairwell-view canvas').getContext('webgl2').getExtension('WEBGL_lose_context')",'context-loss test extension available');
  await evaluate("document.querySelector('#stairwell-view canvas').getContext('webgl2').getExtension('WEBGL_lose_context').loseContext()");
  await waitFor("document.querySelector('#stairwell-view').dataset.mode==='fallback'",'context loss enters illustrated fallback');
  await check("getComputedStyle(document.querySelector('#stairwell-view canvas')).display==='none' && !document.querySelector('.stairwell-fallback').hidden",'lost canvas cannot obscure fallback');
  await evaluate("document.querySelector('#move-up').click();document.querySelector('#move-up').click();document.querySelector('#move-up').click();document.querySelector('#pivot-couch').click();document.querySelector('#move-up').click()");
  await check("PivotChallenge.state.stage===3&&PivotChallenge.state.score===85&&document.querySelector('#stairwell-view').dataset.pivoted==='true'",'game remains playable after real context loss');
  await pause(900);
  await check("(()=>{const h=document.querySelector('#stairwell-view').getBoundingClientRect(),r=document.querySelector('.fallback-couch').getBoundingClientRect();return Math.abs(r.x+r.width/2-h.x-h.width*.77)<3&&Math.abs(r.y+r.height/2-h.y-h.height*.22)<3})()",'illustrated couch reaches actual final position');
  await screenshot('v09-live-context-fallback');
  await evaluate("document.querySelector('#reset-challenge').click()");await check("PivotChallenge.state.stage===0&&PivotChallenge.state.score===100",'reset after context loss');
  test(errors.length===0,'no unexpected errors during real context loss: '+errors.join(' '));
  const report={passed:checks,errors,suite:'Real WebGL context-loss recovery'};
  fs.writeFileSync(path.join(root,'test-results','v09-context-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));await send('Browser.close');ownedBrowser=false;
})().catch(async error=>{console.error(error);if(send&&ws?.readyState===1)try{await send('Browser.close');}catch{}if(ownedBrowser)browser?.kill();process.exitCode=1;});
