"use strict";
// Presentation-only projection of the existing single profile store. No new answers or scoring state.
(() => {
 function render(){
  const p=FriendsLab.profile,answered=Number.isFinite(p.stress),value=answered?p.stress:5;
  const gauge=document.querySelector('#stress-o-meter');
  gauge.style.setProperty('--needle-angle',`${value*18-90}deg`);gauge.dataset.answered=String(answered);
  gauge.dataset.band=!answered?'unset':value<=3?'low':value<=6?'medium':'high';
  document.querySelector('#stress-caption').textContent=!answered?'Your dial is waiting. Move the slider to answer.':value<=3?"Could this day BE any more relaxed?":value<=6?'A little chaos, a little coffee.':'Definitely a PIVOT! kind of day.';
  document.querySelector('#stress-band').textContent=!answered?'NOT SET':value<=3?'LOW':value<=6?'MODERATE':'HIGH';
  document.querySelector('#profile-stress').setAttribute('aria-valuetext',answered?`${value} out of 10`:'5 out of 10 preview; unanswered');
  document.querySelector('#mood-selector').dataset.mood=p.mood||'unset';
  document.querySelector('#comfort-order').textContent=p.experience?'Your order: '+document.querySelector(`[data-answer="experience"][data-value="${p.experience}"] strong`).textContent:'Choose your comfort. No checkout needed.';
  document.querySelector('#comfort-order').dataset.ordered=String(!!p.experience);
  document.querySelector('#fan-remote-display').textContent=p.familiarity?({new:'FIRST EPISODE',some:'CASUAL VIEWING',rewatcher:'REWATCH MODE'})[p.familiarity]:'CHOOSE YOUR CHANNEL';
  const levels={low:1,medium:2,high:3};document.querySelector('#nostalgia-selector').dataset.level=String(levels[p.nostalgia]||0);
  const complete=!!p.familiarity&&!!p.nostalgia;
  document.querySelector('#profile-completion-cue').textContent=complete?"Both dials set. You're ready to find your episode.":'Two dials, your pace. Either answer is optional.';
  document.querySelector('#profile-completion-cue').dataset.complete=String(complete);
 }
 document.addEventListener('friends:profilechange',render);render();
})();
