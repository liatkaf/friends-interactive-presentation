// Dependency-free Edge/Chromium smoke test. First run: node serve.cjs
// Then: node tests/browser-test.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const pause = ms => new Promise(resolve=>setTimeout(resolve,ms));
const port = 9365;
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


  await waitFor("window.JoeyStory&&window.FriendsLab",'refined presentation initialized');
  await check("sections.length===17&&slides.length===17&&!slides.some(s=>s.title==='The One Where You Feel Left Out')&&!document.querySelector('.comic-panel,.social-story,[data-social-stage]')",'exactly 17 slides, retired story/comic absent');
  await check("slides[3].title==='The One With the Missing Punchline'&&slides[6].title==='The Self-Control Recovery Lab'",'contiguous revised order');
  await evaluate('goTo(3);window.beforeJoey=JSON.stringify(FriendsLab.profile)');
  await check("JoeyStory.state.stage==='ready'&&document.querySelector('.joey-punchline').hidden&&document.querySelector('.joey-reaction-art').hidden&&document.querySelector('#joey-prediction').hidden&&document.querySelector('#joey-takeaway').hidden",'answer and educational reveal hidden before prediction');
  await check("document.querySelectorAll('[data-joey-choice]').length===3&&document.querySelector('#joey-play').tagName==='BUTTON'",'three semantic selectable predictions');
  await evaluate("new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>image.naturalWidth>1000?resolve():reject(Error('Small illustration'));image.onerror=reject;image.src='assets/joey/restaurant-storyboard.png'})");checks++;
  await evaluate('presentation.focus();FriendsNavigation.hide()');await screenshot('v10-final-joey-desktop-ready');
  const started=Date.now();await evaluate("document.querySelector('#joey-play').click()");
  await check("JoeyStory.state.stage==='setup'&&document.querySelector('#joey-prediction').hidden",'setup begins without revealing choices or punchline');
  await waitFor("JoeyStory.state.stage==='freeze'",'setup freezes for prediction');
  test(Date.now()-started>=5000,'setup pacing includes at least five seconds');
  await check("!document.querySelector('#joey-prediction').hidden&&document.querySelector('.joey-punchline').hidden&&document.querySelector('#joey-takeaway').hidden",'freeze awaits choice indefinitely without answer');
  await screenshot('v10-final-joey-desktop-freeze');
  await evaluate("document.querySelector('[data-joey-choice=share]').focus()");
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r'});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
  await check("current===3&&JoeyStory.state.selected==='share'&&JoeyStory.state.stage==='beat'&&document.querySelector('.joey-punchline').hidden",'native Enter predicts without navigating; comedic beat precedes reveal');
  await waitFor("JoeyStory.state.stage==='complete'",'reaction then educational takeaway');
  await check("!document.querySelector('.joey-punchline').hidden&&!document.querySelector('.joey-reaction-art').hidden&&!document.querySelector('#joey-takeaway').hidden&&document.querySelector('#joey-takeaway').textContent.includes('knowing what happens next')",'reaction and explicit purpose revealed progressively');
  await check("JSON.stringify(FriendsLab.profile)===beforeJoey&&!document.querySelector('#joey-story [data-answer]')",'unscored interaction never changes recommendation profile');
  await evaluate('presentation.focus();FriendsNavigation.hide()');await screenshot('v10-final-joey-desktop-reveal');
  await evaluate("document.querySelector('#joey-replay').click()");
  await check("JoeyStory.state.stage==='setup'&&JoeyStory.state.selected===null&&document.querySelector('.joey-punchline').hidden&&document.querySelector('#joey-takeaway').hidden",'replay resets all reveal state and starts fresh');
  await evaluate('goTo(4)');await check("JoeyStory.state.pendingTimers===0&&JoeyStory.state.stage==='ready'",'leaving cancels all setup/reveal timers');
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  for(const value of ['share','ignore','react']){
    await evaluate("goTo(3);document.querySelector('#joey-play').click()");
    await check("JoeyStory.state.stage==='freeze'&&JoeyStory.state.pendingTimers===0",'reduced motion exposes prediction without animation '+value);
    await evaluate(`document.querySelector('[data-joey-choice=${value}]').click()`);
    await check("JoeyStory.state.stage==='complete'&&JoeyStory.state.pendingTimers===0&&document.querySelector('#joey-caption').textContent.includes('timing')",'every choice leads to same non-scored educational payoff '+value);
    await evaluate("document.querySelector('#joey-replay').click()");
    await check("JoeyStory.state.selected===null&&document.querySelectorAll('[data-joey-choice][aria-pressed=true]').length===0",'replay clears prediction '+value);
  }
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await evaluate('goTo(3);presentation.focus();FriendsNavigation.hide()');await screenshot('v10-final-joey-mobile-freeze');
  await check("sections[3].scrollWidth<=sections[3].clientWidth&&document.querySelector('.joey-scene').getBoundingClientRect().width>300",'mobile artwork fits without horizontal clipping');
  await evaluate("document.querySelector('[data-joey-choice=react]').click()");await screenshot('v10-final-joey-mobile-reveal');
  for(const width of [1366,320]){
    await send('Emulation.setDeviceMetricsOverride',{width,height:width===1366?768:844,deviceScaleFactor:1,mobile:width<600});
    await evaluate("goTo(3);document.querySelector('#joey-replay').click();presentation.focus();FriendsNavigation.hide()");
    await check("sections[3].scrollWidth<=sections[3].clientWidth",'prediction fits '+width);
    if(width===1366)await check("sections[3].scrollHeight<=sections[3].clientHeight+1",'prediction fits laptop height');
    await evaluate("document.querySelector('[data-joey-choice=react]').click()");
    await check("sections[3].scrollWidth<=sections[3].clientWidth",'payoff fits '+width);
    if(width===1366){await check("sections[3].scrollHeight<=sections[3].clientHeight+1",'educational purpose fits laptop height');await screenshot('v10-final-joey-laptop-reveal');}
  }
  await evaluate("document.querySelector('#comfort-mood').value='night';document.querySelector('#comfort-mood').dispatchEvent(new Event('change'))");
  await check("getComputedStyle(document.querySelector('.joey-headline')).color==='rgb(227, 198, 143)'",'Joey headline stays legible in night theme');
  await evaluate("document.querySelector('#comfort-mood').value='classic';document.querySelector('#comfort-mood').dispatchEvent(new Event('change'))");
  await evaluate("goTo(5);document.querySelector('#belonging-evidence').open=true");
  for(const id of [0,1,2,3]){
    await evaluate(`document.querySelector('[data-inline-figure="${id}"]').click()`);
    await check(`document.querySelector('#belonging-evidence .study-finding').textContent===FRIENDS_V05.research.figures[${id}].takeaway&&document.querySelector('#belonging-evidence [data-enlarge]').dataset.enlarge==='${id}'`,'retained unique research and original figure '+id);
  }
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await evaluate("document.querySelector('#belonging-evidence').scrollIntoView({block:'start'});presentation.focus({preventScroll:true});FriendsNavigation.hide()");await screenshot('v10-final-belonging-evidence');
  await evaluate("document.querySelector('#belonging-evidence').open=false;goTo(16);presentation.focus()");await waitFor('FriendsLab.result','recommendation remains available');
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r'});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
  await check("current===16&&document.querySelector('#next').disabled&&document.querySelector('#current').textContent==='17'",'final slide boundary/counter after renumbering');
  await evaluate("location.hash='#slide-18'");await waitFor("current===16&&location.hash==='#slide-17'",'obsolete final-slide hash canonicalizes to new final slide');
  test(errors.length===0,'no unexpected refinement errors: '+errors.join(' '));
  const report={passed:checks,errors,primarySlides:17,suite:'Joey anticipation, progressive payoff, replay, keyboard, reduced motion and retained evidence'};
  fs.writeFileSync(path.join(root,'test-results','v10-final-joey-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));await send('Browser.close');ownedBrowser=false;
})().catch(async error=>{console.error(error);if(send&&ws?.readyState===1)try{await send('Browser.close');}catch{}if(ownedBrowser)browser?.kill();process.exitCode=1;});
