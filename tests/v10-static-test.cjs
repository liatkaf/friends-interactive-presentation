// Dependency-free Edge/Chromium smoke test. First run: node serve.cjs
// Then: node tests/browser-test.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const pause = ms => new Promise(resolve=>setTimeout(resolve,ms));
const port = 9363;
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


  await waitFor("window.FriendsLab&&document.querySelector('.coffee-experience')?.coffeeMug",'static HTTP genuine Three.js mug mounts',60000);
  await check("document.querySelector('.coffee-experience').dataset.threeRevision==='170'&&!document.querySelector('.utility-bar,.coffee-controls,#replay-mug')",'static host has preserved 3D and quiet header');
  await check("slides.length===17&&document.querySelector('#joey-story')&&!document.querySelector('.social-story')",'static host uses refined 17-slide deck');
  await evaluate("goTo(3);new Promise((resolve,reject)=>{const image=new Image();image.onload=resolve;image.onerror=reject;image.src='assets/joey/restaurant-storyboard.png'})");checks++;
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await evaluate("document.querySelector('#joey-play').click();document.querySelector('[data-joey-choice=react]').click()");
  await check("JoeyStory.state.stage==='complete'&&!document.querySelector('#joey-takeaway').hidden",'static host supports new lesson without Python/API');
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  await evaluate('goTo(5);document.querySelector("#belonging-evidence").open=true');
  await check("document.querySelectorAll('#belonging-evidence .evidence-row').length===3&&FRIENDS_V05.research.generated_by.includes('Python 3 build-time')",'pre-generated research loads without analytics API');
  await check("!!window.FriendsFinal&&Object.keys(FRIENDS_ANIMATIONS.animations).length===8",'eight Python exports load on static host');
  await evaluate("document.querySelector('#belonging-evidence [data-animation-play]').click()");
  await waitFor("FriendsFinal.state.players.some(p=>p.key==='evidence-0'&&p.draws>1)",'static host plays actual Python-authored frames');
  await evaluate("document.querySelector('[data-inline-figure=\"3\"]').click();document.querySelector('#belonging-evidence [data-enlarge]').click()");
  await waitFor("document.querySelector('#evidence-image').complete&&document.querySelector('#evidence-image').naturalWidth>0",'static host original research reference');
  await evaluate("document.querySelector('#research-explorer .dialog-close').click();goTo(11);document.querySelector('[data-answer=character][data-value=Phoebe]').click();goTo(12);document.querySelector('[data-answer=quote][data-value=\"Smelly Cat\"]').click();goTo(16)");
  await waitFor("FriendsLab.result&&FriendsLab.engine.includes('JavaScript fallback')",'static host scores without Python recommendation backend');
  await check("FriendsLab.result.recommendations[0].factors.some(f=>f.factor==='quote'&&f.points===18)&&!/Python|JavaScript|fallback/i.test(document.querySelector('#recommendation-status').textContent)",'fallback uses current profile and keeps diagnostics out of ordinary UI');
  await evaluate("document.querySelector('#try-again').click()");await check("current===9&&Object.keys(FriendsLab.profile).length===0&&FriendsLab.result===null",'static reset works');
  test(errors.length===0,'no unexpected static-host JavaScript errors: '+errors.join(' '));
  const report={passed:checks,errors,suite:'Static HTTP / Pages-compatible assets; no Python recommendation API',url:base};
  fs.writeFileSync(path.join(root,'test-results','v10-final-static-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));await send('Browser.close');ownedBrowser=false;
})().catch(async error=>{console.error(error);if(send&&ws?.readyState===1)try{await send('Browser.close');}catch{}if(ownedBrowser)browser?.kill();process.exitCode=1;});
