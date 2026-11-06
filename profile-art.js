"use strict";
// Original line illustrations for mood and cafe choices; portraits are separate generated bitmaps.
window.ProfileArt=(()=>{
 const svg=body=>`<svg viewBox="0 0 100 80" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;
 const cup=(x=24,y=29)=>`<path d="M${x} ${y}h36v20q-2 15-18 15t-18-15Z" fill="currentColor" fill-opacity=".12"/><path d="M${x+36} ${y+4}h6q13 10 0 18h-6M${x-4} ${y+38}h45"/>`;
 const steam='<g class="mood-response"><path d="M34 23q-7-7 0-14M48 23q-7-7 0-14"/></g>';
 const moods={
 stressed:svg(`${cup()}${steam}<path class="mood-response" d="m71 14-6 10 10 2-8 11M13 19l5 5m-6 11 6-1"/>`),
 sad:svg('<path d="M20 31q0-13 14-13 8-17 23-7 17-2 22 15 13 3 9 15H18q-10-5 2-10Z" fill="currentColor" fill-opacity=".1"/><g class="mood-response"><path d="m30 49-4 9m22-9-4 9m22-9-4 9"/></g><path d="M18 70h61"/>'),
 lonely:svg(`<path d="M22 66V13h55v53M49 14v28M24 42h51M22 69h57"/><circle class="mood-response" cx="63" cy="27" r="6" fill="currentColor" fill-opacity=".2"/><path d="M38 55h20v9q-10 12-20 0ZM58 57q12-1 6 8h-6" fill="currentColor" fill-opacity=".12"/>`),
 bored:svg('<circle cx="48" cy="37" r="25" fill="currentColor" fill-opacity=".1"/><g class="mood-response"><path d="M48 19v19l13 5"/></g><path d="M30 66h37M36 73h25M10 32h6m63 0h6"/>'),
 happy:svg(`<g class="mood-response"><circle cx="49" cy="25" r="13" fill="currentColor" fill-opacity=".16"/><path d="M49 3v4m0 36v4M27 25h-4m52 0h-4M33 9l-3-3m38 38-3-3m0-32 3-3M33 41l-3 3"/></g><path d="M24 62q24-22 49 0M16 69h64"/>`),
 overwhelmed:svg('<path d="M23 21h44v45H23Z" fill="currentColor" fill-opacity=".1"/><path d="M29 14h44v45M35 7h44v45M32 33h26m-26 9h26m-26 9h17"/><path class="mood-response" d="m11 20 3 7-7 2m76 32 4 7-7 3"/>')
 };
 function menu(key){
  if(key==='friendship')return svg('<path d="M12 29h25v20q-12 16-25 0ZM37 33q13 0 7 13h-7M56 29h25v20q-12 16-25 0ZM81 33q13 0 7 13h-7M10 64h79M29 14q-6-6 0-12m42 12q-6-6 0-12"/>');
  if(key==='nostalgia')return svg('<path d="m22 10 55 5-6 56-55-5Z" fill="currentColor" fill-opacity=".09"/><path d="m29 21 37 4-3 29-38-4Zm0 23 10-11 11 13 9-7M32 62l22 2"/><circle cx="55" cy="32" r="4"/>');
  if(key==='lighthearted entertainment')return svg('<path d="M16 55q8-30 27-34l8 10 7-10q24 6 30 34l-13 8-11-7-12 9-14-9-11 7Z" fill="currentColor" fill-opacity=".12"/><path d="m33 28 5 25m28-25-5 25M18 72h68"/>');
  return svg(`${cup()}${key==='warmth'?steam:'<path class="mood-response" d="M34 42q9 11 18 0M36 36h1m13 0h1M18 13l4 5m43-8-4 6"/>'}`);
 }
 return {mood:key=>moods[key],menu};
})();
