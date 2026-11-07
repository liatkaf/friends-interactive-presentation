// Dependency-free Edge/Chromium smoke test. First run: node serve.cjs
// Then: node tests/browser-test.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const pause = ms => new Promise(resolve=>setTimeout(resolve,ms));
const port = 9369;
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


  await waitFor("window.FriendsLab&&document.querySelectorAll('.profile-enhanced').length===6",'static profile initializes');
  await waitFor("[...document.querySelectorAll('.portrait-gallery img')].every(x=>x.complete&&x.naturalWidth===400)",'static host loads all six optimized portraits');
  for(const [field,index,count] of [['mood',9,6],['character',11,6],['quote',12,6],['experience',13,5],['familiarity',14,3],['nostalgia',14,3]]){
    await evaluate(`goTo(${index});document.querySelectorAll('[data-answer="${field}"]')[${count-1}].click()`);
    await check(`document.querySelectorAll('[data-answer="${field}"][aria-pressed=true]').length===1&&FriendsLab.profile.${field}===document.querySelectorAll('[data-answer="${field}"]')[${count-1}].dataset.value`,'static single selection '+field);
  }
  await evaluate("goTo(10);document.querySelector('#profile-stress').value=7;document.querySelector('#profile-stress').dispatchEvent(new Event('input'))");
  await check("FriendsLab.profile.stress===7&&document.querySelector('#stress-o-meter').dataset.band==='high'&&document.querySelector('#profile-stress-value').textContent==='7'",'static native input drives gauge');
  const fixture=JSON.parse(fs.readFileSync(path.join(root,'tests','fixtures','pre-profile-recommendations.json'),'utf8'));
  const currentQuotes=new Set(JSON.parse(fs.readFileSync(path.join(root,'data','quotes.json'),'utf8')).map(q=>q.id));
  fixture.cases=fixture.cases.filter(c=>!c.profile.quote||currentQuotes.has(c.profile.quote)); // Retired quote cases remain in the historical fixture.
  for(let i=0;i<fixture.cases.length;i++){
    const item=fixture.cases[i];
    await check(`(()=>{const canonical=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b))):v);return canonical(FriendsLab.fallbackRecommend(${JSON.stringify(item.profile)}).recommendations)===canonical(${JSON.stringify(item.recommendations)});})()`,'static ranking remains baseline-equivalent '+i);
  }
  await evaluate('goTo(16)');await waitFor("FriendsLab.result&&FriendsLab.engine.includes('JavaScript fallback')",'static matching fallback works without Python');
  await check("!document.querySelector('#recommendation-status').textContent.includes('fallback')&&FriendsLab.profile.stress===7",'static mode retains profile without technical user messages');
  await evaluate("document.querySelector('#try-again').click()");
  await check("current===9&&Object.keys(FriendsLab.profile).length===0&&document.querySelector('#stress-o-meter').dataset.answered==='false'&&document.querySelector('#comfort-order').dataset.ordered==='false'&&document.querySelector('#profile-completion-cue').dataset.complete==='false'",'static full reset updates every new visual');
  const webp=await fetch(base+'/assets/portraits/monica.webp');await webp.arrayBuffer();test(webp.ok&&webp.headers.get('content-type').includes('image/webp'),'static WebP MIME type');
  test(errors.length===0,'no unexpected static profile errors: '+errors.join(' '));
  const report={passed:checks,errors,goldenCases:fixture.cases.length,mode:'Clean static HTTP, no Python API'};
  fs.writeFileSync(path.join(root,'test-results','profile-static-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));await send('Browser.close');ownedBrowser=false;
})().catch(async error=>{console.error(error);if(send&&ws?.readyState===1)try{await send('Browser.close');}catch{}if(ownedBrowser)browser?.kill();process.exitCode=1;});
