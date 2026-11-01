import THREE from './vendor/three.module.js';
import { REST_YAW, advanceYaw, approachSpeed } from './animation-timeline.mjs';

export async function mountCoffeeMug(host) {
  const view = host.querySelector('.coffee-view');
  const status = host.querySelector('#mug-status');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const slide = host.closest('.slide');
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }); }
  catch { throw new Error('WebGL 2 is unavailable'); }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  const canvas = renderer.domElement;
  canvas.tabIndex = 0;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Orange ceramic Central Perk mug with coffee and steam. Rotates slowly while visible. Drag to explore; automatic rotation resumes after release. With the mug focused, use Left and Right to turn, Up and Down to tilt, and Home to reset.');
  canvas.setAttribute('aria-describedby', 'mug-status');
  view.append(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, .1, 50);
  camera.position.set(3.5, 4.2, 7.7);
  camera.lookAt(.2, 1.6, 0);

  // A generated studio environment produces broad ceramic reflections, with no HDR download.
  const studio = new THREE.Scene();
  studio.background = new THREE.Color('#b9a5a0');
  const room = new THREE.Mesh(new THREE.BoxGeometry(16, 12, 16), new THREE.MeshBasicMaterial({ color: '#514452', side: THREE.BackSide }));
  studio.add(room);
  [[-4, 5, 4, 5, 6, '#fff1d6'], [5, 3, -2, 3, 7, '#dbc8ef'], [0, 5, -4, 5, 2, '#fff9ed']].forEach(([x,y,z,w,h,color]) => {
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(w,h), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }));
    panel.position.set(x,y,z); panel.lookAt(0,1,0); studio.add(panel);
  });
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(studio, .08);
  scene.environment = environment.texture;
  studio.traverse(object => { object.geometry?.dispose(); object.material?.dispose(); });
  pmrem.dispose();

  scene.add(new THREE.HemisphereLight('#fff0d3', '#553b65', 2));
  const key = new THREE.DirectionalLight('#fff0d4', 3.2);
  key.position.set(-3,7,5); key.castShadow = true;
  key.shadow.mapSize.set(512,512);
  Object.assign(key.shadow.camera, { left:-3.5, right:3.5, top:4, bottom:-3, near:.5, far:20 });
  key.shadow.bias = -.0005; key.shadow.normalBias = .025;
  scene.add(key);
  const fill = new THREE.DirectionalLight('#cbb6ee', 1.4); fill.position.set(4,2,-3); scene.add(fill);
  const rimLight = new THREE.DirectionalLight('#ffc47e', 1.5); rimLight.position.set(-2,4,-4); scene.add(rimLight);

  const mug = new THREE.Group();
  mug.rotation.y = REST_YAW;
  scene.add(mug);
  const ceramic = new THREE.MeshPhysicalMaterial({ color:'#d87831', roughness:.23, metalness:0, clearcoat:1, clearcoatRoughness:.14, envMapIntensity:.8 });
  const rimGlaze = ceramic.clone(); rimGlaze.color.set('#eca05a');
  const profile = [[0,.13],[.58,.13],[.72,.17],[.81,.28],[.88,.55],[.93,1],[.97,1.6],[.99,2.21],[.985,2.31],[.96,2.36],[.91,2.36],[.88,2.31],[.88,2.22],[.86,1.6],[.82,1],[.76,.47],[.67,.32],[0,.32]].map(([x,y]) => new THREE.Vector2(x,y));
  const shell = new THREE.Mesh(new THREE.LatheGeometry(profile,96), ceramic);
  shell.castShadow = true; shell.receiveShadow = true; mug.add(shell);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(.935,.035,16,96), rimGlaze);
  rim.rotation.x = Math.PI/2; rim.position.y = 2.35; rim.castShadow=true; mug.add(rim);
  const handleCurve = new THREE.CatmullRomCurve3([[.94,2.04,0],[1.38,2.1,0],[1.73,1.82,0],[1.8,1.36,0],[1.64,.87,0],[1.26,.6,0],[.86,.66,0]].map(p=>new THREE.Vector3(...p)));
  const handle = new THREE.Mesh(new THREE.TubeGeometry(handleCurve,64,.15,18,false), ceramic);
  handle.castShadow=true; handle.receiveShadow=true; mug.add(handle);
  const foot = new THREE.Mesh(new THREE.TorusGeometry(.64,.055,12,72), ceramic);
  foot.rotation.x=Math.PI/2; foot.position.y=.14; mug.add(foot);

  const coffeeMaterial = new THREE.MeshPhysicalMaterial({ color:'#30130b', roughness:.16, metalness:.05, clearcoat:1, envMapIntensity:.7 });
  const coffee = new THREE.Mesh(new THREE.CircleGeometry(.878,96), coffeeMaterial);
  coffee.rotation.x=-Math.PI/2; coffee.position.y=2.22; coffee.receiveShadow=true; mug.add(coffee);
  const meniscus = new THREE.Mesh(new THREE.TorusGeometry(.858,.018,10,96), new THREE.MeshStandardMaterial({color:'#874826',roughness:.3}));
  meniscus.rotation.x=Math.PI/2;meniscus.position.y=2.225;mug.add(meniscus);
  // A small crescent of crema bubbles at the edge of the coffee.
  for(let i=0;i<20;i++){
    const angle=i*.087+.4;
    const bubble=new THREE.Mesh(new THREE.SphereGeometry(.012+(i%4)*.005,8,6), new THREE.MeshStandardMaterial({color:i%2?'#b47b44':'#d2a569',roughness:.6}));
    bubble.position.set(Math.cos(angle)*.81,2.222,Math.sin(angle)*.81);bubble.scale.y=.3;mug.add(bubble);
  }

  const labelCanvas=document.createElement('canvas');labelCanvas.width=1024;labelCanvas.height=512;
  const label=labelCanvas.getContext('2d');
  label.fillStyle='#284a36';label.beginPath();label.ellipse(512,256,482,225,0,0,Math.PI*2);label.fill();
  label.strokeStyle='#f5d494';label.lineWidth=10;label.stroke();
  label.textAlign='center';label.fillStyle='#fff2cc';label.font='bold 105px Georgia';label.fillText('CENTRAL',512,215);
  label.font='bold 143px Georgia';label.fillText('PERK',512,355);
  label.font='24px Georgia';label.fillText('COFFEE & CONVERSATION',512,416);
  const labelTexture=new THREE.CanvasTexture(labelCanvas);labelTexture.colorSpace=THREE.SRGBColorSpace;
  labelTexture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
  const badge=new THREE.Mesh(new THREE.CylinderGeometry(.987,.957,.89,64,1,true,-.67,1.34),new THREE.MeshStandardMaterial({map:labelTexture,transparent:true,roughness:.4,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2}));
  badge.position.y=1.35;mug.add(badge);

  const saucerMaterial=new THREE.MeshPhysicalMaterial({color:'#e9c58a',roughness:.28,clearcoat:.8});
  const saucerProfile=[[0,0],[1.18,0],[1.5,.05],[1.65,.13],[1.68,.19],[1.61,.23],[1.48,.19],[1.15,.11],[.9,.09],[0,.09]].map(p=>new THREE.Vector2(...p));
  const saucer=new THREE.Mesh(new THREE.LatheGeometry(saucerProfile,96),saucerMaterial);
  saucer.castShadow=true;saucer.receiveShadow=true;scene.add(saucer);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(16,16),new THREE.ShadowMaterial({opacity:.28}));
  floor.rotation.x=-Math.PI/2;floor.position.y=-.015;floor.receiveShadow=true;scene.add(floor);

  const steamCanvas=document.createElement('canvas');steamCanvas.width=128;steamCanvas.height=128;
  const steamContext=steamCanvas.getContext('2d');const gradient=steamContext.createRadialGradient(64,64,0,64,64,64);
  gradient.addColorStop(0,'rgba(255,243,222,.5)');gradient.addColorStop(.35,'rgba(255,243,222,.25)');gradient.addColorStop(1,'rgba(255,243,222,0)');
  steamContext.fillStyle=gradient;steamContext.fillRect(0,0,128,128);
  const steamTexture=new THREE.CanvasTexture(steamCanvas);
  const steam=[];
  for(let i=0;i<15;i++){
    const material=new THREE.SpriteMaterial({map:steamTexture,transparent:true,opacity:.15,depthWrite:false,toneMapped:false});
    const puff=new THREE.Sprite(material);puff.scale.set(.35,.85,1);scene.add(puff);steam.push(puff);
  }

  let frame=0, dragging=null, destroyed=false, contextLost=false;
  let lastRendered=-Infinity,lastMotion=null,autoSpeed=0,manualUntil=0,renderCount=0,wasActive=false;
  const quiet=()=>reduced.matches||document.body.classList.contains('quiet-motion');
  let rememberedQuiet=quiet();
  const active=()=>!destroyed&&!contextLost&&!slide.hidden&&!document.hidden;
  function setState(state,message){host.dataset.state=state;status.textContent=message;}
  function drawSteam(now){
    steam.forEach((puff,i)=>{
      puff.visible=!quiet();const phase=((now*.00022+i/steam.length)%1);
      puff.position.set(Math.sin(phase*6+i*1.7)*(.1+phase*.28),2.3+phase*1.55,Math.cos(i*2.4)*.24);
      puff.scale.set(.22+phase*.43,.45+phase*.7,1);puff.material.opacity=Math.sin(phase*Math.PI)*.27;
    });
  }
  function render(now=performance.now()){
    frame=0;if(!active())return;
    if(!quiet()&&now-lastRendered<1000/30){requestRender();return;}
    const dt=lastMotion===null?0:Math.max(0,now-lastMotion);lastMotion=now;lastRendered=now;
    if(!quiet()&&!dragging&&now>=manualUntil){autoSpeed=approachSpeed(autoSpeed,.22,dt);mug.rotation.y=advanceYaw(mug.rotation.y,dt,autoSpeed);renderer.shadowMap.needsUpdate=true;}
    else autoSpeed=0;
    drawSteam(now);renderer.render(scene,camera);renderCount++;
    if(!quiet())requestRender();
  }
  function requestRender(){if(active()&&!frame)frame=requestAnimationFrame(render);}
  function resize(){const {width,height}=view.getBoundingClientRect();if(!width||!height)return;renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();requestRender();}
  function updateVisibility(){const visible=active();if(visible){if(!wasActive){lastMotion=null;autoSpeed=0;}resize();requestRender();}else{cancelAnimationFrame(frame);frame=0;lastMotion=null;autoSpeed=0;dragging=null;canvas.classList.remove('is-dragging');}wasActive=visible;}
  function motionChanged(){rememberedQuiet=quiet();cancelAnimationFrame(frame);frame=0;lastMotion=null;autoSpeed=0;renderer.shadowMap.needsUpdate=true;setState(quiet()?'reduced':'rotating',quiet()?'Reduced motion: static mug. Drag or use arrow keys to explore.':'Slow rotation. Drag to explore; arrow keys when focused.');requestRender();}
  function pointerDown(event){if(event.button!==0)return;dragging={id:event.pointerId,x:event.clientX,y:event.clientY};autoSpeed=0;canvas.setPointerCapture(event.pointerId);canvas.focus({preventScroll:true});canvas.classList.add('is-dragging');}
  function pointerMove(event){if(!dragging||event.pointerId!==dragging.id)return;mug.rotation.y+=(event.clientX-dragging.x)*.012;mug.rotation.x=THREE.MathUtils.clamp(mug.rotation.x+(event.clientY-dragging.y)*.008,-.35,.35);dragging.x=event.clientX;dragging.y=event.clientY;renderer.shadowMap.needsUpdate=true;requestRender();}
  function pointerEnd(){if(dragging)manualUntil=performance.now()+900;dragging=null;canvas.classList.remove('is-dragging');autoSpeed=0;requestRender();}
  function keyDown(event){if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(event.key))return;event.preventDefault();event.stopPropagation();manualUntil=performance.now()+1200;autoSpeed=0;if(event.key==='Home')mug.rotation.set(0,REST_YAW,0);if(event.key==='ArrowLeft')mug.rotation.y-=.15;if(event.key==='ArrowRight')mug.rotation.y+=.15;if(event.key==='ArrowUp')mug.rotation.x=THREE.MathUtils.clamp(mug.rotation.x-.08,-.35,.35);if(event.key==='ArrowDown')mug.rotation.x=THREE.MathUtils.clamp(mug.rotation.x+.08,-.35,.35);renderer.shadowMap.needsUpdate=true;requestRender();}
  function lost(event){event.preventDefault();contextLost=true;cancelAnimationFrame(frame);frame=0;setState('fallback','3D interrupted. The illustrated coffee and presentation remain available.');}
  canvas.addEventListener('webglcontextlost',lost);
  canvas.addEventListener('pointerdown',pointerDown);canvas.addEventListener('pointermove',pointerMove);
  canvas.addEventListener('pointerup',pointerEnd);canvas.addEventListener('pointercancel',pointerEnd);canvas.addEventListener('lostpointercapture',pointerEnd);canvas.addEventListener('keydown',keyDown);
  reduced.addEventListener('change',motionChanged);
  const motionObserver=new MutationObserver(()=>{if(quiet()!==rememberedQuiet)motionChanged();});motionObserver.observe(document.body,{attributes:true,attributeFilter:['class']});
  document.addEventListener('friends:slidechange',updateVisibility);document.addEventListener('visibilitychange',updateVisibility);
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(view);
  // Compile before activating the single continuous render loop.
  resize();
  await renderer.compileAsync(scene,camera);
  drawSteam(performance.now());renderer.render(scene,camera);
  host.dataset.threeRevision=THREE.REVISION;
  host.classList.add('has-webgl');
  setState('rotating','Slow rotation. Drag to explore; arrow keys when focused.');
  if(reduced.matches)motionChanged();
  updateVisibility();

  // Expose read-only state for browser QA, without coupling the slide controller to Three.js.
  host.coffeeMug={get state(){return {yaw:mug.rotation.y,tilt:mug.rotation.x,dragging:!!dragging,active:active(),autoSpeed,pendingFrames:frame?1:0,renderCount,reducedMotion:quiet(),renderCalls:renderer.info.render.calls};}};
  function dispose(){
    destroyed=true;cancelAnimationFrame(frame);frame=0;resizeObserver.disconnect();motionObserver.disconnect();
    document.removeEventListener('friends:slidechange',updateVisibility);document.removeEventListener('visibilitychange',updateVisibility);reduced.removeEventListener('change',motionChanged);
    const geometries=new Set(),materials=new Set(),textures=new Set([labelTexture,steamTexture]);
    scene.traverse(object=>{if(object.geometry)geometries.add(object.geometry);if(object.material)materials.add(object.material);});
    geometries.forEach(geometry=>geometry.dispose());materials.forEach(material=>material.dispose());textures.forEach(texture=>texture.dispose());environment.dispose();renderer.dispose();
  }
  window.addEventListener('pagehide',event=>{if(!event.persisted)dispose();});
}
