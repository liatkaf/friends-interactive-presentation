// Dependency-free Edge/Chromium smoke test. First run: node serve.cjs
// Then: node tests/browser-test.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const pause = ms => new Promise(resolve=>setTimeout(resolve,ms));
const port = 9352;
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

  await waitFor("window.FriendsLab",'lab initialized');
  await waitFor("document.querySelector('.coffee-experience')?.coffeeMug",'mug mount',60000);
  await pause(1000);
  await screenshot('v09-mug-before-touch');
  await send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
  const touchBounds=await evaluate("(()=>{const r=document.querySelector('.coffee-view canvas').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()");
  const touchYaw=await evaluate("document.querySelector('.coffee-experience').coffeeMug.state.yaw");
  await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[touchBounds]});
  await send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:touchBounds.x+50,y:touchBounds.y}]});
  await check(`document.querySelector('.coffee-experience').coffeeMug.state.dragging&&document.querySelector('.coffee-experience').coffeeMug.state.yaw>${touchYaw}+.4`,'real touch drag rotates mug');
  await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await check("!document.querySelector('.coffee-experience').coffeeMug.state.dragging",'touch release ends drag');
  await send('Emulation.setTouchEmulationEnabled',{enabled:false});
  await evaluate("goTo(10);document.querySelector('[data-answer=mood][data-value=happy]').click();goTo(11);document.querySelector('#profile-stress').value=8;document.querySelector('#profile-stress').dispatchEvent(new Event('input'));goTo(12);document.querySelector('[data-answer=character][data-value=Ross]').click();goTo(13);document.querySelector('[data-answer=quote]').click();goTo(14);document.querySelector('[data-answer=experience][data-value=laughter]').click();goTo(15);document.querySelector('[data-answer=familiarity][data-value=rewatcher]').click();document.querySelector('[data-answer=nostalgia][data-value=high]').click()");
  for(const width of [1440,390]){
    await send('Emulation.setDeviceMetricsOverride',{width,height:width===390?844:1000,deviceScaleFactor:1,mobile:width===390});
    for(let i=0;i<18;i++){await evaluate('goTo('+i+')');if(i===4)await waitFor("document.querySelector('#stairwell-view').dataset.mode==='three'",'stairwell ready',30000);if(i===8){await evaluate("document.querySelector('#rewind').click()");await waitFor("document.querySelector('#rewind-stage').dataset.state==='ready'",'rewind revealed');}if(i===9)await waitFor("document.querySelector('#lobster-story').dataset.step==='3'",'lobsters meet');if(i>=16)await waitFor("FriendsLab.result && !document.querySelector('#view-result').disabled",'matching ready',30000);await evaluate('presentation.focus();FriendsNavigation.hide()');await pause(700);await screenshot('v09-'+(width===390?'mobile':'desktop')+'-'+String(i+1).padStart(2,'0'));}
  }
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await evaluate("goTo(17);document.querySelector('#why-episode').click()");await evaluate('presentation.focus();FriendsNavigation.hide()');await pause(700);await screenshot('v09-score-details');
  await evaluate("document.querySelector('#score-details .dialog-close').click();goTo(7);document.querySelector('[data-enlarge=\"4\"]').click()");await pause(500);await screenshot('v09-research-enlarged');
  test(errors.length===0,'no unexpected screenshot-run JavaScript errors');
  const report={passed:checks,errors,desktop:'1440x1000',mobile:'390x844',primarySlides:18};
  fs.writeFileSync(path.join(root,'test-results','v09-capture-results.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify(report));await send('Browser.close');ownedBrowser=false;
})().catch(async error=>{console.error(error);if(send&&ws?.readyState===1)try{await send('Browser.close');}catch{}if(ownedBrowser)browser?.kill();process.exitCode=1;});
