// Dependency-free Edge/Chromium smoke test. First run: node serve.cjs
// Then: node tests/browser-test.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const pause = ms => new Promise(resolve=>setTimeout(resolve,ms));
const port = 9360;
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


  await waitFor("window.FriendsLab&&document.querySelector('.evidence-map .evidence-row')",'v0.9 initialized');
  await check("!document.querySelector('.utility-bar')&&document.querySelector('#navigation-overlay [data-open=settings]')",'secondary status bar removed; optional tools retained');
  await check("!document.querySelector('.coffee-controls,#replay-mug')&&getComputedStyle(document.querySelector('#mug-status')).display==='none'",'no mug instructions or replay beneath model');
  await check("!document.querySelector('#confirm-stress')&&!sections[11].textContent.includes('Use this value')",'Slide 12 hint removed');
  await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:700,y:995});await waitFor('FriendsNavigation.visible','dock reveals');await send('Page.captureScreenshot',{format:'png'});await pause(500);
  const dockTool=await evaluate("(()=>{const r=document.querySelector('.dock-tools button').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()");
  await send('Input.dispatchMouseEvent',{type:'mouseMoved',...dockTool});await pause(1600);
  await check('FriendsNavigation.visible','hovering optional tools above activation zone holds dock open');
  await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:700,y:100});await pause(1600);await check('!FriendsNavigation.visible','dock hides after leaving optional tools');
  await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:700,y:995});await pause(500);await evaluate("document.querySelector('.dock-tools button').focus()");
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
  await check('!FriendsNavigation.visible&&document.activeElement===presentation','Escape dismisses dock while hovered/focused');
  await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:700,y:100});

  await evaluate('window.originalFinalProfile=JSON.stringify(FriendsLab.profile);goTo(2)');
  await check("document.querySelectorAll('.illustrated-pillar svg').length===4&&document.querySelectorAll('[data-pillar]').length===4",'four original illustrated concept controls');
  for(let id=0;id<4;id++){
    await evaluate(`document.querySelector('[data-pillar="${id}"]').click()`);
    await check(`document.querySelectorAll('[data-pillar][aria-expanded=true]').length===1&&!document.querySelector('#pillar-detail-${id}').hidden&&document.querySelector('#pillar-takeaway').textContent===pillars[${id}][5]`,'concept explanation, example and dynamic takeaway '+id);
  }
  await evaluate("document.querySelector('[data-pillar=\"0\"]').focus()");
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r'});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
  await check("current===2&&document.querySelector('[data-pillar=\"0\"]').getAttribute('aria-expanded')==='true'",'native Enter opens card without navigating');
  await evaluate('goTo(3)');await check("document.querySelectorAll('.comic-panel svg').length===3&&new Set([...document.querySelectorAll('.comic-panel svg')].map(x=>x.innerHTML)).size===3",'three original distinct comic scenes');
  await evaluate("document.querySelector('#comic-next').click();document.querySelector('#comic-next').click()");
  await check("FriendsFinal.state.comicStep===2&&document.querySelector('#comic-next').disabled&&document.querySelector('#comic-takeaway').textContent.includes('may feel comforting')",'comic progresses to qualified final takeaway');
  await evaluate("document.querySelector('#comic-replay').click()");await check("FriendsFinal.state.comicStep===0&&!document.querySelector('#comic-next').disabled",'comic replays without reload');
  await evaluate("goTo(6);document.querySelector('[data-social-step=\"1\"]').click();document.querySelector('#slide-7 [data-python-animation=\"social-scene\"] [data-animation-play]').click()");
  await waitFor("document.querySelector('[data-python-animation=\"social-scene\"]').pythonPlayer.state.playing",'Python social animation starts');
  await waitFor("document.querySelector('[data-python-animation=\"social-scene\"]').pythonPlayer.state.frame>0",'actual Python-authored social frames advance');
  const pauseResult=await evaluate("(async()=>{const host=document.querySelector('[data-python-animation=\"social-scene\"]');host.querySelector('[data-animation-replay]').click();await new Promise((resolve,reject)=>{const start=performance.now();function tick(){if(host.pythonPlayer.state.playing&&host.pythonPlayer.state.frame>0){resolve();return;}if(performance.now()-start>12000){reject(Error('No observable active social frame'));return;}requestAnimationFrame(tick);}tick();});host.querySelector('[data-animation-play]').click();const frame=host.pythonPlayer.state.frame;await new Promise(r=>setTimeout(r,300));return {stopped:!host.pythonPlayer.state.playing&&host.pythonPlayer.state.pendingFrames===0&&host.pythonPlayer.state.frame===frame,state:host.pythonPlayer.state};})()");
  test(pauseResult.stopped,'pause cancels social frame loop: '+JSON.stringify(pauseResult));
  await evaluate("document.querySelector('[data-python-animation=\"social-scene\"] [data-animation-replay]').click()");
  await waitFor("document.querySelector('[data-python-animation=\"social-scene\"]').dataset.playback==='complete'",'social replay reaches final authored frame');
  await evaluate("document.querySelector('[data-social-step=\"2\"]').click();document.querySelector('[data-comfort-choice=familiar]').click()");
  await check("FriendsFinal.state.socialStep===3&&document.querySelector('#social-response').textContent.includes('actually tested')",'familiar choice reveals research with distinct response');
  await evaluate("document.querySelector('[data-social-step=\"2\"]').click();document.querySelector('[data-comfort-choice=new]').click()");
  await check("document.querySelector('#social-response').textContent.includes('not your choice here')&&JSON.stringify(FriendsLab.profile)===originalFinalProfile",'new choice has gentle alternative response and no profile/experiment data');
  for(const [slide,ids] of [[6,[0,1,2,3]],[7,[4,5,6]]]){
    await evaluate(`goTo(${slide});if(${slide}===6)document.querySelector('[data-social-step="3"]').click()`);
    for(const id of ids){
      await evaluate(`document.querySelector('[data-inline-figure="${id}"]').click();sections[${slide}].querySelector('.study-workbench [data-animation-play]').click()`);
      await waitFor(`sections[${slide}].querySelector('.study-workbench .python-player').dataset.playback==='complete'`,'Python study animation completes '+id);
      await check(`sections[${slide}].querySelector('.study-workbench .python-player').pythonPlayer.state.key==='evidence-${id}'&&sections[${slide}].querySelector('.study-design').textContent.includes('Study')&&sections[${slide}].querySelector('.study-finding').textContent===FRIENDS_V05.research.figures[${id}].takeaway`,'module animation, design and actual finding agree '+id);
    }
  }
  await evaluate("sections[7].querySelector('[data-animation-enlarge]').click()");
  await check("document.querySelector('#animation-viewer').open&&document.querySelector('#animation-viewer .python-player')&&FriendsFinal.state.players.length===4",'accessible enlarged Python animation viewer');
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
  await waitFor("!document.querySelector('#animation-viewer').open&&FriendsFinal.state.players.length===3",'closing viewer releases its controller');
  await check("document.activeElement.matches('[data-animation-enlarge]')",'animation viewer restores keyboard focus');
  await evaluate("document.querySelector('[data-inline-figure=\"4\"]').click();sections[7].querySelector('[data-animation-play]').click()");await waitFor("sections[7].querySelector('.python-player').pythonPlayer.state.playing",'lab play starts before module switch');
  await evaluate("document.querySelector('[data-inline-figure=\"5\"]').click()");
  await check("sections[7].querySelector('.python-player').pythonPlayer.state.key==='evidence-5'&&!sections[7].querySelector('.python-player').pythonPlayer.state.playing&&sections[7].querySelector('.python-player').pythonPlayer.state.pendingFrames===0",'module switch cancels old playback without stale frames');
  await evaluate("sections[7].querySelector('[data-animation-play]').click()");await waitFor("sections[7].querySelector('.python-player').pythonPlayer.state.playing",'lab replays');await evaluate('goTo(5)');
  const hiddenDraws=await evaluate("sections[7].querySelector('.python-player').pythonPlayer.state.draws");await pause(300);
  await check(`sections[7].querySelector('.python-player').pythonPlayer.state.draws===${hiddenDraws}&&sections[7].querySelector('.python-player').pythonPlayer.state.pendingFrames===0`,'inactive study animation does no rendering');
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await evaluate("goTo(7);sections[7].querySelector('[data-animation-play]').click()");
  await check("sections[7].querySelector('.python-player').dataset.playback==='reduced'&&FriendsFinal.state.players.every(p=>!p.playing&&p.pendingFrames===0)",'reduced motion shows Python posters without loops');
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  await evaluate("window.finalOriginalImage=Image;window.Image=function(){const image=new finalOriginalImage();Object.defineProperty(image,'src',{set(value){if(String(value).includes('-atlas.png'))queueMicrotask(()=>image.onerror?.(new Event('error')));else image.setAttribute('src',value);}});return image;};sections[7].querySelector('[data-animation-play]').click()");
  await waitFor("sections[7].querySelector('.python-player').dataset.playback==='fallback'",'missing atlas retains static evidence fallback');
  await check("sections[7].querySelector('.study-finding').textContent.length>10&&sections[7].querySelector('[data-enlarge]')",'fallback retains textual finding and original figure');
  await evaluate('window.Image=finalOriginalImage');
  for(const [index,ids] of [[6,[0,1,2,3]],[7,[4,5,6]]]){
    await evaluate(`goTo(${index});if(${index}===6)document.querySelector('[data-social-step="3"]').click();sections[${index}].querySelector('.source-audit').open=true`);
    for(const id of ids){
      await evaluate(`document.querySelector('[data-inline-figure="${id}"]').click()`);
      await check(`(()=>{const stage=sections[${index}].querySelector('.qualitative-explorer'),data=FRIENDS_V05.research.figures[${id}].evidence;return stage.querySelectorAll('.evidence-row').length===data.contrasts.length&&stage.querySelectorAll('tbody tr').length===data.contrasts.length&&stage.querySelector('[data-enlarge]').dataset.enlarge==='${id}'&&stage.textContent.includes('not effect magnitude')&&!stage.querySelector('img')})()`,'qualitative chart and table from Python, original reference '+id);
      await evaluate(`sections[${index}].querySelector('.evidence-row').focus()`);await waitFor(`document.activeElement===sections[${index}].querySelector('.evidence-row')`,'chart row focused');
      await check(`sections[${index}].querySelector('.evidence-tip').textContent.includes(FRIENDS_V05.research.figures[${id}].evidence.contrasts[0].reported_p)`,'keyboard tooltip '+id+' '+await evaluate(`sections[${index}].querySelector('.evidence-tip').textContent`));
    }
  }
  await evaluate("goTo(8);document.querySelector('#rewind').focus()");
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r'});
  await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
  await check("current===8&&document.querySelector('#rewind-stage').dataset.state==='rewinding'&&getComputedStyle(document.querySelector('.vhs-window i')).animationName==='reel-spin'",'Enter starts rewind without slide navigation');
  await waitFor("document.querySelector('#rewind-stage').dataset.state==='ready'",'TV powers on and concepts reveal');
  await check("!document.querySelector('#rewind-concepts').hidden&&document.querySelector('#rewind-concepts').textContent.includes('Reconnecting with familiar memories and emotions.')&&document.querySelector('#rewind-concepts').textContent.includes('Following a story that already feels familiar.')",'both interpretive concepts revealed');
  await pause(500);await screenshot('v10-rewind-revealed');
  await evaluate("document.querySelector('#rewind').click()");await check("document.querySelector('#rewind-stage').dataset.state==='rewinding'&&document.querySelector('#rewind-concepts').hidden",'rewind replays cleanly');
  await waitFor("document.querySelector('#rewind-stage').dataset.state==='ready'",'replay completes');
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await evaluate("document.querySelector('#rewind').click();goTo(9)");
  await check("document.querySelector('#rewind-stage').dataset.state==='ready'&&document.querySelector('#lobster-story').dataset.step==='3'&&getComputedStyle(document.querySelector('.lobster-claws')).animationName==='none'",'reduced motion reveals results without decorative animation');
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  await evaluate('goTo(8);goTo(9)');
  await waitFor("document.querySelector('#lobster-story').dataset.step==='3'",'all three lobster stages reveal');
  await send('Page.captureScreenshot',{format:'png'});
  await waitFor("document.querySelectorAll('.lobster-stages li').length===3&&document.querySelectorAll('.lobster').length===2&&[...document.querySelectorAll('.lobster-stages li')].every(x=>getComputedStyle(x).opacity==='1')",'three visible stages and two original lobsters');
  test(!requests.some(url=>url.includes('/api/recommend')),'lobster transition does not compute recommendation');
  await evaluate("document.querySelector('.lobster-cta').click()");await check("current===10&&!FriendsLab.result&&!FriendsLab.diagnostics.pending",'lobster CTA enters questionnaire without matching');
  const seedA="goTo(10);document.querySelector('[data-answer=mood][data-value=happy]').click();goTo(11);document.querySelector('#profile-stress').value=8;document.querySelector('#profile-stress').dispatchEvent(new Event('input'));goTo(12);document.querySelector('[data-answer=character][data-value=Ross]').click();goTo(13);document.querySelector('[data-answer=quote]').click();goTo(14);document.querySelector('[data-answer=experience][data-value=laughter]').click();goTo(15);document.querySelector('[data-answer=familiarity][data-value=rewatcher]').click();document.querySelector('[data-answer=nostalgia][data-value=high]').click()";
  const seedB="goTo(10);document.querySelector('[data-answer=mood][data-value=lonely]').click();goTo(11);document.querySelector('#profile-stress').value=2;document.querySelector('#profile-stress').dispatchEvent(new Event('input'));goTo(12);document.querySelector('[data-answer=character][data-value=Phoebe]').click();goTo(13);document.querySelector('[data-answer=quote][data-value=\"Smelly Cat\"]').click();goTo(14);document.querySelector('[data-answer=experience][data-value=warmth]').click();goTo(15);document.querySelector('[data-answer=familiarity][data-value=new]').click();document.querySelector('[data-answer=nostalgia][data-value=low]').click()";
  await evaluate(seedA+';goTo(16)');await waitFor("FriendsLab.result&&FriendsLab.engine.includes('Python')",'actual Python result for first attempt',30000);
  await check("document.querySelector('#view-result').textContent.includes('Reveal My Perfect Episode!')",'prominent reveal label');
  await evaluate("document.querySelector('#view-result').click();window.firstEpisode=FriendsLab.result.recommendations[0].episode.id;window.savedAnswers=FriendsLab.profile;document.querySelector('#back-to-start').click()");
  await check("current===0&&Object.entries(savedAnswers).every(([k,v])=>FriendsLab.profile[k]===v)",'Back to Start preserves all answers');
  await evaluate('goTo(10);goTo(11);goTo(10)');await check("Object.entries(savedAnswers).every(([k,v])=>FriendsLab.profile[k]===v)",'normal navigation preserves answers');
  await send('Page.reload');await waitFor("window.FriendsLab&&FriendsLab.profile.character==='Ross'&&FriendsLab.profile.stress===8",'normal refresh preserves attempt');
  await evaluate("goTo(17);document.querySelector('#comfort-color').value='green';document.querySelector('#comfort-color').dispatchEvent(new Event('change'));localStorage.setItem('unrelated-demo-setting','preserve');sessionStorage.setItem('unrelated-demo-setting','preserve');localStorage.setItem('friends-profile-v05',JSON.stringify(FriendsLab.profile))");
  await waitFor('FriendsLab.result','cached first attempt ready');
  await check("document.querySelectorAll('.alternatives article').length===2&&document.querySelector('#alternatives-title').textContent==='Two More Episodes You Might Love'&&!/Python|JavaScript|fallback|ranking complete|all episodes tie/i.test(document.querySelector('#recommendation-status').textContent)",'friendly final reveal with distinct alternative cards');
  await evaluate("window.oldResultId=FriendsLab.result.recommendations[0].episode.id;document.querySelector('#try-again').click()");
  const empty="Object.keys(FriendsLab.profile).length===0&&FriendsLab.result===null&&!FriendsLab.diagnostics.pending&&!FriendsLab.diagnostics.fingerprint&&!FriendsLab.engine&&!document.querySelector('[data-answer][aria-pressed=true]')&&document.querySelector('#profile-stress').value==='5'&&!sessionStorage.getItem('friends-profile-v05')&&!localStorage.getItem('friends-profile-v05')&&document.querySelector('#profile-progress').textContent==='0 / 6 questions answered'";
  await check('current===10&&'+empty,'Try Again clears all answers, storage, cached results, controls and progress');
  await check("document.body.dataset.comfortColor==='green'&&localStorage.getItem('unrelated-demo-setting')==='preserve'&&sessionStorage.getItem('unrelated-demo-setting')==='preserve'",'reset preserves unrelated settings and storage');
  await check("!document.querySelector('#recommendation-results').textContent&&!document.querySelector('#score-content').textContent&&document.querySelector('#view-result').disabled",'previous reveal and scoring details cleared');
  await send('Page.reload');await waitFor('window.FriendsLab','reset refresh initializes');await check('current===10&&'+empty,'refresh never restores cleared attempt');
  await evaluate(seedB+';goTo(16)');await waitFor("FriendsLab.result&&FriendsLab.engine.includes('Python')",'second attempt computes with Python',30000);
  await check("FriendsLab.result.profile.mood==='lonely'&&FriendsLab.result.profile.stress===2&&FriendsLab.result.profile.character==='Phoebe'&&FriendsLab.result.profile.quote==='Smelly Cat'&&FriendsLab.result.profile.familiarity==='new'&&FriendsLab.result.profile.nostalgia==='low'&&FriendsLab.result.profile.experience==='warmth'&&document.querySelector('#profile-progress').textContent==='6 / 6 questions answered'",'all six steps recompleted using only new values');
  await check("FriendsLab.result.recommendations[0].episode.id!=='s05e16'",'new attempt changes former PIVOT recommendation');
  // Hold an in-flight old request, reset, and then release it. It must not resurrect state.
  await evaluate("goTo(10);document.querySelector('[data-answer=mood][data-value=sad]').click();window.originalFetch=fetch;window.fetch=(url,...args)=>String(url)==='/api/recommend'?new Promise(resolve=>window.releaseOld=()=>resolve(originalFetch(url,...args))):originalFetch(url,...args);goTo(17)");
  await check('FriendsLab.diagnostics.pending','delayed old ranking is pending');
  await evaluate("document.querySelector('#try-again').click();window.releaseOld();window.fetch=originalFetch");await pause(1500);
  await check('current===10&&'+empty,'late old Python response cannot restore cleared profile or result');
  // Repeat in fallback mode, then prove it scores only the new profile.
  await evaluate(seedB+";window.originalFetch=fetch;window.fetch=(url,...args)=>String(url).includes('/api/')?Promise.reject(Error('Intentional Python failure')):originalFetch(url,...args);goTo(17)");
  await waitFor("FriendsLab.result&&FriendsLab.engine.includes('JavaScript fallback')",'fallback second attempt remains functional');
  await check("FriendsLab.result.recommendations.every(r=>r.factors.some(f=>f.factor==='quote'&&f.reason.includes('Smelly Cat')))&&!/Python|JavaScript|fallback/i.test(document.querySelector('#recommendation-status').textContent)",'fallback explanations use only new quote and diagnostics stay out of ordinary UI');
  await evaluate("document.querySelector('#try-again').click();window.fetch=originalFetch");await check('current===10&&'+empty,'fallback attempt resets through same state system');
  test(errors.length===0,'no unexpected v1.0 UX errors: '+errors.join(' '));
  const report={passed:checks,errors,suite:'v1.0 illustrated concepts, comic, Python playback and retained UX/reset'};
  fs.writeFileSync(path.join(root,'test-results','v10-ux-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));await send('Browser.close');ownedBrowser=false;
})().catch(async error=>{console.error(error);if(send&&ws?.readyState===1)try{await send('Browser.close');}catch{}if(ownedBrowser)browser?.kill();process.exitCode=1;});
