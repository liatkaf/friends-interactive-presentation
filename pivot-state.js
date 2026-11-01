"use strict";
// Pure game rules. This model never reads or writes questionnaire preferences.
(() => {
  const initial = () => ({stage:0,score:100,pivotCompleted:false,feedback:'Ready. Help Ross reach the top landing.'});
  function transition(state,action){
    if(action==='reset')return initial();
    if(action==='pivot'){
      if(state.stage!==2||state.pivotCompleted)return state;
      return {...state,score:Math.min(100,state.score+10),pivotCompleted:true,feedback:'PERFECT PIVOT!'};
    }
    if(action!=='move'||state.stage===3)return state;
    if(state.stage===2&&!state.pivotCompleted)return {...state,score:Math.max(0,state.score-25),feedback:'STUCK! PIVOT FIRST!'};
    const stage=state.stage+1;
    return {...state,stage,feedback:stage===2?'Tight corner ahead. PIVOT NEEDED!':stage===3?'Top landing — success! You moved the couch.':'Stairflight 1. Keep moving toward the corner.'};
  }
  const pose = state => {
    const positions=[[-2.8,.27,3.5],[-2.8,1.3,.15],[-2.8,2.1,-2.2],[3.8,3.9,-2.2]];
    return {position:[...positions[state.stage]],rotation:state.pivotCompleted?Math.PI/2:0};
  };
  const api={initial,transition,pose};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  else globalThis.PivotChallengeModel=api;
})();
