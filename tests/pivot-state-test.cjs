const assert=require('node:assert/strict');
const {initial,transition,pose}=require('../pivot-state.js');
let checks=0;
const check=(condition,label)=>{assert.ok(condition,label);checks++;};
let state=initial();
check(state.stage===0&&state.score===100&&!state.pivotCompleted,'initial state');
check(transition(state,'pivot')===state,'pivot disabled at bottom');
const bottom=pose(state);
state=transition(state,'move');check(state.stage===1,'first flight');
check(pose(state).position[1]>bottom.position[1],'moves upward');
check(transition(state,'pivot')===state,'pivot disabled on stairs');
state=transition(state,'move');check(state.stage===2&&!state.pivotCompleted,'corner');
const corner=pose(state);
for(let i=1;i<=6;i++){state=transition(state,'move');check(state.stage===2&&state.score===Math.max(0,100-25*i),'blocked penalty '+i);}
check(state.feedback==='STUCK! PIVOT FIRST!','failure feedback');
state=transition(state,'pivot');check(state.pivotCompleted&&state.score===10,'pivot reward from zero');
check(pose(state).rotation===Math.PI/2&&JSON.stringify(pose(state).position)===JSON.stringify(corner.position),'pivot changes rotation, not landing');
check(transition(state,'pivot')===state,'no repeated pivot farming');
state=transition(state,'move');check(state.stage===3&&state.feedback.includes('success'),'top landing success');
check(pose(state).position[0]>corner.position[0]&&pose(state).position[1]>corner.position[1],'top moves around corner and up');
check(transition(state,'move')===state,'no advance past top');
check(transition(state,'pivot')===state,'no pivot at top');
for(let i=0;i<5;i++){state=transition(state,'reset');check(JSON.stringify(state)===JSON.stringify(initial()),'repeat reset '+i);check(JSON.stringify(pose(state))===JSON.stringify(bottom),'reset pose '+i);}
state=transition(transition(initial(),'move'),'move');state=transition(state,'pivot');check(state.score===100,'reward capped at 100');
state=transition(transition(initial(),'move'),'move');state=transition(transition(state,'move'),'pivot');check(state.score===85,'25 penalty then 10 reward');
check(transition(state,'unknown')===state,'unknown action ignored');
console.log(JSON.stringify({passed:checks,suite:'Deterministic PIVOT game rules'}));
