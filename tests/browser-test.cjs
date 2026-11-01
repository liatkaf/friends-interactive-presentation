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
  await send('Page.bringToFront');
  await waitFor(`document.querySelector('.coffee-experience')?.coffeeMug`,'Three.js mount',60000);
  await waitFor(`document.querySelector('.coffee-experience').coffeeMug.state.startedAt!==null`,'initial autoplay');
  await check(`document.querySelector('.coffee-experience').dataset.threeRevision==='170'`,'genuine local Three.js r170');
  await check(`document.querySelector('.coffee-experience').coffeeMug.state.renderCalls>0`,'WebGL draw calls');
  await waitFor(`!document.querySelector('.coffee-experience').coffeeMug.state.spinning`,'five-second finish');
  // Observe within the page so slow DevTools round-trips cannot miss a five-second turn.
  let observed=await evaluate(`(async()=>{
    const host=document.querySelector('.coffee-experience'),button=document.querySelector('#replay-mug');
    button.click();const disabled=button.disabled,started=host.coffeeMug.state.spinning;
    document.querySelector('#next').click();const next=current===1;
    document.querySelector('#previous').click();const previous=current===0;
    const samples=[host.coffeeMug.state.yaw];
    await new Promise(resolve=>{const sample=()=>{samples.push(host.coffeeMug.state.yaw);if(host.coffeeMug.state.spinning)requestAnimationFrame(sample);else resolve();};requestAnimationFrame(sample);});
    return {disabled,started,next,previous,rotates:new Set(samples).size>2,samples:samples.length};
  })()`);
  if(!observed.rotates){
    // Retry frame observation once after navigation settles on slow software WebGL.
    const rotates=await evaluate(`(async()=>{document.querySelector('#replay-mug').click();const host=document.querySelector('.coffee-experience'),samples=[];await new Promise(resolve=>{const sample=()=>{samples.push(host.coffeeMug.state.yaw);if(host.coffeeMug.state.spinning)requestAnimationFrame(sample);else resolve();};requestAnimationFrame(sample);});return new Set(samples).size>2;})()`);
    observed={...observed,rotates};
  }
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
  // v0.6 narrative, research figures, guided questionnaire and actual matching states.
  const expected=['Welcome to the Friends Comfort Lab','Why Do We Rewatch Friends?','The Psychology of Comfort TV','Predictability & Control','PIVOT! Concentration & Spatial Focus','What the Research Shows','Belonging, Mood & Rejection','Familiar Worlds & Self-Control','Nostalgia & Cognitive Ease','From Research to Recommendation','How Are You Feeling?',"What's Your Stress Level?","Who's Your Favorite Friend?",'Which Quote Speaks to You?','What Kind of Comfort Do You Need?','How Familiar Is Friends to You?','Finding Your Perfect Match','The One With Your Perfect Episode'];
  test(JSON.stringify(await evaluate('slides.map(s=>s.title)'))===JSON.stringify(expected),'18 required slide titles in order');
  await check("sections.length===18 && document.querySelectorAll('.dot').length===18",'18 primary slides and indicators');
  await check("[...document.querySelectorAll('.slide')].every(s=>s.querySelectorAll('h1,h2').length===1)",'one headline per slide');
  await check("!document.querySelector('.slide img[src*=\"original.png\"]') && !document.querySelector('img[src*=\"central-perk-original\"],img[src*=\"friends-couch-original\"]')",'user artwork not in active UI');
  await check("document.querySelector('header.topbar').children.length===1 && document.querySelector('header.topbar').textContent.replace(/\s+/g,' ').trim()==='F\u00b7R\u00b7I\u00b7E\u00b7N\u00b7D\u00b7S| The Comfort Lab'",'only centered brand in topbar');
  await check("[...document.querySelectorAll('.friends-word i')].every((dot,i)=>getComputedStyle(dot).color===['rgb(231, 76, 60)','rgb(241, 196, 15)','rgb(52, 152, 219)'][i%3])",'classic alternating dot colors');
  await check("!document.querySelector('header.topbar').textContent.match(/v0\.|INTERACTIVE EDITION|New York/i) && document.querySelector('.utility-bar [data-open=settings]')",'badge removed and settings retained separately');
  await check("!sections[4].textContent.match(/stress/i) && sections[11].textContent.includes('Stress')",'Slide 5 terminology isolated from stress questionnaire');
  // Every background Enter advances once; repeats and interactive targets are exempt.
  for(let i=0;i<17;i++){await evaluate(`goTo(${i});presentation.focus();presentation.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}))`);await check(`current===${i+1}`,'background Enter '+(i+1));}
  await evaluate("presentation.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}))");await check("current===17",'Enter final boundary');
  await evaluate("goTo(2);presentation.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',repeat:true,bubbles:true,cancelable:true}))");await check("current===2",'held Enter does not skip slides');
  await evaluate("goTo(10);window.beforeEnterProfile=JSON.stringify(FriendsLab.profile)");
  await check("(()=>{const b=document.querySelector('[data-answer=mood]'),e=new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true});b.dispatchEvent(e);return current===10&&!e.defaultPrevented&&JSON.stringify(FriendsLab.profile)===window.beforeEnterProfile})()",'Enter leaves questionnaire activation to native buttons');
  await evaluate("goTo(11)");await check("(()=>{const e=new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true});document.querySelector('#profile-stress').dispatchEvent(e);return current===11&&!e.defaultPrevented})()",'Enter on form input is not intercepted');
  await check("(()=>{for(const html of ['<textarea></textarea>','<select><option>One</option></select>','<div contenteditable><span>Editable</span></div>','<a href=\"#slide-1\">Link</a>','<div role=\"button\" tabindex=\"0\">Custom control</div>']){const wrapper=document.createElement('div');wrapper.innerHTML=html;sections[11].append(wrapper);const target=wrapper.querySelector('span')||wrapper.firstElementChild,e=new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true});target.dispatchEvent(e);wrapper.remove();if(current!==11||e.defaultPrevented)return false;}return true;})()",'Enter exempts textarea, select, nested editable, link and custom control');
  await evaluate("document.querySelector('[data-open=settings]').click();document.querySelector('#settings').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}))");await check("current===11&&document.querySelector('#settings').open",'Enter does not navigate with modal open');
  await evaluate("document.querySelector('#settings .dialog-close').click();goTo(4)");
  await waitFor("document.querySelector('#stairwell-view').dataset.mode==='three'",'Three.js stairwell mount',30000);
  await evaluate("document.querySelector('#reset-challenge').click()");
  await check("PivotChallenge.state.stage===0&&PivotChallenge.state.score===100&&!PivotChallenge.state.pivotCompleted&&document.querySelector('#focus-score').value===100&&document.querySelector('#pivot-couch').disabled",'game initial state and controls');
  await evaluate("window.initialGameProfile=JSON.stringify(FriendsLab.profile);window.bottomPose=JSON.stringify(document.querySelector('#stairwell-view').stairwell.state.position);document.querySelector('#move-up').focus()");
  await evaluate("document.querySelector('#move-up').focus()");await waitFor("document.activeElement.id==='move-up'",'game button focus');
  await send('Input.dispatchKeyEvent',{type:'keyDown',text:'\r',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
  await check("current===4&&PivotChallenge.state.stage===1&&document.querySelector('#pivot-couch').disabled",'native Enter activates MOVE UP without slide navigation');
  await waitFor("!document.querySelector('#stairwell-view').stairwell.state.animating",'first stair movement settles');
  await check("JSON.stringify(document.querySelector('#stairwell-view').stairwell.state.position)!==window.bottomPose",'actual couch moves in Three.js');
  await evaluate("document.querySelector('#move-up').click()");await waitFor("!document.querySelector('#stairwell-view').stairwell.state.animating",'corner movement settles');
  await check("PivotChallenge.state.stage===2&&!document.querySelector('#pivot-couch').disabled",'corner enables pivot');
  await evaluate("window.cornerPosition=JSON.stringify(document.querySelector('#stairwell-view').stairwell.state.position);document.querySelector('#move-up').click()");
  await check("PivotChallenge.state.stage===2&&PivotChallenge.state.score===75&&document.querySelector('#pivot-feedback').textContent==='STUCK! PIVOT FIRST!'&&document.querySelector('#pivot-challenge').classList.contains('game-failure')",'blocked move deducts 25 and gives visible feedback');
  await evaluate("document.querySelector('#pivot-couch').click()");await waitFor("!document.querySelector('#stairwell-view').stairwell.state.animating",'pivot animation settles');
  await check("PivotChallenge.state.pivotCompleted&&PivotChallenge.state.score===85&&document.querySelector('#pivot-couch').disabled&&document.querySelector('#pivot-feedback').textContent==='PERFECT PIVOT!'",'correct pivot rewards 10 exactly once');
  await check("Math.abs(document.querySelector('#stairwell-view').stairwell.state.rotation-Math.PI/2)<1e-6&&JSON.stringify(document.querySelector('#stairwell-view').stairwell.state.position)===window.cornerPosition",'couch rotates at actual corner');
  await screenshot('v07-corner-pivoted');
  await evaluate("document.querySelector('#move-up').click()");await waitFor("!document.querySelector('#stairwell-view').stairwell.state.animating",'top movement settles');
  await check("PivotChallenge.state.stage===3&&document.querySelector('#move-up').disabled&&document.querySelector('#pivot-challenge').classList.contains('game-success')&&document.querySelector('#stairwell-view').stairwell.state.position[0]>0",'top landing success and spatial turn');
  await screenshot('v07-game-success');
  for(let i=0;i<3;i++){await evaluate("document.querySelector('#reset-challenge').click()");await check("PivotChallenge.state.stage===0&&PivotChallenge.state.score===100&&!PivotChallenge.state.pivotCompleted&&JSON.stringify(document.querySelector('#stairwell-view').stairwell.state.position)===window.bottomPose&&document.querySelector('#stairwell-view').stairwell.state.rotation===0&&!document.querySelector('#move-up').disabled&&!document.querySelector('#pivot-challenge').classList.contains('game-failure')&&!document.querySelector('#pivot-challenge').classList.contains('game-success')",'complete repeated game reset '+i);}
  await evaluate("document.querySelector('#move-up').click();document.querySelector('#move-up').click();document.querySelector('#pivot-couch').click()");await check("PivotChallenge.state.score===100",'perfect run caps score at 100');
  await evaluate("document.querySelector('#reset-challenge').click();document.querySelector('#move-up').click();document.querySelector('#move-up').click();for(let i=0;i<6;i++)document.querySelector('#move-up').click()");await check("PivotChallenge.state.score===0",'game floor is zero');
  await check("JSON.stringify(FriendsLab.profile)===window.initialGameProfile&&!('score' in FriendsLab.profile)",'game state never changes recommendation profile');
  await evaluate("document.querySelector('#reset-challenge').click();document.querySelector('#move-up').click();goTo(3)");await pause(200);
  const inactiveDraws=await evaluate("document.querySelector('#stairwell-view').stairwell.state.drawCount");await pause(350);test(await evaluate("document.querySelector('#stairwell-view').stairwell.state.drawCount")===inactiveDraws,'no rendering loop while Slide 5 inactive');
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await evaluate("goTo(4);document.querySelector('#move-up').click()");
  await check("!document.querySelector('#stairwell-view').stairwell.state.animating&&document.querySelector('#stairwell-view').stairwell.state.reducedMotion",'game reduced motion snaps to real state');
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});await evaluate("document.querySelector('#reset-challenge').click()");
  await check("sections.slice(0,10).every(s=>!s.querySelector('[data-answer],#profile-stress'))",'research precedes all questionnaire inputs');
  await check("sections.slice(10,16).every(s=>s.querySelector('.question-progress'))",'six dedicated questionnaire slides');
  await evaluate("goTo(1);document.querySelector('[data-metric=loneliness]').click();document.querySelector('[data-research]').focus();document.querySelector('[data-research]').click()");
  await evaluate("document.querySelector('[data-research]').click()");
  await check("document.querySelector('#research-tooltip').textContent.includes('2.64') && document.querySelector('#research-axis').textContent.includes('reverse-scored')",'published analytics remain interactive');
  await evaluate("document.querySelector('[data-open=\"chart-source\"]').click()");
  await check("document.querySelector('#chart-source').open && document.querySelector('#chart-source').textContent.toLowerCase().includes('not clinical anxiety')",'scale and original source context');
  await evaluate("document.querySelector('#chart-source .dialog-close').click()");
  for(const [index,ids] of [[5,[0]],[6,[1,2,3]],[7,[4,5,6]]]){
    await evaluate(`goTo(${index})`);
    for(const id of ids){
      await evaluate(`document.querySelector('[data-inline-figure="${id}"]').click()`);
      await waitFor(`sections[${index}].querySelector('.figure-open img').complete && sections[${index}].querySelector('.figure-open img').naturalWidth>0`,'inline figure '+id);
      await check(`sections[${index}].querySelector('.figure-open img').src.includes(FriendsLab.figures[${id}][3])`,'unchanged figure identity '+id);
      await evaluate(`sections[${index}].querySelector('[data-enlarge]').click()`);
      await waitFor("document.querySelector('#evidence-image').complete && document.querySelector('#evidence-image').naturalWidth>0",'enlarged figure '+id);
      await check("document.querySelector('#research-explorer').open && document.querySelector('#figure-citation a').href.startsWith('https://doi.org/')",'readable cited modal '+id);
      await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
      await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
      await waitFor("!document.querySelector('#research-explorer').open && document.activeElement.matches('[data-enlarge]')",'figure Escape and focus restoration '+id);
    }
  }
  await evaluate("goTo(6);document.querySelector('[data-inline-figure=\"3\"]').click();sections[6].querySelector('.figure-detail').open=true");
  await check("sections[6].textContent.includes('not significant at .05')",'marginal rejection result distinguished');
  await evaluate("sections[6].querySelector('.figure-detail').open=false;document.querySelector('[data-inline-figure=\"1\"]').click()");
  await evaluate("goTo(10);document.querySelector('[data-answer=mood][data-value=happy]').click();goTo(11);document.querySelector('#profile-stress').value=8;document.querySelector('#profile-stress').dispatchEvent(new Event('input'));goTo(12);document.querySelector('[data-answer=character][data-value=Ross]').click();goTo(13);document.querySelector('[data-answer=quote]').click();goTo(14);document.querySelector('[data-answer=experience][data-value=laughter]').click();goTo(15);document.querySelector('[data-answer=familiarity][data-value=rewatcher]').click();document.querySelector('[data-answer=nostalgia][data-value=high]').click()");
  await check("FriendsLab.profile.stress===8 && FriendsLab.profile.quote==='PIVOT!' && FriendsLab.profile.character==='Ross' && document.querySelector('#profile-progress').textContent.includes('6 / 6')",'questionnaire inputs and six-step completion');
  await evaluate("goTo(10)");
  await check("document.querySelector('[data-answer=mood][data-value=happy]').getAttribute('aria-pressed')==='true'",'answer persists across slide navigation');
  await evaluate("window.labOriginalFetch=window.fetch;window.fetch=(url,...args)=>String(url)==='/api/recommend'?new Promise(resolve=>window.releaseMatch=()=>resolve(window.labOriginalFetch(url,...args))):window.labOriginalFetch(url,...args);goTo(16)");
  await check("document.querySelector('#matching-steps li').dataset.state==='done' && [...document.querySelectorAll('#matching-steps li')].slice(1).every(li=>li.dataset.state==='waiting') && document.querySelector('#view-result').disabled",'matching does not claim completion while Python request is pending');
  await evaluate("window.releaseMatch();window.fetch=window.labOriginalFetch");
  await waitFor("document.querySelector('#matching-status').textContent.includes('Python 3') && !document.querySelector('#view-result').disabled",'real Python computation completes',30000);
  await check("[...document.querySelectorAll('#matching-steps li')].every(li=>li.dataset.state==='done') && document.querySelector('#matching-factors').textContent.includes('quote')",'matching completion reflects returned factors');
  await evaluate("document.querySelector('#view-result').click()");
  await check("current===17 && document.querySelector('.episode-hero h3').textContent==='The One with the Cop' && document.querySelectorAll('.alternatives article').length===2",'selected profile returns Cop and two alternatives');
  await check("!document.querySelector('.episode-hero').textContent.includes('undefined') && document.querySelector('.episode-hero').textContent.includes('S5 E16')",'episode numbering visible');
  await evaluate("window.savedReturnProfile=JSON.stringify(FriendsLab.profile);document.querySelector('#back-to-start').click()");
  await check("current===0&&location.hash==='#slide-1'&&document.querySelector('.dot').getAttribute('aria-current')==='step'&&document.querySelector('#current').textContent==='01'&&JSON.stringify(FriendsLab.profile)===window.savedReturnProfile",'Back to Start restores navigation and preserves answers');
  await check("Math.abs(parseFloat(document.querySelector('#progress-fill').style.width)-100/18)<.01",'Back to Start updates progress');
  await evaluate("goTo(17)");await check("document.querySelector('.episode-hero h3').textContent==='The One with the Cop'",'returning to recommendation preserves personalized match');
  await evaluate("document.querySelector('#why-episode').click()");
  await check("document.querySelector('#score-details').open && document.querySelector('#score-content').textContent.includes('18 / 18')",'actual scoring points in Why This Episode');
  await pause(700);await screenshot('v07-score-details');
  await evaluate("document.querySelector('#score-details .dialog-close').click();document.querySelector('#surprise-me').click()");
  await check("document.querySelector('#recommendation-status').textContent.includes('JavaScript random discovery') && document.querySelector('.episode-hero h3').textContent!=='The One with the Cop' && FriendsLab.episodes.some(e=>e.title===document.querySelector('.episode-hero h3').textContent)",'Surprise Me selects a different real episode and identifies computation');
  await evaluate("document.querySelector('#try-again').click()");
  await check("current===10 && FriendsLab.profile.character==='Ross'",'Try Again returns to dedicated questions and retains editable answers');
  await send('Page.reload');
  await waitFor("window.FriendsLab && FriendsLab.profile.stress===8 && FriendsLab.profile.quote==='PIVOT!'",'profile survives reload');
  const parity=await evaluate(`(async()=>{const canonical=x=>JSON.stringify(x,(_,v)=>v && typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b))):v);for(const p of [{},{quote:'PIVOT!'},{mood:'overwhelmed',stress:10,character:'Phoebe',quote:'Smelly Cat',nostalgia:'low',familiarity:'new',predictability:'surprising',experience:'warmth'}]){const result=await(await fetch('/api/recommend',{method:'POST',body:JSON.stringify(p)})).json();const js=FriendsLab.episodes.map(e=>FriendsLab.fallbackScore(e,p)).sort((a,b)=>b.score-a.score||a.episode.season-b.episode.season||a.episode.episode-b.episode.episode).slice(0,3);if(canonical(result.recommendations)!==canonical(js))return false;}return true;})()`);
  test(parity,'Python/JS scores and explanations agree for empty, sparse and full profiles');
  await evaluate("document.querySelector('[data-open=settings]').click();document.querySelector('#comfort-color').value='green';document.querySelector('#comfort-color').dispatchEvent(new Event('change'));document.querySelector('#comfort-font').value='sans';document.querySelector('#comfort-font').dispatchEvent(new Event('change'));document.querySelector('#comfort-size').value='18';document.querySelector('#comfort-size').dispatchEvent(new Event('change'));document.querySelector('#quiet-motion').click()");
  await check("document.body.dataset.comfortColor==='green' && document.body.dataset.comfortFont==='sans' && document.documentElement.style.fontSize==='18px' && document.body.classList.contains('quiet-motion')",'compact optional settings retain customization');
  await evaluate("document.querySelector('#comfort-reset').click();document.querySelector('#settings .dialog-close').click();document.querySelector('[data-open=\"pivot-activity\"]').click()");
  await waitFor("document.querySelector('#couch-view').dataset.state==='ready'",'optional genuine Three.js PIVOT mount',30000);
  await evaluate("document.querySelector('#couch-turn').value=90;document.querySelector('#couch-turn').dispatchEvent(new Event('input'))");
  await check("document.querySelector('#couch-view').dataset.angle==='90'",'optional couch slider');
  await evaluate("document.querySelector('#couch-view canvas').dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}))");
  await check("document.querySelector('#couch-view').dataset.angle==='100' && current===10",'couch keyboard consumes navigation');
  const couchBounds=await evaluate("(()=>{const r=document.querySelector('#couch-view canvas').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()");
  await send('Input.dispatchMouseEvent',{type:'mousePressed',...couchBounds,button:'left',clickCount:1});
  await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:couchBounds.x+50,y:couchBounds.y,button:'left',buttons:1});
  await send('Input.dispatchMouseEvent',{type:'mouseReleased',x:couchBounds.x+50,y:couchBounds.y,button:'left',clickCount:1});
  await check("document.querySelector('#couch-view').dataset.angle!=='100'",'real couch drag');
  await evaluate("document.querySelector('#couch-reset').click()");
  await check("document.querySelector('#couch-view').dataset.angle==='25'",'optional couch reset');
  await screenshot('v07-optional-pivot');
  await evaluate("document.querySelector('#pivot-activity .dialog-close').click();document.querySelector('[data-open=settings]').click();document.querySelector('#reset-profile').click();goTo(16)");
  await waitFor("FriendsLab.result && Object.keys(FriendsLab.profile).length===0 && document.querySelector('#matching-status').textContent.includes('Python 3')",'reset and incomplete profile Python match',30000);
  await check("FriendsLab.result.recommendations[0].score===0",'empty questionnaire is handled honestly');
  await evaluate("goTo(10);document.querySelector('[data-answer=mood][data-value=sad]').click();window.labOriginalFetch=window.fetch;window.fetch=(url,...args)=>String(url).startsWith('/api/')?Promise.reject(Error('Deliberate test failure')):window.labOriginalFetch(url,...args);goTo(16)");
  await waitFor("document.querySelector('#matching-status').textContent.includes('JavaScript fallback') && !document.querySelector('#view-result').disabled",'Python failure remains usable and honestly labeled');
  await evaluate("window.fetch=window.labOriginalFetch;goTo(13);document.querySelector('[data-answer=quote]').click();goTo(16)");
  await waitFor("document.querySelector('#matching-status').textContent.includes('Python 3')",'Python resumes after fallback',30000);
  // Full navigation regression and screenshots of every slide at desktop and mobile.
  for(let i=0;i<18;i++){
    await evaluate(`document.querySelectorAll('.dot')[${i}].click()`);
    await check(`current===${i} && document.querySelectorAll('.slide:not([hidden])').length===1`,'indicator '+(i+1));
    await check("document.querySelector('#current').textContent===String(current+1).padStart(2,'0') && Math.abs(parseFloat(document.querySelector('#progress-fill').style.width)-(current+1)/18*100)<.01",'counter and progress '+i);
  }
  await check("document.querySelector('#next').disabled",'final boundary');
  for(let i=16;i>=0;i--){await evaluate("document.querySelector('#previous').click()");await check(`current===${i}`,'Previous '+i);}
  await check("document.querySelector('#previous').disabled",'first boundary');
  for(let i=1;i<18;i++){await evaluate("document.querySelector('#next').click()");await check(`current===${i}`,'Next '+i);}
  for(const [key,index] of [['Home',0],['ArrowRight',1],['ArrowLeft',0],['End',17]]){await evaluate(`document.body.dispatchEvent(new KeyboardEvent('keydown',{key:'${key}',bubbles:true}))`);await check(`current===${index}`,'keyboard '+key);}
  await evaluate("location.hash='#slide-8'");await waitFor("current===7",'deep link');
  await send('Page.reload');await waitFor("window.FriendsLab && current===7",'deep-link reload');
  await waitFor("document.querySelector('.coffee-experience')?.coffeeMug",'hidden mug mount',60000);
  await check("!document.querySelector('.coffee-experience').coffeeMug.state.spinning",'no mug autoplay on hidden slide');
  for(const width of [1440,1024,768,390,320]){
    await send('Emulation.setDeviceMetricsOverride',{width,height:width<600?844:1000,deviceScaleFactor:1,mobile:width<600});
    await check("(()=>{const b=document.querySelector('.lab-brand').getBoundingClientRect(),h=document.querySelector('.topbar').getBoundingClientRect(),u=document.querySelector('.utility-bar').getBoundingClientRect(),t=document.querySelector('.header-tools').getBoundingClientRect(),p=document.querySelector('#profile-progress').getBoundingClientRect();return Math.abs(b.x+b.width/2-innerWidth/2)<1&&Math.abs(b.y+b.height/2-h.y-h.height/2)<1&&b.left>=0&&b.right<=innerWidth&&u.top>=h.bottom&&t.left>=p.right&&t.right<=innerWidth})()",'centered brand and separate non-overlapping controls '+width);
    for(let i=0;i<18;i++){
      await evaluate(`goTo(${i})`);await pause(width===1440||width===390?700:90);
      await check("sections[current].scrollWidth<=sections[current].clientWidth",'no horizontal overflow '+width+'/'+i);
      await check("document.querySelector('.controls').getBoundingClientRect().bottom<=innerHeight",'navigation fits '+width+'/'+i);
      if(width===1440||width===390)await screenshot(`v07-${width===1440?'desktop':'mobile'}-${String(i+1).padStart(2,'0')}`);
    }
  }
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await evaluate("goTo(0)");await pause(300);
  await check("!document.querySelector('.coffee-experience').coffeeMug.state.spinning && document.querySelector('.coffee-experience').coffeeMug.state.reducedMotion",'system reduced-motion mug');
  await evaluate("document.querySelector('#replay-mug').click()");
  await check("!document.querySelector('.coffee-experience').coffeeMug.state.spinning",'replay respects reduced motion');
  test(requests.every(url=>url.startsWith(base)||url.startsWith('data:')),'no external requests');
  test(!requests.some(url=>/central-perk-original|friends-couch-original/.test(url)),'no original artwork image requests');
  test(errors.length===0,'no unexpected JavaScript errors: '+errors.join('\n'));
  const normalErrors=[...errors];
  const injected=await send('Page.addScriptToEvaluateOnNewDocument',{source:`const originalGetContext=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(kind,...args){return kind==='webgl2'||kind==='webgl'||kind==='experimental-webgl'?null:originalGetContext.call(this,kind,...args);};`});
  await send('Page.reload');await waitFor("document.querySelector('.coffee-experience')?.dataset.state==='fallback'",'no-WebGL mug fallback');
  await evaluate('goTo(4)');await waitFor("document.querySelector('#stairwell-view').dataset.mode==='fallback'",'stairwell WebGL fallback');
  await evaluate("document.querySelector('#move-up').click();document.querySelector('#move-up').click();document.querySelector('#move-up').click();document.querySelector('#pivot-couch').click();document.querySelector('#move-up').click()");
  await check("PivotChallenge.state.stage===3&&PivotChallenge.state.score===85&&document.querySelector('#stairwell-view').dataset.stage==='3'&&document.querySelector('#stairwell-view').dataset.pivoted==='true'&&!document.querySelector('.stairwell-fallback').hidden",'fallback synchronizes position, pivot, penalties and success');
  await screenshot('v07-game-fallback');await evaluate("document.querySelector('#reset-challenge').click()");await check("PivotChallenge.state.stage===0&&PivotChallenge.state.score===100",'fallback reset');
  await evaluate("document.querySelector('[data-open=\"pivot-activity\"]').click()");await waitFor("document.querySelector('#couch-view').dataset.state==='fallback'",'no-WebGL optional couch fallback');
  await evaluate("document.querySelector('#couch-turn').value=80;document.querySelector('#couch-turn').dispatchEvent(new Event('input'));document.querySelector('#pivot-activity .dialog-close').click();goTo(17)");
  await check("current===17 && document.querySelector('#couch-view').dataset.angle==='80'",'fallback controls and navigation');
  await send('Page.removeScriptToEvaluateOnNewDocument',{identifier:injected.identifier});
  await send('Page.navigate',{url:pathToFileURL(path.join(root,'index.html')).href});
  await waitFor("window.FriendsLab && document.querySelector('.coffee-experience').dataset.state==='fallback'",'direct file mode');
  await evaluate('goTo(17)');await waitFor("document.querySelector('#recommendation-status').textContent.includes('JavaScript fallback')",'file recommendations work without Python');
  const report={passed:checks,errors:normalErrors,expectedFallbackErrors:errors.slice(normalErrors.length),externalRequests:requests.filter(url=>!url.startsWith(base)&&!url.startsWith('data:')&&!url.startsWith('file:')),screenshots:'test-results/v07-*.png'};
  fs.writeFileSync(path.join(root,'test-results','v07-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
  await send('Browser.close');ownedBrowser=false;
})().catch(async error=>{console.error(error);if(send&&ws?.readyState===1)try{await send('Browser.close');}catch{}if(ownedBrowser)browser?.kill();process.exitCode=1;});
