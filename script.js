"use strict";

// Version 0.3: local Three.js mug; data, editing, and quizzes remain previews.
const placeholder = (text) => `<div class="placeholder"><span>COMING NEXT</span>${text}</div>`;
const mug = `<div class="mug-scene" aria-label="Original illustration of a coffee mug"><div class="steam">~ ~ ~</div><div class="mug"><span>CENTRAL<br><b>PERK</b></span></div><div class="saucer"></div><span class="coffee-note">Good coffee. Better company.</span></div>`;
const card = (tag, title, text) => `<article class="card"><span class="eyebrow">${tag}</span><h3>${title}</h3><p>${text}</p></article>`;
const slides = [
  {title: "Welcome to Friends", label: "THE ONE WITH THE INTERACTIVE PRESENTATION", body: `<div class="hero-grid"><div><div class="eyebrow">SIX FRIENDS. ONE CITY. ENDLESS STORIES.</div><h1>I'll be there<br>for <em>you.</em></h1><p class="lead">Pull up a seat. A little nostalgia, a lot of coffee,<br class="desktop-break"> and a whole world of friendship await.</p><button class="primary" data-go="1">Let's get started <span>↗</span></button><p class="small">A love letter to the world of <i>Friends</i> · Est. 1994</p></div><div class="hero-art">${mug}<div class="stamp">THE ONE<br>WHERE WE<br><b>BEGIN</b></div>${placeholder("3D coffee mug · Three.js")}</div></div>`},
  {title: "The One Where It All Began", label: "01 / A LITTLE BACKSTORY", body: `<h2>A new city.<br>A familiar <em>feeling.</em></h2><p class="lead">Six young adults navigate work, love, and growing up in New York City—with each other as their chosen family.</p><div class="timeline">${card("1994", "The first hello", "A runaway bride walks into a coffee shop. A new chapter begins.")}${card("THE YEARS BETWEEN", "Growing up together", "New jobs, unexpected romances, and the comfort of a familiar couch.")}${card("2004", "The last goodbye", "The apartment empties, but the friendships carry on.")}</div>${placeholder("Clickable series timeline")}`},
  {title: "Meet the Six Friends", label: "02 / YOUR NEW FAVORITE PEOPLE", body: `<h2>A perfectly imperfect <em>six.</em></h2><div class="characters">${[["M","Monica","The host","Competitive, caring, and always ready with a plan."],["R","Rachel","The dreamer","Finding her independence, one brave decision at a time."],["P","Phoebe","The original","A free spirit with an unexpected song for every occasion."],["J","Joey","The heart","An aspiring actor with a big appetite and an even bigger heart."],["C","Chandler","The wit","A quick joke, a loyal friend, and a softer side."],["R","Ross","The romantic","A paleontologist trying to make sense of love and life."]].map(([initial,name,role,text],i)=>`<article class="character"><span class="avatar a${i}">${initial}</span><div><span class="eyebrow">${role}</span><h3>${name}</h3><p>${text}</p></div></article>`).join("")}</div>${placeholder("Flip cards + live description editing and reset")}`},
  {title: "Welcome to Central Perk", label: "03 / THE USUAL SPOT", body: `<div class="split"><div><h2>Your seat<br>is <em>saved.</em></h2><p class="lead">More than a coffee shop. A meeting place for big news, tiny dramas, and afternoons that turn into evenings.</p><div class="pills"><span>Fresh coffee</span><span>Familiar faces</span><span>One iconic couch</span></div></div><div class="cafe-art"><div class="cafe-sign">CENTRAL <b>PERK</b><small>COFFEE & CONVERSATION</small></div><div class="sofa"><i></i><i></i><i></i></div><div class="rug"></div></div></div>${placeholder("Clickable café objects + information panels")}`},
  {title: "Monica's Apartment", label: "04 / THE DOOR IS ALWAYS OPEN", body: `<div class="split"><div class="door-art" aria-label="Original illustration of a purple apartment door"><div class="door-number">20</div><div class="yellow-frame"><span>•</span></div><div class="door-panel"></div><div class="doorknob"></div></div><div><h2>Home is where<br>your <em>friends are.</em></h2><p class="lead">The purple walls. The kitchen table. The door everyone walks through. Monica's apartment is the heart of the group.</p><blockquote>A place for shared meals,<br>big talks, and starting over.</blockquote>${placeholder("Animated apartment door")}</div></div>`},
  {title: "The Relationships", label: "05 / IT'S ALL CONNECTED", body: `<h2>Life gets complicated.<br><em>Friendship stays.</em></h2><div class="cards three">${card("FAMILY", "Monica & Ross", "Siblings with a shared history, a competitive streak, and a lifelong bond.")}${card("ROOMMATES", "Joey & Chandler", "An apartment, two recliners, and a friendship built on showing up.")}${card("CHOSEN FAMILY", "All six, together", "Romance may change the story. The group keeps everyone connected.")}</div>${placeholder("Interactive character relationship map")}`},
  {title: "Iconic Moments", label: "06 / THE ONES WE REMEMBER", body: `<h2>Some moments<br>just <em>stay with you.</em></h2><div class="cards three moments">${card("01 / THE STAIRCASE", "A sofa. A tight corner.", "A simple furniture delivery becomes an unforgettable lesson in teamwork—and patience.")}${card("02 / THE COMPETITION", "The apartment wager", "A friendly trivia game raises the stakes when the apartments themselves are on the line.")}${card("03 / THE HOLIDAYS", "An unusual visitor", "A creative costume turns a family holiday lesson into a wonderfully awkward memory.")}</div>${placeholder("Animated moments gallery · original scene descriptions")}`},
  {title: "Who Said That?", label: "07 / PUT YOUR MEMORY TO THE TEST", body: `<div class="split"><div><h2>Know the voice.<br>Name the <em>friend.</em></h2><p class="lead">A future quote quiz for the fans who know every familiar voice.</p>${placeholder("Quote quiz + scoring + answer feedback")}</div><div class="quiz-preview"><span class="eyebrow">QUIZ PREVIEW · NOT ACTIVE YET</span><h3>Who is the group's<br>resident paleontologist?</h3><div class="answer-grid">${["Ross","Joey","Chandler","Phoebe"].map(x=>`<div class="answer">${x}</div>`).join("")}</div><p class="small">Sample layout only. Answers will be enabled in a future version.</p></div></div>`},
  {title: "Which Friend Are You?", label: "08 / FIND YOUR FRIENDS ENERGY", body: `<h2>A little Monica?<br>A little <em>Phoebe?</em></h2><p class="lead">Your ideal weekend might say more than you think.</p><div class="cards three">${card("A", "Host everyone", "A carefully planned dinner, a full table, and your favorite people.")}${card("B", "Follow a feeling", "Something creative, something spontaneous, something entirely you.")}${card("C", "Keep it cozy", "Good food, a comfortable seat, and a friend who gets your jokes.")}</div>${placeholder("Personality quiz · questions and result calculation")}`},
  {title: "Friends by the Numbers", label: "09 / A DIFFERENT KIND OF STORY", body: `<div class="split"><div><h2>Big friendships.<br>Little <em>data points.</em></h2><p class="lead">A future look at the series through data, transformed with Python and visualized in the browser.</p><p>Planned workflow: documented dataset → Python → JSON → chart.</p>${placeholder("Python-generated statistics + JavaScript charts")}</div><div class="chart-preview" aria-label="Chart placeholder with no real data"><span class="eyebrow">CHART SPACE RESERVED</span><div class="bars" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div><p>Illustrative shapes only—no statistics shown.</p></div></div>`},
  {title: "Behind the Scenes", label: "10 / BEYOND THE COFFEE SHOP", body: `<h2>A world made<br>to feel <em>familiar.</em></h2><div class="cards three">${card("THE SPACE", "Sets with personality", "The coffee shop and apartments give each gathering a recognizable home.")}${card("THE SOUND", "A shared rhythm", "Conversation, comic timing, and musical moments help shape the show's atmosphere.")}${card("THE ENSEMBLE", "Six perspectives", "Different personalities turn everyday situations into stories about belonging.")}</div>${placeholder("Reveal cards · sourced production facts to follow")}`},
  {title: "The Last One", label: "11 / UNTIL NEXT TIME", body: `<div class="ending"><span class="eyebrow">THE COFFEE MAY BE FINISHED. THE STORY ISN'T.</span><h2>The one with<br>all of <em>us.</em></h2><p class="lead">Twelve slides. Six friends. One reminder:<br>the best part is who you share it with.</p><button class="primary" data-go="0">Back to the beginning <span>↺</span></button><div class="colored-dots" aria-hidden="true">● ● ●</div>${placeholder("Closing animation")}</div>`}
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
slides[2].body = slides[2].body.replace(/<span class="avatar a(\d)">.*?<\/span>/g, (_,i) => `<div class="portrait portrait-${i}">${portrait(Number(i))}<span class="photo-number">0${Number(i)+1} / THE GANG</span></div>`);
slides[3].body = slides[3].body.replace('<div class="cafe-art">', '<div class="cafe-art" data-depth="7"><div class="cafe-window"></div><div class="pendant lamp-one"></div><div class="pendant lamp-two"></div><div class="cafe-menu">ON THE MENU<br><b>coffee<br>conversation<br>connection</b></div>').replace('<div class="rug"></div>', '<div class="rug"></div><div class="coffee-table"><span></span><span></span></div><div class="plant"><i></i><i></i><i></i></div><div class="cafe-caption">YOUR USUAL TABLE. YOUR FAVORITE PEOPLE.</div>');
slides[4].body = slides[4].body.replace('<div class="door-art"', '<div class="door-art apartment-door"');
slides[11].body = slides[11].body.replace('<div class="ending">','<div class="ending"><div class="closing-frame" aria-hidden="true"></div>');

const presentation = document.querySelector("#presentation");
presentation.innerHTML = slides.map((slide, i) => `<section class="slide ${i === 0 ? "active" : ""}" id="slide-${i+1}" aria-label="${i+1} of 12: ${slide.title}" ${i ? "hidden" : ""}><div class="slide-content"><div class="slide-label">${slide.label}</div>${slide.body}</div></section>`).join("");
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
  document.title = `${index+1} / 12 · ${slides[index].title} | Friends`;
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
function readHash(){const match=location.hash.match(/^#slide-(\d+)$/);goTo(match ? Math.min(11,Math.max(0,Number(match[1])-1)) : 0,false);}
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
