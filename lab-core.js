"use strict";
// Shared v0.5 scoring rules and verified figure metadata, retained for v0.6.
window.LabCore = (()=>{
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
return {weights, fallbackScore, papers, figures};
})();
