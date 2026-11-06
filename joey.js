"use strict";
// An unscored, original illustrated adaptation; no choices enter the episode profile.
(() => {
 const host=document.querySelector('#joey-story');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const quiet=()=>reduced.matches||document.body.classList.contains('quiet-motion');
 const timers=new Set();let run=0,selected=null;
 const node=id=>host.querySelector('#joey-'+id);
 function clear(){run++;timers.forEach(clearTimeout);timers.clear();}
 function later(fn,delay){const token=run,id=setTimeout(()=>{timers.delete(id);if(token===run)fn();},delay);timers.add(id);}
 function stage(value){host.dataset.stage=value;}
 function reset(){
  clear();selected=null;stage('ready');node('caption').textContent='A dinner date. A plate of fries. A familiar moment.';
  node('stage-label').textContent='THE SETUP';node('play').hidden=false;node('play').disabled=false;
  ['prediction','takeaway','replay'].forEach(id=>node(id).hidden=true);
  host.querySelector('.joey-reaction-art').hidden=true;host.querySelector('.freeze-stamp').hidden=true;host.querySelector('.joey-punchline').hidden=true;
  host.querySelector('.joey-scene').setAttribute('aria-label','Original illustration: Joey and his date at a cozy restaurant; she reaches for a fry from his plate.');
  host.querySelectorAll('[data-joey-choice]').forEach(b=>{b.disabled=false;b.setAttribute('aria-pressed','false');});
 }
 function freeze(){
  stage('freeze');node('stage-label').textContent='FREEZE & PREDICT';node('caption').textContent='She takes a fry. Hold that thought...';
  node('prediction').hidden=false;host.querySelector('.freeze-stamp').hidden=false;node('replay').hidden=false;
 }
 function start(){
  reset();stage('setup');node('play').hidden=true;node('replay').hidden=false;
  node('caption').textContent='Joey is out for dinner. Everything feels familiar.';
  if(quiet()){freeze();return;}
  later(()=>node('caption').textContent='Then his date reaches over... and takes a fry.',3000);
  later(freeze,5500);
 }
 function takeaway(){stage('complete');node('takeaway').hidden=false;node('caption').textContent='You may have known the reaction. The timing still makes the joke.';}
 function reveal(){
  stage('reveal');host.querySelector('.freeze-stamp').hidden=true;host.querySelector('.joey-reaction-art').hidden=false;
  host.querySelector('.joey-punchline').hidden=false;node('stage-label').textContent='THE FAMILIAR REACTION';
  node('caption').textContent="JOEY DOESN'T SHARE FOOD!";
  host.querySelector('.joey-scene').setAttribute('aria-label','Original illustrated reaction: Joey leans forward in comic protest, protects his plate and raises his palm. His date holds the fry.');
  if(quiet())takeaway();else later(takeaway,1800);
 }
 host.querySelectorAll('[data-joey-choice]').forEach(button=>button.onclick=()=>{
  if(host.dataset.stage!=='freeze')return;
  selected=button.dataset.joeyChoice;clear();stage('beat');node('prediction').hidden=true;
  host.querySelectorAll('[data-joey-choice]').forEach(b=>{b.setAttribute('aria-pressed',String(b===button));b.disabled=true;});
  node('caption').textContent='You have a prediction. Now, that familiar pause...';
  // Focus a surviving control before hiding the selected option.
  node('replay').focus({preventScroll:true});
  if(quiet())reveal();else later(reveal,650);
 });
 node('play').onclick=start;node('replay').onclick=start;
 function stopWhenHidden(){if(document.hidden||host.closest('.slide').hidden){if(['setup','beat','reveal'].includes(host.dataset.stage))reset();else clear();}}
 document.addEventListener('friends:slidechange',stopWhenHidden);document.addEventListener('visibilitychange',stopWhenHidden);
 function motionChanged(){if(quiet()){const current=host.dataset.stage;clear();if(current==='setup')freeze();else if(current==='beat')reveal();else if(current==='reveal')takeaway();}}
 reduced.addEventListener('change',motionChanged);let lastQuiet=quiet();new MutationObserver(()=>{if(lastQuiet!==quiet()){lastQuiet=quiet();motionChanged();}}).observe(document.body,{attributes:true,attributeFilter:['class']});
 reset();window.JoeyStory={get state(){return {stage:host.dataset.stage,selected,pendingTimers:timers.size};}};
})();
