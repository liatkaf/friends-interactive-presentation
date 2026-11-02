"use strict";
// Python exports reported statistical categories. This chart never estimates group means.
(() => {
 const figures=FRIENDS_V05.research.figures;
 const statusLabel={significant:'Significant',marginal:'Marginal',nonsignificant:'Not significant'};
 function evidence(stage,id){
  const figure=figures[id],data=figure.evidence;
  stage.dataset.measure=String(id);
  stage.querySelectorAll('[data-inline-figure]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.inlineFigure)===id)));
  stage.querySelector('.evidence-map').innerHTML=`<div class="evidence-heading"><div><span class="overline">PAPER ${figure.paper} / STUDY ${figure.study} / FIGURE ${figure.figure}</span><h3>${esc(data.outcome)}</h3></div><span class="qualitative-badge">Qualitative evidence map</span></div><p class="evidence-unit">Original outcome: ${esc(data.original_unit)}. No group means estimated.</p><div class="evidence-axis"><span>Reported comparison</span>${data.categories.map(k=>`<span>${statusLabel[k]}</span>`).join('')}</div><div class="evidence-rows">${data.contrasts.map((row,i)=>`<button class="evidence-row" data-contrast="${i}" aria-label="${esc(row.comparison)}: ${statusLabel[row.status]}, ${esc(row.reported_p)}"><span>${esc(row.comparison)}<small>${esc(row.reported_p)}</small></span><span class="evidence-lane"><i class="evidence-dot ${row.status}" style="--column:${row.display_column}"><b>${row.status==='nonsignificant'?'&#9675;':'&#9679;'}</b></i></span></button>`).join('')}</div><output class="evidence-tip" role="status">${esc(figure.takeaway)}</output><p class="qualitative-note">Categories show reported tests, not effect magnitude. Non-significance does not prove equivalence.${id===6?' Diary associations are observational.':''}</p>`;
  const source=stage.querySelector('.inline-citation');source.href=FRIENDS_V05.research.papers[figure.paper].url;source.textContent=figure.paper==='A'?'Derrick et al. (2009)':'Derrick (2013)';
  stage.querySelector('[data-enlarge]').dataset.enlarge=String(id);
  stage.querySelector('.evidence-table>div').innerHTML=`<p>${esc(figure.explanation)} ${esc(data.source_locator)}.</p><table><caption>${esc(data.outcome)} — reported tests, not estimated measurements</caption><thead><tr><th scope="col">Comparison</th><th scope="col">Reported result</th><th scope="col">Published p</th></tr></thead><tbody>${data.contrasts.map(row=>`<tr><th scope="row">${esc(row.comparison)}</th><td>${statusLabel[row.status]}</td><td>${esc(row.reported_p)}</td></tr>`).join('')}</tbody></table><p>${esc(data.display_note)} <a href="${esc(data.verification_url)}" target="_blank" rel="noopener">Read the paper</a>.</p>`;
 }
 document.querySelectorAll('.qualitative-explorer').forEach(stage=>{
  evidence(stage,Number(stage.dataset.evidenceGroup.split(',')[0]));
  stage.querySelectorAll('[data-inline-figure]').forEach(button=>button.onclick=()=>evidence(stage,Number(button.dataset.inlineFigure)));
  function tip(event){const row=event.target.closest('[data-contrast]');if(!row)return;const figure=figures[Number(stage.dataset.measure)],contrast=figure.evidence.contrasts[Number(row.dataset.contrast)];stage.querySelector('.evidence-tip').textContent=`${contrast.comparison}: ${statusLabel[contrast.status]} (${contrast.reported_p}). ${figure.takeaway}`;}
  ['focusin','pointerover','click'].forEach(name=>stage.querySelector('.evidence-map').addEventListener(name,tip));
 });

 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const quiet=()=>reduced.matches||document.body.classList.contains('quiet-motion');
 let rewindTimer=0,lobsterTimers=[];
 const rewind=$('#rewind-stage'),concepts=$('#rewind-concepts'),story=$('#lobster-story');
 function completeRewind(){clearTimeout(rewindTimer);rewindTimer=0;rewind.dataset.state='ready';concepts.hidden=false;$('#rewind').setAttribute('aria-busy','false');}
 function cancelRewind(){clearTimeout(rewindTimer);rewindTimer=0;if(rewind.dataset.state==='rewinding'){rewind.dataset.state='off';$('#rewind').setAttribute('aria-busy','false');}}
 $('#rewind').onclick=()=>{cancelRewind();concepts.hidden=true;rewind.dataset.state='rewinding';$('#rewind').setAttribute('aria-busy','true');if(quiet())completeRewind();else rewindTimer=setTimeout(completeRewind,1200);};
 function stopLobsters(){lobsterTimers.forEach(clearTimeout);lobsterTimers=[];}
 function startLobsters(){stopLobsters();story.dataset.step='0';if(quiet()){story.dataset.step='3';return;}[1,2,3].forEach((step,i)=>lobsterTimers.push(setTimeout(()=>{story.dataset.step=String(step);},200+i*700)));}
 document.addEventListener('friends:slidechange',event=>{if(event.detail.index!==8)cancelRewind();if(event.detail.index===9)startLobsters();else stopLobsters();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelRewind();stopLobsters();}else if(current===9)startLobsters();});
 function motion(){if(quiet()){if(rewind.dataset.state==='rewinding')completeRewind();stopLobsters();if(current===9)story.dataset.step='3';}}
 reduced.addEventListener('change',motion);let wasQuiet=quiet();new MutationObserver(()=>{if(quiet()!==wasQuiet){wasQuiet=quiet();motion();}}).observe(document.body,{attributes:true,attributeFilter:['class']});
 if(current===9)startLobsters();
})();
