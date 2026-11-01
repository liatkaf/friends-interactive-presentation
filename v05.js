"use strict";
// Extend the existing deck and its Three.js mounts without replacing navigation.
(() => {
const {catalog,research}=window.FRIENDS_V05;
const episodes=catalog.episodes;
const query=s=>document.querySelector(s);
const content=n=>query(`#slide-${n} .slide-content`);
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const keys=['mood','stress','character','quote','familiarity','nostalgia','predictability','experience'];
const options={mood:['stressed','sad','lonely','bored','happy','overwhelmed'],character:['Monica','Rachel','Phoebe','Joey','Chandler','Ross'],quote:['PIVOT!',"How you doin'?",'Smelly Cat'],familiarity:['new','some','rewatcher'],nostalgia:['low','medium','high'],predictability:['predictable','surprising'],experience:['laughter','warmth','friendship','nostalgia','lighthearted entertainment']};
let profile={};
try {const stored=JSON.parse(sessionStorage.getItem('friends-profile-v05')||'{}');if(stored&&typeof stored==='object')for(const k of keys)if(k==='stress'?typeof stored[k]==='number'&&Number.isFinite(stored[k])&&stored[k]>=0&&stored[k]<=10:options[k]?.includes(stored[k]))profile[k]=stored[k];} catch {}
const select=(key,label)=>`<label class="profile-field">${label}<select data-profile="${key}"><option value="">Skip for now</option>${options[key].map(x=>`<option value="${escape(x)}">${escape(x)}</option>`).join('')}</select></label>`;
const panel=(n,html)=>content(n).insertAdjacentHTML('beforeend',`<div class="lab-panel">${html}</div>`);
const artwork=(name,alt)=>`<img class="original-art" src="assets/${name}-original.png" alt="${alt}">`;
content(1).insertAdjacentHTML('beforeend',`<div class="artwork-pair">${artwork('central-perk','User-created Central Perk cafe artwork')}${artwork('friends-couch','User-created Friends orange couch artwork')}</div><p class="small">FriendsAnxietyStudio · Comfort Lab · Python + JavaScript + Three.js</p>`);
query('.header-note').innerHTML='<span id="profile-progress" role="status">Your episode profile: 0 / 8</span>';
// Keep the v0.4 imagined overload activity separate from the new personal input.
query('#slide-2 .small').textContent='The imagined overload activity is separate from your optional episode profile below.';
panel(2,`<h3>Your check-in</h3><label>Self-reported stress <input id="profile-stress" type="range" min="0" max="10" value="5"><output id="profile-stress-value">Not answered · move to choose 0–10</output></label><button id="skip-stress">Clear stress answer</button><p class="small">Reflection only. Optional choices stay in this browser tab until reset; preferences are sent only to your local Python server.</p>`);
panel(3,`<h3>Published research, explored</h3><div class="pills"><button data-metric="doing" aria-pressed="true">Chosen when lonely</button><button data-metric="loneliness" aria-pressed="false">Loneliness-related ratings</button></div><div id="research-bars"></div><p id="research-tooltip" role="status">Select or focus a bar for its published mean.</p><p id="research-axis"></p><p class="small">${research.note} <a href="${research.doi}" target="_blank" rel="noopener">${research.source}</a></p>${select('familiarity','How well do you know the series?')}`);
// The existing synthetic reasons activity remains available and explicitly labeled.
panel(4,select('predictability','Tonight, which story feels right?'));
panel(6,`${artwork('friends-couch','User-created orange couch artwork celebrating fictional company')}${select('character','Who gets the seat next to you?')}<div id="affinity-chart" aria-label="Character preference chart"></div><p class="small">Your selection, not a psychological affinity measure.</p><p>Paper A studies social surrogacy. These Friends character examples are interpretations; fictional bonds are one-sided.</p>`);
panel(7,select('experience','What would you like from an episode?'));
panel(8,`${select('nostalgia','How nostalgic should tonight feel?')}<p class="small">Nostalgia is a broader psychological interpretation here; these two papers do not directly test nostalgia as a Friends comfort mechanism.</p>`);
panel(9,`${select('quote','Pick a familiar line or song title')}<p class="small">Quotes are preferences, not measured emotional triggers.</p>`);
panel(10,`${select('mood','How are you feeling right now?')}<output id="mood-indicator">Your mood: open to anything</output><h3>Build an illustrative comfort curve</h3><div class="sim-controls">${[['stress','Initial stress',5,0,10],['familiarity','Familiarity',5,0,10],['nostalgia','Nostalgia',5,0,10],['duration','Viewing duration (minutes)',20,5,60]].map(([k,label,v,min,max])=>`<label>${label}<input data-simulator="${k}" type="range" min="${min}" max="${max}" value="${v}"><output data-sim-output="${k}">${v}</output></label>`).join('')}</div><p><strong>Educational illustration only — not a validated psychological or medical model.</strong></p><div id="comfort-index-chart"></div><p id="simulation-engine" role="status"></p>`);
panel(11,`${artwork('central-perk','User-created Central Perk artwork for your comfort zone')}<label>Text size<select id="comfort-size"><option value="1">Standard</option><option value="1.15">Large</option><option value="1.3">Extra large</option></select></label><label><input type="checkbox" id="quiet-motion"> Reduce decorative motion</label><h3>Your comfort preference profile</h3><div id="preference-chart"></div>`);
slides[11].title='The One With Your Perfect Episode';
query('#slide-12').setAttribute('aria-label','12 of 12: '+slides[11].title);
queryAll('.dot')[11].setAttribute('aria-label','Slide 12: '+slides[11].title);
queryAll('.dot')[11].title=slides[11].title;
// Preserve v0.4 references and restart, moved below the new recommendation.
const oldReferences=query('#slide-12 .references').outerHTML;
content(12).innerHTML=`<div class="slide-label">12 / YOUR CENTRAL PERK FINALE</div><h2>The One With Your Perfect Episode</h2><p class="lead">A real episode for your kind of evening.</p><div id="recommendation-status" role="status">Preparing your episode…</div><div id="recommendation-results"></div><div class="pills"><button id="why-episode">Why This Episode?</button><button id="try-again">Try Again</button><button id="surprise-me">Surprise Me</button></div><div id="score-details" hidden></div><details id="revise-profile"><summary>Revise your profile</summary><div id="profile-editor">${keys.filter(k=>k!=='stress').map(k=>select(k,k[0].toUpperCase()+k.slice(1))).join('')}</div><button id="reset-profile">Reset all episode answers</button><button data-go="1">Revise stress on slide 2</button></details><p class="small">Editorial entertainment suggestions. Algorithmic match scores are not scientific probabilities or medical prescriptions. Incomplete profiles are welcome.</p>${artwork('friends-couch','User-created orange couch artwork welcoming you to your recommended episode')}<details class="research-references"><summary>Research references & data provenance</summary><p><a href="https://doi.org/10.1016/j.jesp.2008.12.003" target="_blank" rel="noopener">Derrick, J. L., Gabriel, S., & Hugenberg, K. (2009). Social surrogacy: How favored television programs provide the experience of belonging. Journal of Experimental Social Psychology, 45, 352–362.</a></p><p><a href="https://doi.org/10.1177/1948550612454889" target="_blank" rel="noopener">Derrick, J. L. (2013). Energized by Television: Familiar Fictional Worlds Restore Self-Control. Social Psychological and Personality Science, 4(3), 299–307.</a> Published online in 2012.</p><p>Neither paper establishes a Friends anxiety treatment or cortisol reduction. Predictability, cognitive ease and nostalgia are interpretations; Friends examples and episode tags are editorial. Original figures are unaltered, not data from our own experiment. <a href="data/friends_episodes.json">Episode catalog & source links</a> · <a href="data/research_analytics.json">Published means JSON</a></p>${oldReferences}</details><button data-go="0">Back to Central Perk</button>`;
function queryAll(s){return [...document.querySelectorAll(s)];}

let metric='doing';
function drawResearch(){
 query('#research-bars').innerHTML=research.activities.map((a,i)=>`<button class="data-bar research-bar" data-research="${i}" title="${escape(a.activity)}: ${a[metric].toFixed(2)} on the 1–7 scale"><span>${a.activity}</span><span class="bar-track"><i style="width:${a[metric]/7*100}%"></i></span><b>${a[metric].toFixed(2)}</b></button>`).join('');
 query('#research-axis').textContent=`Horizontal axis: mean rating, 0–7 display (response scale 1–7). Vertical categories: activities. ${metric==='doing'?'Higher = more likely to choose when lonely.':'Lower = less likely to feel lonely; reverse-scored.'}`;
}
drawResearch();
document.addEventListener('click',event=>{
 const m=event.target.closest('[data-metric]');if(m){metric=m.dataset.metric;queryAll('[data-metric]').forEach(b=>b.setAttribute('aria-pressed',String(b===m)));drawResearch();}
 const q=event.target.closest('[data-quote]');if(q){setProfile('quote',{'orange':'PIVOT!','purple':"How you doin'?",'gold':'Smelly Cat'}[q.dataset.quote]);}
});
function researchTip(event){const b=event.target.closest('[data-research]');if(b){const a=research.activities[b.dataset.research];query('#research-tooltip').textContent=`${a.activity}: ${a[metric].toFixed(2)} / 7 — ${metric==='doing'?'likelihood of doing when lonely':'likelihood of feeling lonely'}. Published descriptive mean.`;}}
document.addEventListener('focusin',researchTip);document.addEventListener('pointerover',researchTip);document.addEventListener('click',researchTip);

function syncProfile(){
 try{sessionStorage.setItem('friends-profile-v05',JSON.stringify(profile));}catch{}
 queryAll('[data-profile]').forEach(el=>el.value=profile[el.dataset.profile]??'');
 query('#profile-progress').textContent=`Your episode profile: ${Object.keys(profile).length} / 8`;
 query('#profile-stress').value=profile.stress??5;
 query('#profile-stress-value').textContent=profile.stress===undefined?'Not answered · move to choose 0–10':`${profile.stress} / 10`;
 query('#mood-indicator').textContent='Your mood: '+(profile.mood||'open to anything');
 query('#affinity-chart').innerHTML=options.character.map(c=>`<div class="mini-row"><span>${c}</span><meter min="0" max="1" value="${profile.character===c?1:0}">${profile.character===c?'Selected':'Not selected'}</meter></div>`).join('');
 query('#preference-chart').innerHTML=keys.map(k=>`<div class="mini-row"><span>${k}</span><strong>${escape(profile[k]??'Open')}</strong></div>`).join('');
 queryAll('#slide-6 .character').forEach(el=>el.classList.toggle('favorite',el.querySelector('h3').textContent===profile.character));
}
function setProfile(key,value){if(value===''||value===undefined)delete profile[key];else profile[key]=value;syncProfile();if(current===11)loadRecommendation();}
queryAll('[data-profile]').forEach(el=>el.addEventListener('change',()=>setProfile(el.dataset.profile,el.value)));
query('#profile-stress').addEventListener('input',event=>setProfile('stress',Number(event.target.value)));
query('#skip-stress').onclick=()=>setProfile('stress',undefined);
queryAll('#slide-6 .character').forEach(el=>{const name=el.querySelector('h3').textContent;el.insertAdjacentHTML('beforeend',`<button class="choose-character" type="button">Choose ${name}</button>`);el.querySelector('.choose-character').onclick=()=>setProfile('character',name);});
query('#reset-profile').onclick=()=>{profile={};syncProfile();loadRecommendation();};
query('#try-again').onclick=()=>{query('#revise-profile').open=true;query('#revise-profile').scrollIntoView({block:'nearest'});query('#profile-editor select').focus();};
query('#comfort-size').onchange=event=>document.documentElement.style.setProperty('--lab-font-scale',event.target.value);
query('#quiet-motion').onchange=event=>document.body.classList.toggle('quiet-motion',event.target.checked);
query('#comfort-reset').addEventListener('click',()=>{query('#comfort-size').value='1';document.documentElement.style.setProperty('--lab-font-scale','1');query('#quiet-motion').checked=false;document.body.classList.remove('quiet-motion');});
syncProfile();

// Explicit JavaScript fallback; Python is reported only after a successful API response.
const weights={mood:18,stress:10,character:18,quote:18,nostalgia:10,familiarity:8,predictability:8,experience:10};
function fallbackScore(e,p){
 const factors=[];
 function add(key,ratio,reason){if(p[key]!==undefined)factors.push({factor:key,points:Math.round(weights[key]*ratio*10000)/10000,maximum:weights[key],reason});}
 add('mood',Number(e.mood_tags.includes(p.mood)),`Mood tag: ${p.mood}${e.mood_tags.includes(p.mood)?' matches.':' does not match.'}`);
 const t=(p.stress??5)/10;add('stress',(t*e.warmth+(1-t)*e.comedy)/5,'Editorial warmth/comedy blend weighted by your self-reported stress; no predicted health effect.');
 add('character',Number(e.characters.includes(p.character)),`Featured character match: ${p.character}.`);
 add('quote',Number(e.quotes.includes(p.quote)),`Exact selected quote association: ${p.quote}.`);
 add('nostalgia',1-Math.abs(e.nostalgia-({low:1,medium:3,high:5}[p.nostalgia]??3))/4,'Closeness to your nostalgia preference (editorial 1–5 rating).');
 add('familiarity',p.familiarity==='new'?Number(e.beginner_friendly):p.familiarity==='rewatcher'?e.nostalgia/5:.75,'New viewers favor standalone stories; rewatchers favor editorial nostalgia; some familiarity receives 0.75 credit.');
 add('predictability',Number(e.story_tags.includes(p.predictability)),`Story preference: ${p.predictability}.`);
 add('experience',({laughter:e.comedy,warmth:e.warmth,friendship:e.warmth,nostalgia:e.nostalgia,'lighthearted entertainment':e.comedy}[p.experience]??0)/5,`Desired experience: ${p.experience} matched to editorial rating.`);
 const points=factors.reduce((a,f)=>a+f.points,0),maximum=factors.reduce((a,f)=>a+f.maximum,0);
 return {episode:e,factors,points,maximum,score:maximum?Math.round(10000*points/maximum)/100:0,explanation:factors.filter(f=>f.points>0).map(f=>f.reason).join('; ')||'No matching preferences yet. Browse this real episode or add choices.'};
}
function fallbackRecommend(){return {engine:'JavaScript fallback — Python unavailable',recommendations:episodes.map(e=>fallbackScore(e,profile)).sort((a,b)=>b.score-a.score||a.episode.season-b.episode.season||a.episode.episode-b.episode.episode).slice(0,3)};}
async function api(path,payload){if(location.protocol==='file:')throw Error('Static mode');const response=await fetch('/api/'+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(15000)});if(!response.ok)throw Error('Python unavailable');return response.json();}
let recommendationGeneration=0,lastResult;
async function loadRecommendation(){const generation=++recommendationGeneration;query('#recommendation-status').textContent='Asking the local Python engine…';let result;try{result=await api('recommend',profile);}catch{result=fallbackRecommend();}if(generation!==recommendationGeneration)return;lastResult=result;renderResult(result);}
function breakdown(r){return `<p>Algorithmic match: ${r.score.toFixed(2)}%. ${r.points} earned / ${r.maximum} available points. Only answered factors count. No answers = 0%, ties use season then episode.</p>${r.factors.map(f=>`<div class="factor"><div>${escape(f.factor)} <b>${f.points} / ${f.maximum}</b></div><div class="bar-track"><i style="width:${100*f.points/f.maximum}%"></i></div><p>${escape(f.reason)}</p></div>`).join('')}`;}
function renderResult(result,surprise=false){
 query('#recommendation-status').textContent=`${result.engine} · ${surprise?'Random discovery · ':''}${Object.keys(profile).length}/8 answered · ${episodes.length} real episodes`;
 query('#recommendation-results').innerHTML=result.recommendations.map((r,i)=>`<article class="episode-result ${i===0?'top-pick':''}"><span class="eyebrow">${i===0?(surprise?'SURPRISE PICK':'YOUR TOP PICK'):'ALTERNATIVE '+i} · SEASON ${r.episode.season}, EPISODE ${r.episode.episode}</span><h3>${escape(r.episode.title)}</h3><p>${escape(r.episode.description)}</p><p><strong>${r.score.toFixed(2)}% algorithmic match</strong></p><p>${escape(r.explanation)}</p><details><summary>Matching factors</summary>${breakdown(r)}</details><a href="${r.episode.source}" target="_blank" rel="noopener">Episode source</a></article>`).join('');
 query('#score-details').innerHTML=`<h3>Actual scoring factors for ${escape(result.recommendations[0].episode.title)}</h3>${breakdown(result.recommendations[0])}`;
 query('#score-details').hidden=true;query('#why-episode').setAttribute('aria-expanded','false');
}
query('#why-episode').setAttribute('aria-controls','score-details');
query('#why-episode').onclick=()=>{const el=query('#score-details');el.hidden=!el.hidden;query('#why-episode').setAttribute('aria-expanded',String(!el.hidden));if(!el.hidden)el.scrollIntoView({block:'nearest'});};
query('#surprise-me').onclick=async()=>{const generation=++recommendationGeneration;const pool=episodes.filter(e=>e.id!==lastResult?.recommendations[0].episode.id);const pick=pool[Math.floor(Math.random()*pool.length)];let result;try{result=await api('recommend',profile);}catch{result=fallbackRecommend();}if(generation!==recommendationGeneration)return;const item=fallbackScore(pick,profile);lastResult={...result,recommendations:[item,...result.recommendations.filter(r=>r.episode.id!==pick.id).slice(0,2)]};renderResult(lastResult,true);query('#recommendation-status').textContent='JavaScript random discovery; displayed scores use the documented matching formula · '+episodes.length+' real episodes';};
document.addEventListener('friends:slidechange',event=>{if(event.detail.index===11)loadRecommendation();});
if(current===11)loadRecommendation();

let simulationGeneration=0;
async function drawComfort(){const generation=++simulationGeneration,p={};queryAll('[data-simulator]').forEach(el=>{p[el.dataset.simulator]=Number(el.value);query(`[data-sim-output="${el.dataset.simulator}"]`).textContent=el.value;});let result;try{result=await api('simulate',p);}catch{const minutes=Array.from({length:5},(_,i)=>p.duration*i/4);result={engine:'JavaScript illustrative fallback',minutes,values:minutes.map(t=>Math.round(Math.min(100,50-p.stress*3+(p.familiarity+p.nostalgia)*2*(1-Math.exp(-t/20)))*10)/10)};}if(generation!==simulationGeneration)return;
 query('#comfort-index-chart').innerHTML=`<svg viewBox="0 0 520 260" role="img" aria-label="Invented comfort index: ${result.values.join(', ')}"><title>Illustrative comfort index, arbitrary units</title><path d="M45 20V220H495" fill="none" stroke="currentColor"/><polyline points="${result.values.map((v,i)=>`${45+i*110},${220-v*1.8}`).join(' ')}" fill="none" stroke="var(--purple)" stroke-width="4"/>${result.values.map((v,i)=>`<circle cx="${45+i*110}" cy="${220-v*1.8}" r="5"/><text x="${45+i*110}" y="${208-v*1.8}" text-anchor="middle">${v}</text><text x="${45+i*110}" y="240" text-anchor="middle">${result.minutes[i]}</text>`).join('')}</svg><p>Horizontal: imagined viewing minutes. Vertical: invented comfort index (0–100 arbitrary units). Values: ${result.values.join(', ')}.</p>`;
 query('#simulation-engine').textContent=result.engine+' · Invented formula, not fitted to either paper.';
}
let simTimer;queryAll('[data-simulator]').forEach(el=>el.addEventListener('input',()=>{clearTimeout(simTimer);simTimer=setTimeout(drawComfort,120);}));drawComfort();

const papers={A:{label:'Paper A · Derrick, Gabriel, & Hugenberg (2009)',url:'https://doi.org/10.1016/j.jesp.2008.12.003'},B:{label:'Paper B · Derrick (2013; online 2012)',url:'https://doi.org/10.1177/1948550612454889'}};
const figures=[
 ['A',2,1,'2009-fig1-belongingness-essay.png','Essay time','Y: seconds writing. X: control versus aroused belongingness needs. Bars: favorite versus control TV. Aroused needs followed recalling a fight; control listed possessions. Significant interaction (p < .01): longer favorite-TV essays after threat.'],
 ['A',3,2,'2009-fig2-self-esteem.png','Self-esteem','Y: standardized state self-esteem composite. Same conditions as Figure 1. Significant interaction (p = .04); the threat contrast within favorite TV was non-significant (p = .42).'],
 ['A',3,3,'2009-fig3-negative-mood.png','Negative mood','Y: negative mood ratings. Same conditions. Significant interaction (p = .03); favorite-versus-control TV under threat was marginal (p = .09).'],
 ['A',3,4,'2009-fig4-rejection.png','Rejection','Y: standardized rejection composite. Same conditions. Interaction marginal (p = .09), not significant at .05. Treat the pattern cautiously.'],
 ['B',1,1,'self-control-fig1-rat.png','Puzzle performance','X: neutral room listing versus favorite-TV essay. Bars: free versus regulated writing (avoiding specified letters). Y: correct Remote Associates Test items. Significant interaction (p < .05); the regulated/free difference was non-significant after the TV essay.'],
 ['B',1,2,'self-control-fig2-negative-mood.png','Negative mood','Same experimental conditions as Paper B Figure 1. Y: negative mood. Significant interaction (p = .04); the regulated/free difference was non-significant after the TV essay. Error bars in Paper B figures represent standard errors.'],
 ['B',2,3,'self-control-fig3-daily-mood.png','Daily diary','X: familiar fictional world use on Day 2 (yes/no). Bars: effortful self-control on Day 1. Y: negative mood on Day 3. Significant interaction; the Day 1 association was significant without familiar-world use (p = .012), non-significant with use (p = .261). Observational diary evidence, not a randomized viewing effect.']
];
const dialog=document.createElement('dialog');dialog.id='research-explorer';dialog.setAttribute('aria-labelledby','explorer-title');dialog.innerHTML=`<div class="explorer-head"><h2 id="explorer-title">Research Evidence Explorer</h2><button id="close-evidence" autofocus>Close</button></div><label>Choose an original figure<select id="figure-selector">${figures.map((f,i)=>`<option value="${i}">Paper ${f[0]} · Study ${f[1]} · Figure ${f[2]} — ${f[4]}</option>`).join('')}</select></label><div id="figure-thumbnails">${figures.map((f,i)=>`<button data-figure="${i}" aria-label="Paper ${f[0]}, Study ${f[1]}, Figure ${f[2]}"><img src="assets/research/${f[3]}" alt="Thumbnail: ${f[4]}"><span>${f[0]}${f[2]}</span></button>`).join('')}</div><figure><img id="evidence-image" alt=""><figcaption id="evidence-caption"></figcaption></figure><p id="figure-explanation"></p><button id="enlarge-figure" aria-pressed="false">Enlarge figure</button><p id="figure-citation"></p><p class="small">Original figure pixels preserved. No exact values inferred from heights. These are not experiments on Friends viewers. A non-significant result does not establish no effect. Supplementary mechanism analyses in Paper B are exploratory, rather than direct tests of Friends comfort.</p>`;document.body.append(dialog);
let opener;
function showFigure(i){const f=figures[i],paper=papers[f[0]];query('#figure-selector').value=String(i);query('#evidence-image').src='assets/research/'+f[3];query('#evidence-image').alt=`${paper.label}, Study ${f[1]}, Figure ${f[2]}: ${f[4]}. ${f[5]}`;query('#evidence-caption').textContent=`Paper ${f[0]} · Study ${f[1]} · Figure ${f[2]} — ${f[4]}`;query('#figure-explanation').textContent=f[5];query('#figure-citation').innerHTML=`<a href="${paper.url}" target="_blank" rel="noopener">${paper.label} · Original paper</a>`;queryAll('[data-figure]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.figure)===i)));}
query('#figure-selector').onchange=event=>showFigure(Number(event.target.value));
queryAll('[data-figure]').forEach(b=>b.onclick=()=>showFigure(Number(b.dataset.figure)));
query('#close-evidence').onclick=()=>dialog.close();dialog.addEventListener('close',()=>opener?.focus());
dialog.addEventListener('keydown',event=>event.stopPropagation());
query('#enlarge-figure').onclick=()=>{dialog.classList.toggle('enlarged');query('#enlarge-figure').setAttribute('aria-pressed',String(dialog.classList.contains('enlarged')));};
for(const [n,i] of [[3,0],[4,4],[6,1],[7,4],[8,6],[12,0]]){panel(n,`<button class="evidence-open" data-start-figure="${i}">Explore original research · 7 figures</button>`);}
queryAll('.evidence-open').forEach(b=>b.onclick=()=>{opener=b;showFigure(Number(b.dataset.startFigure));dialog.showModal();});
panel(3,artwork('central-perk','User-created Central Perk artwork accompanying research exploration'));
showFigure(0);
window.FriendsLab={get profile(){return {...profile};},fallbackScore,fallbackRecommend,loadRecommendation,drawComfort,episodes,figures};
})();
