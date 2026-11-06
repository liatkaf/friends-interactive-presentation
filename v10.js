"use strict";
// These controllers reveal original SVG art and play complete bitmap frames authored in Python.
(() => {
 const manifest=window.FRIENDS_ANIMATIONS;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const quiet=()=>reduced.matches||document.body.classList.contains('quiet-motion');
 const players=new Set();
 const figures=FRIENDS_V05.research.figures;

 class FramePlayer {
  constructor(host){
   this.host=host;this.canvas=host.querySelector('.python-canvas');this.key=host.dataset.pythonAnimation;
   this.frame=manifest.frames-1;this.frameHandle=0;this.playing=false;this.run=0;this.draws=0;
   this.playButton=host.querySelector('[data-animation-play]');
   this.playLabel=this.playButton.textContent;this.status=host.querySelector('.animation-status');
   this.playButton.onclick=()=>this.playing?this.pause():this.play();
   host.querySelector('[data-animation-replay]').onclick=()=>this.play();
   const enlarge=document.createElement('button');enlarge.dataset.animationEnlarge='';enlarge.textContent='Enlarge';
   enlarge.onclick=()=>enlargeAnimation(this,enlarge);host.querySelector('.python-controls').append(enlarge);
   host.pythonPlayer=this;players.add(this);this.poster();
  }
  get state(){return {key:this.key,frame:this.frame,playing:this.playing,pendingFrames:this.frameHandle?1:0,draws:this.draws,pythonAuthored:true};}
  visible(){return !document.hidden&&!this.host.closest('[hidden]')&&(!this.host.closest('details')||this.host.closest('details').open)&&(!this.host.closest('dialog')||this.host.closest('dialog').open);}
  asset(){return manifest.animations[this.key];}
  poster(){this.canvas.style.backgroundImage=`url('${this.asset().paths.poster}')`;this.canvas.style.backgroundSize='100% 100%';this.canvas.style.backgroundPosition='0 0';this.frame=manifest.frames-1;this.host.querySelector('progress').value=this.frame;}
  setAnimation(key,label){this.pause(false);this.key=key;this.host.dataset.pythonAnimation=key;this.canvas.setAttribute('aria-label',label);this.poster();this.status.textContent='Python-authored frames. Play to explore.';this.host.dataset.playback='ready';}
  pause(announce=true){this.run++;cancelAnimationFrame(this.frameHandle);this.frameHandle=0;this.playing=false;this.playButton.textContent=this.playLabel;this.host.setAttribute('aria-busy','false');if(announce&&this.host.dataset.playback==='playing'){this.host.dataset.playback='paused';this.status.textContent='Paused. Play or replay when ready.';}}
  async play(){
   this.pause(false);if(!this.visible())return;
   if(quiet()){this.poster();this.host.dataset.playback='reduced';this.status.textContent='Static summary shown for reduced motion.';return;}
   const run=this.run;this.host.setAttribute('aria-busy','true');this.status.textContent='Loading animation…';
   try{await new Promise((resolve,reject)=>{const image=new Image();image.onload=resolve;image.onerror=reject;image.src=this.asset().paths.atlas;});}
   catch{if(run!==this.run)return;this.poster();this.host.setAttribute('aria-busy','false');this.host.dataset.playback='fallback';this.status.textContent='Animation unavailable. The study summary and original reference remain available.';return;}
   if(run!==this.run||!this.visible()||quiet())return;
   this.canvas.style.backgroundImage=`url('${this.asset().paths.atlas}')`;this.canvas.style.backgroundSize=`100% ${manifest.frames*100}%`;
   this.playing=true;this.frame=0;this.host.dataset.playback='playing';this.playButton.textContent='Pause';this.status.textContent='Playing Python-authored animation.';
   const start=performance.now();
   const render=now=>{
    this.frameHandle=0;if(!this.playing||!this.visible()){this.pause();return;}
    this.frame=Math.min(manifest.frames-1,Math.floor((now-start)/manifest.duration_ms*manifest.frames));
    this.canvas.style.backgroundPosition=`0 ${this.frame/(manifest.frames-1)*100}%`;
    this.host.querySelector('progress').value=this.frame;this.draws++;
    if(now-start>=manifest.duration_ms){this.pause(false);this.poster();this.host.dataset.playback='complete';this.status.textContent='Animation complete. Explore the source details below.';return;}
    this.frameHandle=requestAnimationFrame(render);
   };
   this.frameHandle=requestAnimationFrame(render);
  }
 }

 const animationDialog=document.createElement('dialog');animationDialog.id='animation-viewer';animationDialog.setAttribute('aria-labelledby','animation-viewer-title');
 animationDialog.innerHTML='<div class="dialog-head"><h2 id="animation-viewer-title">Python-authored animation</h2><button class="dialog-close">Close ×</button></div><div class="enlarged-animation"></div>';
 document.body.append(animationDialog);let enlargedPlayer=null,animationOpener=null;
 animationDialog.querySelector('.dialog-close').onclick=()=>animationDialog.close();
 animationDialog.addEventListener('close',()=>{if(enlargedPlayer){enlargedPlayer.pause(false);players.delete(enlargedPlayer);enlargedPlayer=null;}animationDialog.querySelector('.enlarged-animation').replaceChildren();animationOpener?.focus();});
 function enlargeAnimation(player,opener){
  player.pause();animationOpener=opener;
  animationDialog.querySelector('.enlarged-animation').innerHTML=pythonPlayer(player.key,player.canvas.getAttribute('aria-label'));
  enlargedPlayer=new FramePlayer(animationDialog.querySelector('.python-player'));
  animationDialog.querySelector('[data-animation-enlarge]').remove();animationDialog.showModal();
 }

 // Original illustrated concept cards: one open idea at a time, no profile data.
 let selectedPillar=null;
 $$('[data-pillar]').forEach(button=>button.onclick=()=>{
  const id=Number(button.dataset.pillar);selectedPillar=selectedPillar===id?null:id;
  $$('[data-pillar]').forEach(b=>{const open=Number(b.dataset.pillar)===selectedPillar;b.setAttribute('aria-expanded',String(open));b.closest('.pillar-card').classList.toggle('is-open',open);$('#'+b.getAttribute('aria-controls')).hidden=!open;});
  $('#pillar-takeaway').textContent=selectedPillar===null?'Why does this make Friends feel comforting? Choose an idea to explore.':pillars[id][5];
 });

 function design(id){
  const figure=figures[id];
  if(id<4)return `Study ${figure.study} experiment: recall a fight or list possessions, then describe favorite TV or whatever was on. Outcome: ${figure.evidence.outcome.toLowerCase()}.`;
  if(id<6)return `Study 1 experiment: free or regulated writing, then room listing or favorite-TV recall. Outcome: ${figure.evidence.outcome.toLowerCase()}.`;
  return 'Study 2 diary: Day 1 effortful self-control, Day 2 familiar-world use, Day 3 negative mood. Viewing was not randomly assigned.';
 }
 function limitation(id){return id===6?'Observational association, not causation. Other daily experiences may matter.':id<4?'Recall and essay tasks, not a Friends viewing trial. No clinical treatment was tested.':'One historical experiment. Non-significance is not equivalence; no physical cognitive energy was measured.';}

 $$('.qualitative-explorer').forEach(stage=>{
  const initial=Number(stage.dataset.evidenceGroup.split(',')[0]);
  const workbench=document.createElement('div');workbench.className='study-workbench';
  workbench.innerHTML=pythonPlayer('evidence-'+initial,figures[initial].explanation)+'<div class="study-notes"><span class="overline">WHAT WAS TESTED?</span><p class="study-design"></p><span class="overline">WHAT WAS REPORTED?</span><p class="study-finding"></p><p class="study-limit"></p></div>';
  stage.querySelector('.figure-tabs').after(workbench);
  const player=new FramePlayer(workbench.querySelector('.python-player'));
  // Preserve the v0.9 evidence map, table, selectors and original references as optional audit detail.
  const audit=document.createElement('details');audit.className='source-audit';audit.innerHTML='<summary>Inspect reported tests and data table</summary>';
  audit.append(stage.querySelector('.evidence-map'),stage.querySelector('.evidence-table'));stage.append(audit);
  function select(id){
   player.setAnimation('evidence-'+id,figures[id].explanation);
   workbench.querySelector('.study-design').textContent=design(id);
   workbench.querySelector('.study-finding').textContent=figures[id].takeaway;
   workbench.querySelector('.study-limit').textContent=limitation(id);
  }
  stage.querySelectorAll('[data-inline-figure]').forEach(button=>{
   const id=Number(button.dataset.inlineFigure);
   if(id>=4)button.textContent=({4:'Puzzle Performance',5:'Negative Mood',6:'Daily Diary'})[id];
   button.addEventListener('click',()=>select(id));
  });select(initial);
 });

 function pauseInactive(){players.forEach(player=>{if(!player.visible())player.pause();});}
 document.addEventListener('friends:slidechange',pauseInactive);document.addEventListener('visibilitychange',pauseInactive);
 function respectMotion(){if(quiet())players.forEach(player=>{player.pause(false);player.poster();player.host.dataset.playback='reduced';player.status.textContent='Static summary shown for reduced motion.';});}
 reduced.addEventListener('change',respectMotion);let lastQuiet=quiet();new MutationObserver(()=>{if(quiet()!==lastQuiet){lastQuiet=quiet();respectMotion();}}).observe(document.body,{attributes:true,attributeFilter:['class']});
 respectMotion();
 window.FriendsFinal={get state(){return {selectedPillar,players:[...players].map(p=>p.state)};},manifest};
})();
