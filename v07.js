"use strict";
// Game state is local to Slide 5 and deliberately absent from FriendsLab/profile APIs.
(() => {
 const host=document.querySelector('#stairwell-view');
 let state=PivotChallengeModel.initial(),mounted=false;
 const listeners=new Set();
 const controller={get state(){return {...state};},subscribe(listener){listeners.add(listener);return ()=>listeners.delete(listener);},dispatch(action){const next=PivotChallengeModel.transition(state,action);if(next===state)return;state=next;render(action);listeners.forEach(listener=>listener({...state},action));}};
 const $=selector=>document.querySelector(selector);
 function render(action){
   $('#move-up').disabled=state.stage===3;$('#pivot-couch').disabled=state.stage!==2||state.pivotCompleted;
   $('#pivot-feedback').textContent=state.stage===0?'Move the couch upstairs!':state.stage===3?'Success! You reached the top landing.':state.feedback.startsWith('STUCK')?'STUCK! Pivot first!':state.pivotCompleted?'PERFECT PIVOT!':state.stage===2?'Tight corner \u2014 PIVOT needed!':'Keep going. Tight corner ahead.';
   host.dataset.stage=String(state.stage);host.dataset.pivoted=String(state.pivotCompleted);
   const positions=[[25,79],[25,60],[25,39],[77,22]];
   host.style.setProperty('--couch-left',positions[state.stage][0]+'%');host.style.setProperty('--couch-top',positions[state.stage][1]+'%');host.style.setProperty('--couch-turn',state.pivotCompleted?'90deg':'0deg');
   $('#pivot-challenge').classList.remove('game-failure','game-success');
   if(action==='move'&&state.feedback.startsWith('STUCK')){void host.offsetWidth;$('#pivot-challenge').classList.add('game-failure');}
   if(state.stage===3)$('#pivot-challenge').classList.add('game-success');
 }
 $('#move-up').onclick=()=>controller.dispatch('move');$('#pivot-couch').onclick=()=>controller.dispatch('pivot');$('#reset-challenge').onclick=()=>controller.dispatch('reset');
 render('reset');
 async function mount(){if(mounted)return;mounted=true;
  if(location.protocol==='file:'){host.dataset.mode='fallback';$('#stairwell-mode').textContent='Illustrated stairwell · same game rules';return;}
  try{const module=await import('./couch.js');module.mountStairwell(host,controller);}catch{host.dataset.mode='fallback';$('#stairwell-mode').textContent='Illustrated stairwell · same game rules';}
 }
 document.addEventListener('friends:slidechange',event=>{if(event.detail.index===4)mount();});
 if(current===4)mount();
 // Read-only snapshots plus normal action dispatch support reproducible browser QA.
 window.PivotChallenge={get state(){return {...state};},dispatch:action=>controller.dispatch(action)};
})();
