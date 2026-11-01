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
const base=process.env.TEST_BASE || 'http://127.0.0.1:8000';
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


  await check("slides.length===12 && sections.length===12 && document.querySelectorAll('.dot').length===12",'exactly twelve slides and navigation indicators');
  const expected=['Welcome to Central Perk','Modern Anxiety & Mental Overload','Why Do We Rewatch Friends?','The Science of Predictability','PIVOT! The 3D Experience','Friends Who Feel Like Family','Giving Your Brain a Break','The Nostalgia Effect','Iconic Quotes & Emotional Triggers','The Anxiety Simulator','Customize Your Comfort Zone','The One With Your Perfect Episode'];
  test(JSON.stringify(await evaluate('slides.map(s=>s.title)'))===JSON.stringify(expected),'required slide order');
  await evaluate("goTo(1); document.querySelector('#stress').value=90; document.querySelector('#stress').dispatchEvent(new Event('input'))");
  await check("document.querySelector('#stress-meter').value===90 && document.querySelector('#stress-value').textContent.includes('90')",'stress meter updates');
  await evaluate("goTo(2);document.querySelector('[data-reason]').click()");
  await check("document.querySelector('#comfort-detail').textContent.includes('Recognizing') && window.COMFORT_DATA.reasons.length===4",'Python data and interactive comfort chart');
  await evaluate("goTo(3);document.querySelector('#slide-4 summary').click()");
  await check("document.querySelector('#slide-4 details').open",'predictability reveal');
  await evaluate('goTo(4)');
  await waitFor("document.querySelector('#couch-view').dataset.state==='ready'",'Three.js couch mount');
  await evaluate("document.querySelector('#couch-turn').value=90;document.querySelector('#couch-turn').dispatchEvent(new Event('input'))");
  await check("document.querySelector('#couch-view').dataset.angle==='90'",'couch slider rotates scene');
  await evaluate("document.querySelector('#couch-view canvas').dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}))");
  await check("current===4 && document.querySelector('#couch-view').dataset.angle==='100'",'couch keyboard rotation consumes navigation key');
  await evaluate("document.querySelector('#couch-reset').click()");
  await check("document.querySelector('#couch-view').dataset.angle==='25'",'couch reset');
  await check("document.querySelectorAll('#slide-6 .character').length===6",'six character cards');
  await evaluate("goTo(5);document.querySelector('#slide-6 summary').click()");
  await check("document.querySelector('#slide-6 details').open",'character card reveal');
  await evaluate("goTo(6);document.querySelector('[data-load=new]').click()");
  await check("document.querySelector('#load-result').textContent==='Seli.' && document.querySelector('#load-scene').textContent.includes('Nera')",'cognitive load demonstration switches');
  await evaluate("document.querySelector('[data-load=familiar]').click()");
  await check("document.querySelector('#load-result').textContent==='Joey.'",'familiar scene restores');
  await evaluate("goTo(7);document.querySelector('[data-memory=\"2\"]').click()");
  await check("document.querySelector('#memory-year').textContent.startsWith('Today')",'nostalgia timeline');
  await evaluate("goTo(8);document.querySelector('[data-quote]').click()");
  await check("sections[8].dataset.quoteMood==='orange' && !document.querySelector('.quote-explanation').hidden",'quote reveal and theme');
  await evaluate("goTo(9);document.querySelector('#sim-start').value=40;document.querySelector('#sim-start').dispatchEvent(new Event('input'))");
  await check("document.querySelector('#sim-summary').textContent.includes('40 to 26') && document.querySelector('#slide-10').textContent.includes('NONCLINICAL')",'nonclinical simulation scales synthetic data');
  await evaluate("document.querySelector('#sim-mode').value='new';document.querySelector('#sim-mode').dispatchEvent(new Event('change'))");
  await check("document.querySelector('#sim-summary').textContent.includes('40 to 36')",'simulation scenario changes');
  await evaluate("goTo(10);for(const [id,value] of [['comfort-color','green'],['comfort-font','sans'],['comfort-mood','quiet']]){const el=document.getElementById(id);el.value=value;el.dispatchEvent(new Event('change'));}");
  await check("document.body.dataset.comfortColor==='green' && getComputedStyle(document.querySelector('#slide-11 h2')).fontFamily.includes('Arial') && getComputedStyle(sections[10]).backgroundColor==='rgb(255, 244, 222)'",'palette font and mood controls apply');
  await evaluate("document.querySelector('#comfort-reset').click()");
  await check("document.body.dataset.comfortColor==='classic' && document.body.dataset.comfortFont==='classic' && document.body.dataset.comfortMood==='classic' && sections[8].dataset.quoteMood===''",'reset restores defaults including quote mood');
  await check("document.querySelectorAll('#slide-12 .references a').length===3",'accessible reference links');
  // Version 0.5: real local Python, original assets, profile and research explorer.
  await waitFor("window.FriendsLab && document.querySelector('#simulation-engine').textContent.includes('Python 3')",'Python simulator execution',30000);
  await check("FriendsLab.episodes.length===22",'22 curated real episodes');
  await check("[...document.querySelectorAll('.original-art')].every(img=>img.complete && img.naturalWidth>0)",'original artwork loads');
  await evaluate("goTo(2);document.querySelector('[data-metric=loneliness]').click();document.querySelector('[data-research]').focus()");
  await check("document.querySelector('#research-tooltip').textContent.includes('2.64') && document.querySelector('#research-axis').textContent.includes('reverse-scored')",'published loneliness chart and accessible tooltip');
  await evaluate("document.querySelector('#slide-3 .evidence-open').click()");
  await check("document.querySelector('#research-explorer').open",'research modal opens');
  for(let i=0;i<7;i++){
    await evaluate(`document.querySelector('[data-figure="${i}"]').click()`);
    await waitFor("document.querySelector('#evidence-image').complete && document.querySelector('#evidence-image').naturalWidth>0",'original figure '+i);
    await check(`document.querySelector('#evidence-image').src.includes(FriendsLab.figures[${i}][3]) && document.querySelector('#figure-explanation').textContent.length>50`,'figure identity and explanation '+i);
  }
  await evaluate("document.querySelector('[data-figure=\"3\"]').click()");
  await check("document.querySelector('#figure-explanation').textContent.includes('not significant at .05')",'marginal rejection evidence distinguished');
  await evaluate("document.querySelector('#enlarge-figure').click()");
  await check("document.querySelector('#research-explorer').classList.contains('enlarged')",'figure enlargement');
  await screenshot('v05-research-explorer');
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
  await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
  await check("!document.querySelector('#research-explorer').open && document.activeElement.classList.contains('evidence-open')",'Escape closes dialog and restores focus');
  await evaluate("goTo(1);document.querySelector('#profile-stress').value=8;document.querySelector('#profile-stress').dispatchEvent(new Event('input'));goTo(5);document.querySelector('[data-profile=character]').value='Ross';document.querySelector('[data-profile=character]').dispatchEvent(new Event('change'));goTo(8);document.querySelector('[data-quote=orange]').click();goTo(11)");
  await waitFor("document.querySelector('#recommendation-status').textContent.includes('Python 3')",'Python recommendation execution',30000);
  await check("FriendsLab.profile.stress===8 && FriendsLab.profile.character==='Ross' && FriendsLab.profile.quote==='PIVOT!'",'progressive answers persist across navigation');
  await check("document.querySelector('.top-pick h3').textContent==='The One with the Cop' && document.querySelectorAll('.episode-result').length===3",'specific episode and two alternatives');
  await evaluate("document.querySelector('#why-episode').click()");
  await check("!document.querySelector('#score-details').hidden && document.querySelector('#score-details').textContent.includes('18 / 18')",'actual scoring breakdown exposed');
  await screenshot('v05-recommendation');
  await evaluate("document.querySelector('#try-again').click()");
  await check("document.querySelector('#revise-profile').open",'Try Again opens profile editor');
  await evaluate("document.querySelector('#surprise-me').click()");
  await waitFor("document.querySelector('#recommendation-status').textContent.includes('random discovery')",'Surprise Me returns real episode',30000);
  await check("document.querySelector('.top-pick h3').textContent!=='The One with the Cop' && FriendsLab.episodes.some(e=>e.title===document.querySelector('.top-pick h3').textContent)",'surprise changes to verified catalog entry');
  const parity=await evaluate(`(async()=>{const profiles=[{}, {quote:'PIVOT!'}, {mood:'overwhelmed',stress:10,character:'Phoebe',quote:'Smelly Cat',nostalgia:'low',familiarity:'new',predictability:'surprising',experience:'warmth'}];for(const p of profiles){const result=await(await fetch('/api/recommend',{method:'POST',body:JSON.stringify(p)})).json();const js=FriendsLab.episodes.map(e=>FriendsLab.fallbackScore(e,p)).sort((a,b)=>b.score-a.score||a.episode.season-b.episode.season||a.episode.episode-b.episode.episode).slice(0,3);const canonical=x=>JSON.stringify(x,(_,v)=>v && typeof v==='object' && !Array.isArray(v)?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b))):v);if(canonical(result.recommendations)!==canonical(js))return {python:result.recommendations,js};}return true;})()`);
  assert.equal(parity,true,JSON.stringify(parity));checks++;
  await send('Page.reload');
  await waitFor("window.FriendsLab && FriendsLab.profile.stress===8 && FriendsLab.profile.quote==='PIVOT!'",'profile survives tab reload');
  await evaluate("document.querySelector('#reset-profile').click()");
  await waitFor("Object.keys(FriendsLab.profile).length===0 && document.querySelector('#recommendation-status').textContent.includes('Python 3')",'reset and incomplete profile handled',30000);
  await check("document.querySelector('.top-pick').textContent.includes('0.00%')",'empty profile never invents a confidence score');
  await evaluate("window.originalLabFetch=window.fetch;window.fetch=(url,...args)=>String(url).startsWith('/api/')?Promise.reject(Error('Test unavailable Python')):window.originalLabFetch(url,...args);FriendsLab.loadRecommendation()");
  await waitFor("document.querySelector('#recommendation-status').textContent.includes('JavaScript fallback')",'unavailable Python labeled fallback');
  await evaluate("FriendsLab.drawComfort()");
  await waitFor("document.querySelector('#simulation-engine').textContent.includes('JavaScript illustrative fallback')",'simulation fallback');
  await evaluate("window.fetch=window.originalLabFetch;goTo(10);document.querySelector('#comfort-size').value='1.3';document.querySelector('#comfort-size').dispatchEvent(new Event('change'));document.querySelector('#quiet-motion').click()");
  await check("document.body.classList.contains('quiet-motion') && getComputedStyle(document.documentElement).getPropertyValue('--lab-font-scale')==='1.3'",'font size and decorative motion controls');
  await evaluate("document.querySelector('#comfort-reset').click()");
  for(const i of [2,4,5,9,10,11]){await evaluate('goTo('+i+')');await pause(400);await screenshot('v04-slide-'+(i+1));}

  for(let i=0;i<12;i++){
    await evaluate(`document.querySelectorAll('.dot')[${i}].click()`);
    await check(`current===${i}&&document.querySelectorAll('.slide:not([hidden])').length===1`,'indicator '+(i+1));
    await check("document.querySelector('#current').textContent===String(current+1).padStart(2,'0') && Math.abs(parseFloat(document.querySelector('#progress-fill').style.width)-(current+1)/12*100)<.01",'counter and progress '+i);
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
