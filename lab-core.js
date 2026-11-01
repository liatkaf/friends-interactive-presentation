"use strict";
// Shared deterministic fallback rules and Python-bundled research metadata.
window.LabCore = (()=>{
const weights={mood:18,stress:10,character:18,quote:18,nostalgia:10,familiarity:8,predictability:8,experience:10};
function fallbackScore(e,p){
 const factors=[];
 function add(key,ratio,reason){if(p[key]!==undefined)factors.push({factor:key,points:Math.round(weights[key]*ratio*10000)/10000,maximum:weights[key],reason});}
 add('mood',Number(e.mood_tags.includes(p.mood)),`Mood tag: ${p.mood}${e.mood_tags.includes(p.mood)?' matches.':' does not match.'}`);
 const t=(p.stress??5)/10;add('stress',(t*e.warmth+(1-t)*e.comedy)/5,'Editorial warmth/comedy blend weighted by your self-reported stress; no predicted health effect.');
 add('character',Number(e.characters.includes(p.character)),`Featured character match: ${p.character}.`);
 const quote=window.FRIENDS_V05.quotes.find(q=>q.id===p.quote);
 if(quote?.match_mode==='character')add('quote',e.characters.includes(quote.character)?0.5:0,`Editorial quote-to-character match: ${quote.label} \u2192 ${quote.character}. Half credit when featured; no exact scene claimed.`);
 else add('quote',Number(e.quotes.includes(p.quote)),`Exact selected quote association: ${p.quote}.`);
 add('nostalgia',1-Math.abs(e.nostalgia-({low:1,medium:3,high:5}[p.nostalgia]??3))/4,'Closeness to your nostalgia preference (editorial 1–5 rating).');
 add('familiarity',p.familiarity==='new'?Number(e.beginner_friendly):p.familiarity==='rewatcher'?e.nostalgia/5:.75,'New viewers favor standalone stories; rewatchers favor editorial nostalgia; some familiarity receives 0.75 credit.');
 add('predictability',Number(e.story_tags.includes(p.predictability)),`Story preference: ${p.predictability}.`);
 add('experience',({laughter:e.comedy,warmth:e.warmth,friendship:e.warmth,nostalgia:e.nostalgia,'lighthearted entertainment':e.comedy}[p.experience]??0)/5,`Desired experience: ${p.experience} matched to editorial rating.`);
 const points=factors.reduce((a,f)=>a+f.points,0),maximum=factors.reduce((a,f)=>a+f.maximum,0);
 return {episode:e,factors,points,maximum,score:maximum?Math.round(10000*points/maximum)/100:0,explanation:factors.filter(f=>f.points>0).map(f=>f.reason).join('; ')||'No matching preferences yet. Browse this real episode or add choices.'};
}
const papers=window.FRIENDS_V05.research.papers;
const figures=window.FRIENDS_V05.research.figures.map(f=>[f.paper,f.study,f.figure,f.file,f.title,f.explanation]);
return {weights, fallbackScore, papers, figures};
})();
