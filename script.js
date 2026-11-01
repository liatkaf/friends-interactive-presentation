"use strict";
const placeholder = text => `<div class="placeholder">${text}</div>`;
const mug = `<div class="mug-scene" aria-label="Original illustration of a coffee mug"><div class="steam">~ ~ ~</div><div class="mug"><span>CENTRAL<br><b>PERK</b></span></div><div class="saucer"></div><span class="coffee-note">Good coffee. Better company.</span></div>`;
const card = (tag, title, text) => `<article class="card"><span class="eyebrow">${tag}</span><h3>${title}</h3><p>${text}</p></article>`;
const slides = [
  {title: "Welcome to Central Perk", label: "THE ONE WITH THE INTERACTIVE PRESENTATION", body: `<div class="hero-grid"><div><div class="eyebrow">SIX FRIENDS. ONE CITY. ENDLESS STORIES.</div><h1>I'll be there<br>for <em>you.</em></h1><p class="lead">Pull up a seat. A little nostalgia, a lot of coffee,<br class="desktop-break"> and a whole world of friendship await.</p><button class="primary" data-go="1">Let's get started <span>↗</span></button><p class="small">A love letter to the world of <i>Friends</i> · Est. 1994</p></div><div class="hero-art">${mug}<div class="stamp">THE ONE<br>WHERE WE<br><b>BEGIN</b></div>${placeholder("3D coffee mug · Three.js")}</div></div>`}
];
// Original vector character studies: decorative illustrations, not cast photographs.
function portrait(i) {
  const hair = ["#241b21", "#845233", "#ddba69", "#2d2424", "#4e342d", "#291f20"][i];
  const shirt = ["#952e35", "#5c796a", "#9b6281", "#484966", "#b88342", "#83533e"][i];
  const longHair = i < 3;
  return `<svg viewBox="0 0 200 170" aria-hidden="true"><circle cx="100" cy="78" r="64" fill="#fff3d6" opacity=".17"/><path d="M33 178 Q30 121 78 120 H122 Q170 122 168 178" fill="${shirt}"/><path d="M85 110 V129 Q100 142 115 129 V110" fill="#ca906f"/>${longHair ? `<path d="M54 76 Q47 17 98 17 Q151 16 148 80 L158 139 L118 132 L78 136 L47 141Z" fill="${hair}"/>` : ""}<ellipse cx="100" cy="79" rx="34" ry="44" fill="#e4b28a"/><path d="M65 74 Q48 27 90 24 Q139 12 140 69 Q110 59 102 42 Q86 64 65 74" fill="${hair}"/><path d="M78 82h9m26 0h9" stroke="#402b29" stroke-width="3" stroke-linecap="round"/><path d="M93 105q8 6 15-1" fill="none" stroke="#9c5346" stroke-width="2"/>${i===2 ? '<circle cx="62" cy="99" r="6" fill="none" stroke="#f4c542" stroke-width="3"/><circle cx="138" cy="99" r="6" fill="none" stroke="#f4c542" stroke-width="3"/>' : ""}${i===4 ? '<path d="M80 134l20 28 20-28" fill="#eee0c4"/>' : ""}</svg>`;
}
const door = `<div class="door-art"><div class="door-number">20</div><div class="yellow-frame"><span>•</span></div><div class="door-panel"></div><div class="doorknob"></div><div class="mail-slot"></div></div>`;
slides[0].body = slides[0].body.replace(/<div class="hero-art">[\s\S]*$/, `<div class="entrance-scene" data-depth="12"><div class="arch-glow"></div><div class="doorway"><div class="door-light"></div>${door}</div><div class="welcome-mat">the one where you come in.</div><div class="scene-note">Come on in.<span>You're one of us.</span></div><div class="hero-coffee">${mug}</div><div class="stamp">THE ONE<br>WHERE WE<br><b>BEGIN</b></div></div></div>${placeholder("3D coffee mug · Three.js")}`);
const coffeeExperience = `<aside class="coffee-experience" aria-label="Interactive Central Perk coffee mug" data-state="loading"><div class="coffee-view" id="coffee-view"><div class="coffee-fallback">${mug}</div></div><div class="coffee-controls"><span class="coffee-kicker">FRESHLY BREWED / EXPLORE IN 3D</span><button id="replay-mug" type="button" disabled>Replay Animation <span aria-hidden="true">↻</span></button><p id="mug-status" role="status" aria-live="polite">Preparing your coffee…</p></div></aside>`;
slides[0].body = slides[0].body.replace('<div class="hero-coffee">' + mug + '</div>', coffeeExperience).replace(placeholder("3D coffee mug · Three.js"), "");

﻿const interaction = (title,body) => ({title,label:`${String(slides.length+1).padStart(2,'0')} / THE COMFORT OF FAMILIAR STORIES`,body:`<h2>${title}</h2>${body}`});
function chapter(title,body){slides.push(interaction(title,body));}
chapter('Modern Anxiety & Mental Overload',`<p class="lead">Notifications, decisions, unfinished tasks. Everyday overload can make another new story feel like one choice too many.</p><div class="activity"><label for="stress">Set an imagined overload level</label><input id="stress" type="range" min="0" max="100" value="50"><output id="stress-value" for="stress">50 / 100</output><meter id="stress-meter" min="0" max="100" value="50">50</meter><p id="stress-note" role="status">A crowded mental inbox.</p><p class="small">A reflection prompt, not an anxiety assessment. Nothing is recorded.</p></div>`);
chapter('Why Do We Rewatch Friends?',`<p class="lead">A familiar world can offer company without demanding a new introduction. Research on favorite fictional worlds suggests a possible restorative role; it does not establish a treatment for anxiety.</p><div class="activity"><h3>Imagined reasons to press play</h3><div id="comfort-chart"></div><p class="small">Python-generated illustrative weights, not survey findings. Select a bar to explore the idea.</p><p id="comfort-detail" role="status">Choose a reason above.</p></div>`);
chapter('The Science of Predictability',`<p class="lead">Mechanism 1: knowing what comes next may reduce uncertainty. This is a possible explanation for comfort viewing, not a proven Friends-specific biological effect.</p><div class="activity"><h3>A familiar story beat</h3><p>The friends face a small everyday problem. What comes next?</p><details><summary>Reveal the reassuring pattern</summary><p>A misunderstanding, a joke, a shared moment. Knowing the broad shape lets some viewers relax into the journey, even when the characters face surprises.</p></details><details><summary>Where the explanation stops</summary><p>Predictability is not comforting for everyone. Mood, personal associations, and the episode itself can change the experience.</p></details></div>`);
chapter('PIVOT! The 3D Experience',`<div class="split"><div><p class="lead">A couch, a corner, a very familiar challenge. Explore an original orange couch in Three.js.</p><p>Drag the couch or use Left/Right while its canvas is focused. The slider and reset also work without WebGL.</p><label for="couch-turn">Couch rotation</label><input id="couch-turn" type="range" min="-180" max="180" value="25"><output id="couch-angle">25 degrees</output><button id="couch-reset">Reset couch</button></div><div><div id="couch-view" aria-label="Orange couch viewer"><div class="sofa"><i></i><i></i><i></i></div></div><p id="couch-status" role="status">Preparing the couch...</p></div></div>`);
chapter('Friends Who Feel Like Family',`<p class="lead">Mechanism 2: parasocial relationships are one-sided emotional bonds with media figures or fictional characters. Familiar personalities can feel like company, although the relationship is not reciprocal.</p><div class="characters">${['Monica','Rachel','Phoebe','Joey','Chandler','Ross'].map((name,i)=>`<article class="character"><div class="portrait portrait-${i}">${portrait(i)}</div><h3>${name}</h3><details><summary>Why this friend feels familiar</summary><p>${['Her hosting rituals make gathering together feel dependable.','Her fresh starts can echo our own changes.','Her individuality offers a familiar note of surprise.','His loyalty brings warmth to everyday setbacks.','His humor gives awkward feelings a recognizable voice.','His earnestness makes imperfect decisions recognizable.'][i]}</p></details></article>`).join('')}</div><p>These are interpretive examples. Fictional company can complement real connections.</p>`);
chapter('Giving Your Brain a Break',`<p class="lead">Mechanism 3: low cognitive load. Knowing the characters and setting may mean fewer new details to track. Try comparing two reading tasks at your own pace.</p><div class="activity"><div class="pills"><button data-load="familiar" aria-pressed="true">Familiar scene</button><button data-load="new" aria-pressed="false">New scene</button></div><p id="load-scene">Monica meets Rachel at Central Perk. They save a seat for Joey.</p><details id="load-answer"><summary>Reveal the answer: who gets the saved seat?</summary><p id="load-result">Joey.</p></details><p class="small">An informal demonstration with no timing or score. Difficulty also depends on reading experience; it does not measure cognition.</p></div>`);
chapter('The Nostalgia Effect',`<p class="lead">Mechanism 4: nostalgia can connect a past moment with our present sense of self and belonging. Research links nostalgia and social connectedness; individual memories can also be bittersweet.</p><div class="activity"><div class="pills">${['1994','2004','Today'].map((x,i)=>`<button data-memory="${i}" aria-pressed="${i===0}">${x}</button>`).join('')}</div><h3 id="memory-year">1994: A first hello</h3><p id="memory-text">The series begins. For some viewers, its familiar spaces later become reminders of their own earlier lives.</p><label for="memory">What ordinary detail brings back a warm memory?</label><textarea id="memory" rows="2" placeholder="A place, a song, a shared evening..."></textarea><p class="small">Your optional note stays on this page and disappears on reload.</p></div>`);
chapter('Iconic Quotes & Emotional Triggers',`<p class="lead">A few words can cue a whole remembered scene. Select a card to reveal its association and change the visual mood.</p><div class="quote-grid">${[['PIVOT!','Ross','An everyday task becomes shared comic chaos.','orange'],['How you doin\'?', 'Joey','A recognizable greeting cues a familiar personality.','purple'],['Smelly Cat','Phoebe','An offbeat song title recalls her playful individuality.','gold']].map(([q,n,t,c])=>`<button class="quote-card" data-quote="${c}" aria-expanded="false"><strong>${q}</strong><span>${n}</span><span class="quote-explanation" hidden>${t}</span></button>`).join('')}</div><p class="small">Brief quotations from Friends. Associations vary by viewer.</p>`);
chapter('The Anxiety Simulator',`<p class="lead">Explore an invented scenario, not a prediction about your body or mental health.</p><div class="activity"><strong>NONCLINICAL SIMULATION — synthetic data, arbitrary units</strong><label for="sim-start">Imagined starting intensity</label><input id="sim-start" type="range" min="20" max="100" value="70"><output id="sim-value">70</output><label for="sim-mode">Illustrative scenario</label><select id="sim-mode"><option value="familiar">Familiar viewing</option><option value="new">New viewing</option><option value="pause">Quiet pause</option></select><div id="sim-chart"></div><p id="sim-summary" role="status"></p><p class="small">Python creates arbitrary story curves; JavaScript scales them to your chosen start. These are not stress or cortisol measurements, clinical evidence, forecasts, or treatment effects. Even the ranking of scenarios is invented.</p></div>`);
chapter('Customize Your Comfort Zone',`<p class="lead">Make this familiar space your own. Preferences apply across the deck for this visit.</p><div class="activity custom-controls"><label for="comfort-color">Accent palette</label><select id="comfort-color"><option value="classic">Classic purple</option><option value="orange">Coffee orange</option><option value="green">Cafe green</option></select><label for="comfort-font">Font</label><select id="comfort-font"><option value="classic">Classic serif</option><option value="sans">Clear sans serif</option></select><label for="comfort-mood">Visual mood</label><select id="comfort-mood"><option value="classic">Classic Friends</option><option value="quiet">Quiet cream</option><option value="night">Evening cafe</option></select><button id="comfort-reset">Reset comfort zone</button><p id="custom-status" role="status">Classic Friends settings.</p></div>`);
chapter("I'll Be There for You",`<p class="lead">Familiar stories may offer predictability, imagined company, a lighter reading load, and a bridge to meaningful memories.</p><p>Comfort is personal. These mechanisms are interpretations supported to varying degrees by broader research, not proof that Friends reduces anxiety. The activities are educational; the charts contain no participant or clinical data. Viewing does not replace reciprocal relationships or professional care.</p><div class="references"><h3>References & further reading</h3><ul><li><a href="https://www.buffalo.edu/news/ub-in-the-news/2012/09/13652.html" target="_blank" rel="noopener">University at Buffalo (2012): research on familiar TV reruns</a> — limited studies on restoration, not anxiety treatment.</li><li><a href="https://dictionary.apa.org/parasocial-relationship" target="_blank" rel="noopener">APA Dictionary: parasocial relationship</a> — definition and nonreciprocal nature.</li><li><a href="https://eprints.soton.ac.uk/383274/" target="_blank" rel="noopener">Sedikides et al. (2016): nostalgia and self-continuity</a> — social connectedness as a proposed pathway.</li></ul><p>Predictability and low-load activities illustrate hypotheses; they are not validated experiments. Unofficial educational project; original illustrations. Three.js MIT license is included in vendor/.</p></div><button class="primary" data-go="0">Back to Central Perk</button>`);


const presentation = document.querySelector("#presentation");
presentation.innerHTML = slides.map((slide, i) => `<section class="slide ${i === 0 ? "active" : ""}" id="slide-${i+1}" aria-label="${i+1} of ${slides.length}: ${slide.title}" ${i ? "hidden" : ""}><div class="slide-content"><div class="slide-label">${slide.label}</div>${slide.body}</div></section>`).join("");
const sections = [...document.querySelectorAll(".slide")];
const themeNames = ["door", "scrapbook", "polaroids", "coffeehouse", "apartment", "connections", "filmstrip", "trivia", "personality", "notebook", "backstage", "farewell"];
sections.forEach((section,i) => {
  section.classList.add(`theme-${themeNames[i]}`);
  section.insertAdjacentHTML("afterbegin", `<div class="chapter-watermark" aria-hidden="true">${String(i+1).padStart(2,"0")}</div><div class="ambient-orb" aria-hidden="true"></div>`);
  section.querySelectorAll(".card,.character").forEach((card,j)=>card.style.setProperty("--order",j));
});
const indicators = document.querySelector("#indicators");
indicators.innerHTML = slides.map((s,i)=>`<button class="dot" data-go="${i}" aria-label="Slide ${i+1}: ${s.title}" title="${s.title}"></button>`).join("");
let current = 0;
function goTo(index, updateHash = true) {
  if (!Number.isInteger(index) || index < 0 || index >= slides.length) return;
  const oldSlide = sections[current];
  presentation.style.setProperty("--travel", index < current ? "-1" : "1");
  const focusWasInSlide = oldSlide.contains(document.activeElement);
  sections.forEach((section,i)=>{section.hidden = i !== index;section.classList.toggle("active", i === index);});
  current = index;
  document.dispatchEvent(new CustomEvent("friends:slidechange", { detail: { index } }));
  document.body.dataset.scene = themeNames[index];
  document.querySelector("#current").textContent = String(index+1).padStart(2,"0");
  document.querySelector("#previous").disabled = index === 0;
  document.querySelector("#next").disabled = index === slides.length-1;
  [...indicators.children].forEach((dot,i)=>{if(i===index)dot.setAttribute("aria-current","step");else dot.removeAttribute("aria-current");});
  document.querySelector("#progress-fill").style.width = `${(index+1)/slides.length*100}%`;
  document.title = `${index+1} / ${slides.length} · ${slides[index].title} | Friends`;
  sections[index].scrollTop = 0;
  if (focusWasInSlide) presentation.focus({preventScroll:true});
  if(updateHash) history.replaceState(null,"",`#slide-${index+1}`);
}
document.addEventListener("click",event=>{const target=event.target.closest("[data-go]");if(target)goTo(Number(target.dataset.go));});
document.querySelector("#previous").addEventListener("click",()=>goTo(current-1));
document.querySelector("#next").addEventListener("click",()=>goTo(current+1));
document.addEventListener("keydown",event=>{
  if(event.altKey || event.ctrlKey || event.metaKey || event.target.closest?.("input,textarea,select,[contenteditable=true]"))return;
  const destinations={ArrowRight:current+1,ArrowLeft:current-1,Home:0,End:slides.length-1};
  if(event.key in destinations){event.preventDefault();goTo(destinations[event.key]);}
});
function readHash(){const match=location.hash.match(/^#slide-(\d+)$/);goTo(match ? Math.min(slides.length-1,Math.max(0,Number(match[1])-1)) : 0,false);}
window.addEventListener("hashchange",readHash);
readHash();

// Fine-pointer parallax is decorative and disabled for reduced-motion/touch users.
const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
let parallaxFrame = 0;
presentation.addEventListener("pointermove", event => {
  if (event.target.closest?.(".coffee-experience")) return;
  if (motionPreference.matches || !finePointer.matches) return;
  cancelAnimationFrame(parallaxFrame);
  parallaxFrame = requestAnimationFrame(() => {
    const bounds = presentation.getBoundingClientRect();
    const x = (event.clientX-bounds.left)/bounds.width-.5;
    const y = (event.clientY-bounds.top)/bounds.height-.5;
    sections[current].style.setProperty("--px", `${x*12}px`);
    sections[current].style.setProperty("--py", `${y*9}px`);
  });
});
function resetParallax() {
  cancelAnimationFrame(parallaxFrame);
  sections.forEach(section => {section.style.setProperty("--px","0px");section.style.setProperty("--py","0px");});
}
presentation.addEventListener("pointerleave",resetParallax);
motionPreference.addEventListener("change",resetParallax);

// Keep navigation independent: a missing module or WebGL never prevents slides loading.
const coffeeHost = document.querySelector(".coffee-experience");
if (location.protocol === "file:") {
  coffeeHost.dataset.state = "fallback";
  document.querySelector("#mug-status").textContent = "For interactive 3D, run node serve.cjs and open http://127.0.0.1:8000.";
} else {
  import("./mug.js").then(module => module.mountCoffeeMug(coffeeHost)).catch(error => {
    coffeeHost.dataset.state = "fallback";
    document.querySelector("#mug-status").textContent = "3D is unavailable in this browser. Enjoy the illustration and explore the slides.";
    console.warn("Coffee mug fallback:", error.message);
  });
}
const $ = selector => document.querySelector(selector);
const data = window.COMFORT_DATA;
$('#stress').addEventListener('input',event=>{const n=Number(event.target.value);$('#stress-value').textContent=`${n} / 100`;$('#stress-meter').value=n;$('#stress-note').textContent=n<34?'A little room to breathe.':n<67?'A crowded mental inbox.':'Many imaginary tabs open at once.';});
$('#comfort-chart').innerHTML=data.reasons.map((r,i)=>`<button class="data-bar" data-reason="${i}" aria-label="${r.label}: ${r.value} invented arbitrary units"><span>${r.label}</span><span class="bar-track"><i style="width:${r.value}%"></i></span><b>${r.value}</b></button>`).join('');
document.addEventListener('click',event=>{
 const reason=event.target.closest('[data-reason]');if(reason)$('#comfort-detail').textContent=data.reasons[Number(reason.dataset.reason)].detail;
 const load=event.target.closest('[data-load]');if(load){const familiar=load.dataset.load==='familiar';document.querySelectorAll('[data-load]').forEach(b=>b.setAttribute('aria-pressed',String(b===load)));$('#load-scene').textContent=familiar?'Monica meets Rachel at Central Perk. They save a seat for Joey.':'Nera meets Tav at the Luma station. Tav brings a parcel for Iven, while Nera saves a seat for Seli.';$('#load-result').textContent=familiar?'Joey.':'Seli.';$('#load-answer').open=false;}
 const memory=event.target.closest('[data-memory]');if(memory){const i=Number(memory.dataset.memory);document.querySelectorAll('[data-memory]').forEach(b=>b.setAttribute('aria-pressed',String(b===memory)));$('#memory-year').textContent=['1994: A first hello','2004: A last goodbye','Today: A new meaning'][i];$('#memory-text').textContent=['The series begins. For some viewers, its familiar spaces later become reminders of their own earlier lives.','The finale marks an ending. A shared viewing memory may carry feelings about people and places from that time.','A rewatch can connect an old story to a new stage of life. You can also find comfort in a show you discovered recently.'][i];}
 const quote=event.target.closest('[data-quote]');if(quote){const open=quote.getAttribute('aria-expanded')!=='true';quote.setAttribute('aria-expanded',String(open));quote.querySelector('.quote-explanation').hidden=!open;sections[8].dataset.quoteMood=open?quote.dataset.quote:'';}
});
function drawSimulation(){const start=Number($('#sim-start').value),mode=$('#sim-mode').value,values=data.curves[mode].map(x=>Math.round(x*start));$('#sim-value').textContent=start;const coords=values.map((v,i)=>`${60+i*100},${235-v*1.8}`).join(' ');$('#sim-chart').innerHTML=`<svg viewBox="0 0 520 300" role="img" aria-label="Synthetic intensity, arbitrary units, over imagined minutes. ${values.join(', ')}"><title>Nonclinical invented scenario</title><path d="M60 30V235H475" fill="none" stroke="currentColor"/><polyline points="${coords}" fill="none" stroke="var(--purple)" stroke-width="4"/>${values.map((v,i)=>`<circle cx="${60+i*100}" cy="${235-v*1.8}" r="5" fill="var(--purple)"/><text x="${60+i*100}" y="${220-v*1.8}" text-anchor="middle">${v}</text><text x="${60+i*100}" y="260" text-anchor="middle">${data.minutes[i]}</text>`).join('')}<text x="265" y="288" text-anchor="middle">Imagined minutes</text><text x="10" y="20">Synthetic intensity (arbitrary units)</text></svg><table><caption>Invented values, not measured outcomes</caption><tr><th scope="row">Imagined minute</th>${data.minutes.map(n=>`<th scope="col">${n}</th>`).join('')}</tr><tr><th scope="row">Arbitrary units</th>${values.map(n=>`<td>${n}</td>`).join('')}</tr></table>`;$('#sim-summary').textContent=`Invented scenario: ${values[0]} to ${values.at(-1)} arbitrary units. Not a personal prediction.`;}
$('#sim-start').addEventListener('input',drawSimulation);$('#sim-mode').addEventListener('change',drawSimulation);drawSimulation();
function customize(){const color=$('#comfort-color').value,font=$('#comfort-font').value,mood=$('#comfort-mood').value;document.body.dataset.comfortColor=color;document.body.dataset.comfortFont=font;document.body.dataset.comfortMood=mood;$('#custom-status').textContent=`Applied: ${color} palette, ${font} font, ${mood} mood.`;}
['#comfort-color','#comfort-font','#comfort-mood'].forEach(id=>$(id).addEventListener('change',customize));
$('#comfort-reset').addEventListener('click',()=>{['#comfort-color','#comfort-font','#comfort-mood'].forEach(id=>$(id).value='classic');sections[8].dataset.quoteMood='';document.querySelectorAll('[data-quote]').forEach(b=>{b.setAttribute('aria-expanded','false');b.querySelector('.quote-explanation').hidden=true;});customize();$('#custom-status').textContent='Classic Friends settings restored.';});
if(location.protocol==='file:'){$('#couch-status').textContent='Illustrated couch mode. Serve locally for Three.js.';mountCouchFallback();}else import('./couch.js').then(m=>m.mountCouch($('#couch-view'))).catch(()=>{$('#couch-status').textContent='3D unavailable. The illustrated couch still rotates with the controls.';mountCouchFallback();});
function mountCouchFallback(){const update=()=>{const n=Number($('#couch-turn').value);$('#couch-angle').textContent=`${n} degrees`;$('#couch-view .sofa').style.transform=`perspective(600px) rotateY(${n}deg)`;};$('#couch-turn').addEventListener('input',update);$('#couch-reset').addEventListener('click',()=>{$('#couch-turn').value=25;update();});update();}
