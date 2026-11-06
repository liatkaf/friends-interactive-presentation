// Dependency-free Edge/Chromium smoke test. First run: node serve.cjs
// Then: node tests/browser-test.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const pause = ms => new Promise(resolve=>setTimeout(resolve,ms));
const port = 9367;
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


  await waitFor("window.FriendsLab&&document.querySelector('#stress-o-meter')",'enhanced profile initializes');
  await check("sections.length===17&&[...document.querySelectorAll('.profile-enhanced')].length===6&&sections[9].id==='slide-10'&&sections[14].id==='slide-15'",'six existing questions remain at verified slide indices');
  await check("Object.keys(FriendsLab.profile).length===0&&document.querySelector('#profile-stress').value==='5'&&document.querySelector('#profile-stress-value').textContent.trim()==='\u2014'&&document.querySelector('#stress-o-meter').dataset.answered==='false'",'gauge preview never auto-submits a default answer');
  await waitFor("[...document.querySelectorAll('.portrait-gallery img')].every(x=>x.complete&&x.naturalWidth===400)",'portrait assets finish loading');
  await check("document.querySelectorAll('.portrait-gallery img').length===6&&!document.querySelector('.portrait-gallery svg')&&[...document.querySelectorAll('.portrait-gallery img')].every(x=>x.complete&&x.naturalWidth===400&&x.naturalHeight===500)",'six optimized painterly portraits load, replacing geometric avatars');
  const groups=[['mood',9],['character',11],['quote',12],['experience',13],['familiarity',14],['nostalgia',14]];
  for(const [field,index] of groups){
    await evaluate(`goTo(${index})`);
    const count=await evaluate(`document.querySelectorAll('[data-answer="${field}"]').length`);
    test(count===({mood:6,character:6,quote:6,experience:5,familiarity:3,nostalgia:3})[field],'original option count '+field);
    for(let i=0;i<count;i++){
      const selector=`[data-answer="${field}"]:nth-of-type(${i+1})`;
      const target=await evaluate(`(()=>{const b=[...document.querySelectorAll('[data-answer="${field}"]')][${i}];b.scrollIntoView({block:'center'});const r=b.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2,value:b.dataset.value};})()`);
      await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:target.x,y:target.y});await send('Input.dispatchMouseEvent',{type:'mousePressed',x:target.x,y:target.y,button:'left',clickCount:1});await send('Input.dispatchMouseEvent',{type:'mouseReleased',x:target.x,y:target.y,button:'left',clickCount:1});
      await check(`FriendsLab.profile[${JSON.stringify(field)}]===${JSON.stringify(target.value)}&&document.querySelectorAll('[data-answer="${field}"][aria-pressed=true]').length===1`,'real mouse selects '+field+'/'+i);
      const clearSelector=(field==='familiarity'||field==='nostalgia')?`[data-clear="${field}"]`:`[data-clear-step="${({mood:1,character:3,quote:4,experience:5})[field]}"]`;
      await evaluate(`document.querySelector(${JSON.stringify(clearSelector)}).click();document.querySelectorAll('[data-answer="${field}"]')[${i}].focus()`);
      const key=i%2?' ':'Enter',code=i%2?'Space':'Enter',vk=i%2?32:13;
      await send('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode:vk,text:i%2?' ':'\r'});await send('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode:vk});
      await check(`current===${index}&&FriendsLab.profile[${JSON.stringify(field)}]===${JSON.stringify(target.value)}&&document.querySelectorAll('[data-answer="${field}"][aria-pressed=true]').length===1`,'native Enter/Space selects without navigation '+field+'/'+i);
      await evaluate('goTo(0)');await evaluate(`goTo(${index})`);
      await check(`FriendsLab.profile[${JSON.stringify(field)}]===${JSON.stringify(target.value)}&&document.querySelectorAll('[data-answer="${field}"]')[${i}].getAttribute('aria-pressed')==='true'`,'selection survives revisiting '+field+'/'+i);
      if(field==='character')await check(`getComputedStyle(document.querySelectorAll('[data-answer="character"]')[${i}].querySelector('.character-description')).visibility==='visible'&&document.querySelectorAll('.character-description').length===6`,'correct description is revealed '+i);
      if(field==='quote')await check(`getComputedStyle(document.querySelectorAll('[data-answer="quote"]')[${i}].querySelector('.quote-reveal')).visibility==='visible'&&FriendsLab.profile.quote===FRIENDS_V05.quotes[${i}].id`,'quote content and internal ID preserved '+i);
      if(field==='experience')await check(`document.querySelector('#comfort-order').dataset.ordered==='true'&&document.querySelector('#comfort-order').textContent.includes(document.querySelectorAll('[data-answer="experience"]')[${i}].querySelector('strong').textContent)`,'menu order updates immediately '+i);
    }
  }
  await evaluate('goTo(10)');
  for(let value=0;value<=10;value++){
    await evaluate(`document.querySelector('#profile-stress').value=${value};document.querySelector('#profile-stress').dispatchEvent(new Event('input'))`);
    await check(`FriendsLab.profile.stress===${value}&&document.querySelector('#profile-stress-value').textContent==='${value}'&&document.querySelector('#stress-o-meter').style.getPropertyValue('--needle-angle')==='${value*18-90}deg'&&document.querySelector('#stress-o-meter').dataset.band==='${value<=3?'low':value<=6?'medium':'high'}'`,'exact stress gauge mapping '+value);
  }
  await evaluate("document.querySelector('#profile-stress').focus()");
  for(const [key,value] of [['Home',0],['ArrowRight',1],['End',10]]){
    await send('Input.dispatchKeyEvent',{type:'keyDown',key,code:key,windowsVirtualKeyCode:({Home:36,ArrowRight:39,End:35})[key]});await send('Input.dispatchKeyEvent',{type:'keyUp',key,code:key});
    await check(`current===10&&FriendsLab.profile.stress===${value}`,'native slider keyboard '+key);
  }
  await evaluate('presentation.focus()');
  const slider=await evaluate("(()=>{const r=document.querySelector('#profile-stress').getBoundingClientRect();return {x:r.x+r.width*.25,y:r.y+r.height/2,left:r.x,width:r.width}})()");
  await send('Input.dispatchMouseEvent',{type:'mousePressed',x:slider.x,y:slider.y,button:'left',clickCount:1});await send('Input.dispatchMouseEvent',{type:'mouseReleased',x:slider.x,y:slider.y,button:'left',clickCount:1});
  await check('FriendsLab.profile.stress>=2&&FriendsLab.profile.stress<=3','native mouse slider responds');
  await send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
  await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:slider.left+slider.width*.76,y:slider.y}]});await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await check('FriendsLab.profile.stress>=7&&FriendsLab.profile.stress<=8','native touch slider responds');await send('Emulation.setTouchEmulationEnabled',{enabled:false});
  for(let step=1;step<=6;step++){
    await evaluate(`goTo(${8+step});window.uncleared={...FriendsLab.profile};document.querySelector('[data-clear-step="${step}"]').click()`);
    const keys=[['mood'],['stress'],['character'],['quote'],['experience'],['familiarity','nostalgia']][step-1];
    await check(`(${JSON.stringify(keys)}).every(k=>FriendsLab.profile[k]===undefined)&&Object.entries(uncleared).filter(([k])=>!(${JSON.stringify(keys)}).includes(k)).every(([k,v])=>FriendsLab.profile[k]===v)`,'Clear Answer only clears step '+step);
    await evaluate(`document.querySelector('[data-clear-step="${step}"]').nextElementSibling.click()`);await check(`current===${9+step}`,'Skip / continue preserves navigation '+step);
  }
  await evaluate("goTo(14);document.querySelector('[data-answer=familiarity][data-value=rewatcher]').click();document.querySelector('[data-answer=nostalgia][data-value=high]').click()");
  await check("current===14&&document.querySelector('#profile-completion-cue').dataset.complete==='true'",'both dials give cue without auto-advancing');
  await evaluate("document.querySelector('[data-clear=familiarity]').click()");await check("!FriendsLab.profile.familiarity&&FriendsLab.profile.nostalgia==='high'&&document.querySelector('#profile-completion-cue').dataset.complete==='false'",'individual familiarity clear preserves nostalgia');
  await evaluate("document.querySelector('[data-answer=familiarity][data-value=some]').click();document.querySelector('[data-clear=nostalgia]').click()");await check("FriendsLab.profile.familiarity==='some'&&!FriendsLab.profile.nostalgia&&document.querySelector('#nostalgia-selector').dataset.level==='0'",'individual nostalgia clear preserves familiarity');
  const seed="goTo(9);document.querySelector('[data-answer=mood][data-value=happy]').click();goTo(10);document.querySelector('#profile-stress').value=4;document.querySelector('#profile-stress').dispatchEvent(new Event('input'));goTo(11);document.querySelector('[data-answer=character][data-value=Monica]').click();goTo(12);document.querySelector('[data-answer=quote][data-value=\"I know!\"]').click();goTo(13);document.querySelector('[data-answer=experience][data-value=warmth]').click();goTo(14);document.querySelector('[data-answer=familiarity][data-value=rewatcher]').click();document.querySelector('[data-answer=nostalgia][data-value=high]').click()";
  await evaluate(seed+';window.savedProfile=JSON.stringify(FriendsLab.profile)');const saved=await evaluate('savedProfile');
  await send('Page.reload');await waitFor("window.FriendsLab&&document.querySelector('#profile-completion-cue')?.dataset.complete==='true'",'reload restores view from the same persisted store');
  await check(`Object.entries(JSON.parse(${JSON.stringify(saved)})).every(([k,v])=>FriendsLab.profile[k]===v)&&Object.keys(FriendsLab.profile).length===7&&document.querySelector('#profile-progress').textContent==='6 / 6 questions answered'&&document.querySelector('#stress-o-meter').dataset.answered==='true'&&document.querySelector('#comfort-order').dataset.ordered==='true'`,'normal refresh preserves answers, gauge, order and completion');
  const baseline=JSON.parse(fs.readFileSync(path.join(root,'tests','fixtures','pre-profile-recommendations.json'),'utf8'));
  for(let i=0;i<baseline.cases.length;i++){
    const item=baseline.cases[i];
    const result=await evaluate(`(async()=>{const p=${JSON.stringify(item.profile)},expected=${JSON.stringify(item.recommendations)},canonical=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b))):v),js=FriendsLab.fallbackRecommend(p).recommendations,py=await(await fetch('/api/recommend',{method:'POST',body:JSON.stringify(p)})).json();return {js:canonical(js)===canonical(expected),python:canonical(py.recommendations)===canonical(expected)};})()`);
    test(result.js,'unchanged pre-upgrade JavaScript ranking/factors '+i);test(result.python,'unchanged pre-upgrade Python ranking/factors '+i);
  }
  for(const [width,height] of [[1440,1000],[1366,768],[1024,768],[768,1000],[390,844],[320,844]]){
    await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<600});
    for(let index=9;index<=14;index++){
      await evaluate(`goTo(${index});presentation.focus();FriendsNavigation.hide()`);await pause(100);
      await check('sections[current].scrollWidth<=sections[current].clientWidth','no horizontal overflow '+width+'/'+(index+1));
      await check('sections[current].scrollHeight<=sections[current].clientHeight+1','question fits intended viewport '+width+'/'+(index+1));
    }
  }
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await evaluate("goTo(10);document.querySelector('#profile-stress').value=0;document.querySelector('#profile-stress').dispatchEvent(new Event('input'))");
  await check("getComputedStyle(document.querySelector('.stress-needle')).transitionDuration==='0s'&&getComputedStyle(document.querySelector('.character-portrait')).transitionDuration==='0s'",'reduced motion removes needle and choice transitions');
  await evaluate("goTo(16)");await waitFor('FriendsLab.result','recommendation still calculates');await evaluate("document.querySelector('#back-to-start').click()");
  await check("current===0&&FriendsLab.profile.character==='Monica'&&FriendsLab.profile.stress===0",'Back to Start preserves new profile');
  await evaluate("goTo(16);document.querySelector('#try-again').click()");
  await check("current===9&&Object.keys(FriendsLab.profile).length===0&&!sessionStorage.getItem('friends-profile-v05')&&FriendsLab.result===null&&!document.querySelector('[data-answer][aria-pressed=true]')&&document.querySelector('#stress-o-meter').dataset.answered==='false'&&document.querySelector('#comfort-order').dataset.ordered==='false'&&document.querySelector('#profile-completion-cue').dataset.complete==='false'",'Try Again clears every new visual through the existing store');
  await send('Page.reload');await waitFor('window.FriendsLab','cleared refresh');await check("Object.keys(FriendsLab.profile).length===0&&document.querySelector('#profile-progress').textContent==='0 / 6 questions answered'",'cleared answers never reappear');
  test(errors.length===0,'no unexpected profile errors: '+errors.join(' '));
  const report={passed:checks,errors,goldenCases:baseline.cases.length,primarySlides:17,suite:'Six distinct profile experiences, input parity, persistence, responsiveness and golden scoring'};
  fs.writeFileSync(path.join(root,'test-results','profile-experience-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));await send('Browser.close');ownedBrowser=false;
})().catch(async error=>{console.error(error);if(send&&ws?.readyState===1)try{await send('Browser.close');}catch{}if(ownedBrowser)browser?.kill();process.exitCode=1;});
