// Dependency-free Edge/Chromium smoke test. First run: node serve.cjs
// Then: node tests/browser-test.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const pause = ms => new Promise(resolve=>setTimeout(resolve,ms));
const port = 9341;
const root=path.resolve(__dirname,'..');
const base='http://127.0.0.1:8000';
const edge=process.env.BROWSER_PATH || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
let browser,ws,send,ownedBrowser=false;
(async()=>{
  const {sampleSpin,SPIN_DURATION,REST_YAW}=await import(pathToFileURL(path.join(root,'animation-timeline.mjs')));
  let checks=0;
  const test=(value,label)=>{assert.ok(value,label);checks++;};
  test(SPIN_DURATION===5000,'fixed 5000ms timeline');
  test(!sampleSpin(1000,5999).done,'not done at 4999ms');
  test(sampleSpin(1000,6000).done,'done at exactly 5000ms');
  test(sampleSpin(1000,9000).yaw===REST_YAW+2*Math.PI,'clamped endpoint');
  test(sampleSpin(1000,0).progress===0,'clamped start');
  await fetch(base).catch(()=>{throw Error('Start the local server first: node serve.cjs');});
  const profile=fs.mkdtempSync(path.join(os.tmpdir(),'friends-mug-test-'));
  browser=spawn(edge,['--headless','--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader',`--remote-debugging-port=${port}`,`--user-data-dir=${profile}`,'about:blank'],{windowsHide:true,stdio:'ignore'});
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
  await waitFor(`document.querySelector('.coffee-experience')?.coffeeMug`,'Three.js mount',60000);
  await waitFor(`document.querySelector('.coffee-experience').coffeeMug.state.startedAt!==null`,'initial autoplay');
  await check(`document.querySelector('.coffee-experience').dataset.threeRevision==='170'`,'genuine local Three.js r170');
  await check(`document.querySelector('.coffee-experience').coffeeMug.state.renderCalls>0`,'WebGL draw calls');
  await waitFor(`!document.querySelector('.coffee-experience').coffeeMug.state.spinning`,'five-second finish');
  // Observe within the page so slow DevTools round-trips cannot miss a five-second turn.
  const observed=await evaluate(`(async()=>{
    const host=document.querySelector('.coffee-experience'),button=document.querySelector('#replay-mug');
    button.click();const disabled=button.disabled,started=host.coffeeMug.state.spinning;
    document.querySelector('#next').click();const next=current===1;
    document.querySelector('#previous').click();const previous=current===0;
    const samples=[host.coffeeMug.state.yaw];
    await new Promise(resolve=>{const sample=()=>{samples.push(host.coffeeMug.state.yaw);if(host.coffeeMug.state.spinning)requestAnimationFrame(sample);else resolve();};requestAnimationFrame(sample);});
    return {disabled,started,next,previous,rotates:new Set(samples).size>2,samples:samples.length};
  })()`);
  test(observed.disabled,'replay disabled during spin');test(observed.started,'Replay starts a spin');
  test(observed.next,'Next works during rotation');test(observed.previous,'Previous works during rotation');test(observed.rotates,'mug rotates across animation frames');
  await check(`document.querySelector('.coffee-experience').dataset.elapsedMs==='5000'`,'elapsed clamped exactly at 5000');
  await check(`!document.querySelector('#replay-mug').disabled`,'replay available after finish');
  const finalYaw=await evaluate(`document.querySelector('.coffee-experience').coffeeMug.state.yaw`);
  await pause(350);
  test(await evaluate(`document.querySelector('.coffee-experience').coffeeMug.state.yaw`)===finalYaw,'automatic rotation stops');
  await screenshot('mug-desktop-ready');
  const bounds=await evaluate(`(()=>{const r=document.querySelector('.coffee-view canvas').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);
  await send('Input.dispatchMouseEvent',{type:'mousePressed',x:bounds.x,y:bounds.y,button:'left',clickCount:1});
  await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:bounds.x+65,y:bounds.y+12,button:'left',buttons:1});
  await send('Input.dispatchMouseEvent',{type:'mouseReleased',x:bounds.x+65,y:bounds.y+12,button:'left',clickCount:1});
  test(await evaluate(`document.querySelector('.coffee-experience').coffeeMug.state.yaw`)!==finalYaw,'real mouse drag changes orientation');
  await evaluate(`document.querySelector('.coffee-view canvas').dispatchEvent(new KeyboardEvent('keydown',{key:'Home',bubbles:true}))`);
  await check(`Math.abs(document.querySelector('.coffee-experience').coffeeMug.state.yaw-(${REST_YAW}))<.00001 && current===0`,'focused mug keyboard reset does not navigate');
  await check(`(()=>{document.querySelector('#replay-mug').click();return document.querySelector('.coffee-experience').coffeeMug.state.spinning})()`,'Replay starts another spin');
  await waitFor(`!document.querySelector('.coffee-experience').coffeeMug.state.spinning`,'replay finishes');
  // Simulate loss of GPU support and ensure the fallback preserves navigation.

  for(let i=0;i<12;i++){
    await evaluate(`document.querySelectorAll('.dot')[${i}].click()`);
    await check(`current===${i}&&document.querySelectorAll('.slide:not([hidden])').length===1`,'indicator '+(i+1));
  }
  await check(`document.querySelector('#next').disabled`,'last boundary');
  await evaluate(`document.querySelector('[data-go="0"]').click()`);await check(`current===0&&document.querySelector('#previous').disabled`,'restart and first boundary');
  await evaluate(`document.querySelector('[data-go="1"]').click()`);await check(`current===1`,'start');
  for(let i=2;i<12;i++){await evaluate(`document.querySelector('#next').click()`);await check(`current===${i}`,'Next '+i);}
  for(let i=10;i>=0;i--){await evaluate(`document.querySelector('#previous').click()`);await check(`current===${i}`,'Previous '+i);}
  for(const [key,index] of [['End',11],['Home',0],['ArrowRight',1],['ArrowLeft',0]]){
    await evaluate(`document.body.dispatchEvent(new KeyboardEvent('keydown',{key:'${key}',bubbles:true}))`);await check(`current===${index}`,'keyboard '+key);
  }
  await evaluate(`location.hash='#slide-8'`);await waitFor(`current===7`,'hash navigation');
  await send('Page.reload');await waitFor(`typeof current!=='undefined'&&current===7`,'deep-link reload');
  await waitFor(`document.querySelector('.coffee-experience')?.coffeeMug`,'hidden slide mount',60000);
  await check(`!document.querySelector('.coffee-experience').coffeeMug.state.spinning`,'no autoplay while slide 1 hidden');

  for(const width of [1440,1024,768,390,320]){
    await send('Emulation.setDeviceMetricsOverride',{width,height:width<600?844:1000,deviceScaleFactor:1,mobile:width<600});
    for(let i=0;i<12;i++){
      await evaluate(`goTo(${i})`);await pause(100);
      await check(`sections[current].scrollWidth<=sections[current].clientWidth`,'no horizontal overflow '+width+'/'+i);
      await check(`document.querySelector('.controls').getBoundingClientRect().bottom<=innerHeight`,'navigation fits '+width+'/'+i);
    }
    if(width===390){await evaluate(`goTo(0);document.querySelector('.coffee-experience').scrollIntoView({block:'center'})`);await pause(900);await screenshot('mug-mobile');}
  }
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await evaluate(`goTo(0);document.querySelector('.coffee-experience').scrollIntoView({block:'center'})`);await pause(300);
  await check(`!document.querySelector('.coffee-experience').coffeeMug.state.spinning&&document.querySelector('.coffee-experience').coffeeMug.state.reducedMotion`,'reduced-motion static view');
  const staticYaw=await evaluate(`document.querySelector('.coffee-experience').coffeeMug.state.yaw`);await pause(150);
  test(await evaluate(`document.querySelector('.coffee-experience').coffeeMug.state.yaw`)===staticYaw,'reduced-motion orientation stable');
  await evaluate(`document.querySelector('#replay-mug').click()`);await check(`!document.querySelector('.coffee-experience').coffeeMug.state.spinning`,'reduced motion respected by replay');
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await screenshot('mug-reduced-motion');
  test(requests.every(url=>url.startsWith(base)||url.startsWith('data:')),'no external network dependencies');
  test(errors.length===0,'no JavaScript or WebGL errors: '+errors.join('\n'));
  const normalErrors=[...errors];
  const injected=await send('Page.addScriptToEvaluateOnNewDocument',{source:`const originalGetContext=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(kind,...args){return kind==='webgl2'||kind==='webgl'||kind==='experimental-webgl'?null:originalGetContext.call(this,kind,...args);};`});
  await send('Page.reload');await waitFor(`document.querySelector('.coffee-experience')?.dataset.state==='fallback'`,'no-WebGL fallback');
  await evaluate(`goTo(11)`);await check(`current===11`,'navigation works without WebGL');
  await send('Page.removeScriptToEvaluateOnNewDocument',{identifier:injected.identifier});
  // Confirm that the non-module file:// fallback still allows the whole presentation to work.
  await send('Page.navigate',{url:pathToFileURL(path.join(root,'index.html')).href});
  await waitFor(`document.querySelector('.coffee-experience')?.dataset.state==='fallback'`,'file fallback');
  await evaluate(`goTo(11)`);await check(`current===11`,'navigation works in fallback');
  console.log(JSON.stringify({passed:checks,errors:normalErrors,expectedFallbackErrors:errors.slice(normalErrors.length),externalRequests:requests.filter(url=>!url.startsWith(base)&&!url.startsWith('data:')&&!url.startsWith('file:')),screenshots:'test-results/'},null,2));
  await send('Browser.close');ownedBrowser=false;
})().catch(async error=>{console.error(error);if(send&&ws?.readyState===1)try{await send('Browser.close');}catch{}if(ownedBrowser)browser?.kill();process.exitCode=1;});
