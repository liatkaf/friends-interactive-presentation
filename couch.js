import THREE from './vendor/three.module.js';
// Shared original couch geometry for the free-rotation viewer and stairwell challenge.
function createOrangeCouch(){
 const couch=new THREE.Group(),orange=new THREE.MeshStandardMaterial({color:0xd98748,roughness:.85}),wood=new THREE.MeshStandardMaterial({color:0x49301e});
 function box(w,h,d,x,y,z,material=orange){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);couch.add(mesh);}
 box(3.8,.45,1.5,0,.5,0);box(3.6,1.1,.3,0,1.2,-.65);[-1.85,1.85].forEach(x=>box(.38,.85,1.6,x,.95,0));[-1.15,0,1.15].forEach(x=>{box(1.06,.23,1.2,x,.83,.08);box(1.04,.8,.24,x,1.28,-.43);});[-1.5,1.5].forEach(x=>[-.5,.5].forEach(z=>box(.15,.35,.15,x,.12,z,wood)));
 return {couch,orange,wood};
}
export function mountCouch(host){
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,1,.1,100);camera.position.set(0,3.2,8);camera.lookAt(0,.7,0);
 scene.add(new THREE.HemisphereLight(0xfff4de,0x49344f,3));const light=new THREE.DirectionalLight(0xffffff,4);light.position.set(3,6,4);scene.add(light);
 const {couch,orange,wood}=createOrangeCouch();scene.add(couch);
 const slider=document.querySelector('#couch-turn'),status=document.querySelector('#couch-status'),canvas=renderer.domElement;canvas.tabIndex=0;canvas.setAttribute('role','img');canvas.setAttribute('aria-label','Interactive 3D orange couch. Drag or use Left and Right to rotate; Home resets.');host.append(canvas);host.querySelector('.sofa').hidden=true;host.dataset.state='ready';
 function draw(){if(host.closest('.slide')?.hidden || (host.closest('dialog') && !host.closest('dialog').open))return;const r=host.getBoundingClientRect();if(!r.width)return;renderer.setSize(r.width,Math.max(240,r.height),false);camera.aspect=r.width/Math.max(240,r.height);camera.updateProjectionMatrix();renderer.render(scene,camera);}
 function update(){couch.rotation.y=Number(slider.value)*Math.PI/180;document.querySelector('#couch-angle').textContent=`${slider.value} degrees`;host.dataset.angle=slider.value;draw();}
 function reset(){slider.value=25;update();}slider.addEventListener('input',update);document.querySelector('#couch-reset').addEventListener('click',reset);
 let previous=null;canvas.style.touchAction='pan-y';canvas.addEventListener('pointerdown',e=>{previous=e.clientX;canvas.setPointerCapture(e.pointerId);});canvas.addEventListener('pointermove',e=>{if(previous===null)return;slider.value=Math.max(-180,Math.min(180,Number(slider.value)+(e.clientX-previous)*.6));previous=e.clientX;update();});['pointerup','pointercancel','lostpointercapture'].forEach(name=>canvas.addEventListener(name,()=>previous=null));
 canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home'].includes(e.key))return;e.preventDefault();e.stopPropagation();slider.value=e.key==='Home'?25:Math.max(-180,Math.min(180,Number(slider.value)+(e.key==='ArrowRight'?10:-10)));update();});
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();host.dataset.state='fallback';canvas.hidden=true;host.querySelector('.sofa').hidden=false;status.textContent='Graphics context lost. Use the slider to rotate the illustration.';slider.addEventListener('input',()=>host.querySelector('.sofa').style.transform=`perspective(600px) rotateY(${slider.value}deg)`);});
 const resize=new ResizeObserver(draw);resize.observe(host);document.addEventListener('friends:slidechange',draw);window.addEventListener('pagehide',()=>{resize.disconnect();renderer.dispose();scene.traverse(o=>{o.geometry?.dispose();});orange.dispose();wood.dispose();},{once:true});status.textContent='Ready. Drag, use the slider, or focus the couch and use arrow keys.';update();
}

// State-driven cutaway stairwell. Draw only during an active transition or resize.
export function mountStairwell(host,controller){
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.75));renderer.setClearColor(0x000000,0);
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 const canvas=renderer.domElement;canvas.setAttribute('role','img');canvas.setAttribute('aria-label','Orange couch on an L-shaped stairwell. Use MOVE UP, PIVOT and Reset Challenge to move it.');host.append(canvas);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(40,1,.1,80);
 camera.position.set(10,9.5,12);camera.lookAt(0,1.85,.2);
 scene.add(new THREE.HemisphereLight(0xfff2d4,0x50355f,3));
 const key=new THREE.DirectionalLight(0xffdfab,3.5);key.position.set(5,10,7);scene.add(key);
 const materials={step:new THREE.MeshStandardMaterial({color:0xc7aa80,roughness:.95}),wall:new THREE.MeshStandardMaterial({color:0x795a85,roughness:1}),trim:new THREE.MeshStandardMaterial({color:0xe3c77e,roughness:.7}),floor:new THREE.MeshStandardMaterial({color:0x40534c,roughness:1}),rail:new THREE.MeshStandardMaterial({color:0x443647,roughness:.65})};
 function block(w,h,d,x,y,z,material){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);scene.add(mesh);return mesh;}
 // First flight climbs away from the viewer; the second turns right at the landing.
 block(3.5,.25,2.3,-2.8,.1,3.65,materials.floor);
 for(let i=0;i<8;i++)block(3.3,(i+1)*.25,.65,-2.8,(i+1)*.125,2.75-i*.65,materials.step);
 block(3.3,2.05,2.6,-2.8,1.025,-2.6,materials.step);
 for(let i=0;i<7;i++)block(.65,2.05+(i+1)*.25,2.6,-.85+i*.65,(2.05+(i+1)*.25)/2,-2.6,materials.step);
 block(1.5,3.85,2.6,4.125,1.925,-2.6,materials.floor);
 // Cutaway back and left walls keep the couch visible while establishing the tight corner.
 block(.18,5.3,8.1,-4.6,2.45,.2,materials.wall);
 block(9.5,5.3,.18,-.1,2.45,-4.05,materials.wall);
 block(.22,.16,8.1,-4.48,.35,.2,materials.trim);
 block(9.5,.16,.22,-.1,4.9,-3.93,materials.trim);
 function rail(a,b){const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),delta=end.clone().sub(start);const mesh=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,delta.length(),6),materials.rail);mesh.position.copy(start.add(end).multiplyScalar(.5));mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());scene.add(mesh);}
 for(let i=0;i<8;i++){const z=2.75-i*.65,y=(i+1)*.25;rail([-1.12,y,z],[-1.12,y+.85,z]);}
 rail([-1.12,1.1,2.75],[-1.12,2.85,-1.8]);
 for(let i=0;i<6;i++){const x=-.5+i*.65,y=2.4+i*.25;rail([x,y,-1.2],[x,y+.85,-1.2]);}
 rail([-.5,3.25,-1.2],[2.75,4.5,-1.2]);
 const {couch,orange,wood}=createOrangeCouch();couch.scale.setScalar(.62);scene.add(couch);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let frame=0,animation=null,drawCount=0,destroyed=false;
 let target=PivotChallengeModel.pose(controller.state);
 const active=()=>!destroyed&&!host.closest('.slide').hidden&&!document.hidden;
 const quiet=()=>reduced.matches||document.body.classList.contains('quiet-motion');
 function snap(){couch.position.set(...target.position);couch.rotation.y=target.rotation;}
 function draw(){if(!active())return;const r=host.getBoundingClientRect();if(!r.width||!r.height)return;renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();renderer.render(scene,camera);drawCount++;}
 function tick(now){frame=0;if(!active()){animation=null;snap();return;}if(!animation){draw();return;}const t=Math.max(0,Math.min(1,(now-animation.started)/animation.duration)),ease=t*t*(3-2*t);couch.position.lerpVectors(animation.from,new THREE.Vector3(...target.position),ease);couch.rotation.y=animation.yaw+(target.rotation-animation.yaw)*ease;
  if(animation.failure)couch.position.x+=Math.sin(t*Math.PI*8)*(1-t)*.12;
  if(animation.success)couch.position.y+=Math.sin(t*Math.PI)*.22;
  draw();if(t<1)frame=requestAnimationFrame(tick);else{animation=null;snap();draw();}
 }
 function update(state,action){target=PivotChallengeModel.pose(state);cancelAnimationFrame(frame);frame=0;
  if(action==='reset'||quiet()||!active()){animation=null;snap();draw();return;}
  animation={from:couch.position.clone(),yaw:couch.rotation.y,started:performance.now(),duration:state.feedback.startsWith('STUCK')?420:850,failure:state.feedback.startsWith('STUCK'),success:state.stage===3};frame=requestAnimationFrame(tick);
 }
 function visibility(){if(!active()){cancelAnimationFrame(frame);frame=0;animation=null;snap();}else{snap();draw();}}
 function motionChange(){if(quiet()){cancelAnimationFrame(frame);frame=0;animation=null;snap();draw();}}
 const unsubscribe=controller.subscribe(update);const resize=new ResizeObserver(()=>{if(active())draw();});resize.observe(host);
 document.addEventListener('friends:slidechange',visibility);document.addEventListener('visibilitychange',visibility);reduced.addEventListener('change',motionChange);
 const motionObserver=new MutationObserver(motionChange);motionObserver.observe(document.body,{attributes:true,attributeFilter:['class']});
 canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();dispose();canvas.hidden=true;host.dataset.mode='fallback';host.querySelector('.stairwell-fallback').hidden=false;document.querySelector('#stairwell-mode').textContent='Illustrated stairwell · same game rules';});
 function dispose(){if(destroyed)return;destroyed=true;cancelAnimationFrame(frame);frame=0;animation=null;unsubscribe();resize.disconnect();motionObserver.disconnect();document.removeEventListener('friends:slidechange',visibility);document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',motionChange);renderer.dispose();scene.traverse(o=>o.geometry?.dispose());Object.values(materials).forEach(m=>m.dispose());orange.dispose();wood.dispose();}
 window.addEventListener('pagehide',event=>{if(!event.persisted)dispose();});
 host.dataset.mode='three';host.querySelector('.stairwell-fallback').hidden=true;document.querySelector('#stairwell-mode').textContent='Three.js · live stairwell';
 host.stairwell={get state(){return {position:couch.position.toArray(),rotation:couch.rotation.y,target,animating:!!animation,drawCount,active:active(),reducedMotion:quiet()};}};
 snap();draw();
 return host.stairwell;
}
