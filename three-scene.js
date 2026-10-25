"use strict";
(function(){
const status=document.getElementById("status"),test=document.getElementById("testVoice");
function speakTest(){if(!("speechSynthesis" in window)){status.textContent="No speech engine found. Enable Windows text-to-speech voices or try Edge.";return}const synth=window.speechSynthesis;synth.cancel();const u=new SpeechSynthesisUtterance("Hey, little superstar! Welcome to our magical jungle! Whoa! Are you ready for an awesome adventure?");u.lang="en-US";u.rate=.88;u.pitch=1.1;u.volume=1;const selected=document.getElementById("voice").value;const v=synth.getVoices().find(x=>x.voiceURI===selected)||synth.getVoices().find(x=>x.lang.startsWith("en"));if(v)u.voice=v;u.onstart=()=>status.textContent="English voice is playing now.";u.onend=()=>status.textContent="Voice test finished. You should have heard spoken English.";u.onerror=e=>status.textContent="Speech error: "+e.error+". Try Microsoft Edge and check device sound.";synth.resume();synth.speak(u);status.textContent="Starting English voice test..."}
test.addEventListener("click",speakTest);
if(typeof THREE==="undefined"){status.textContent="3D engine could not load. Check internet connection.";return}
const scene=new THREE.Scene();scene.background=new THREE.Color(0x8bd1ff);scene.fog=new THREE.Fog(0x8bd1ff,20,65);
const camera=new THREE.PerspectiveCamera(42,16/9,.1,120);camera.position.set(0,5,15);camera.lookAt(0,2,0);
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setSize(960,540);renderer.setPixelRatio(1);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
scene.add(new THREE.HemisphereLight(0xffffff,0x57824c,2));
const sun=new THREE.DirectionalLight(0xfff3d1,2.4);sun.position.set(-6,14,8);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-20;sun.shadow.camera.right=20;sun.shadow.camera.top=20;sun.shadow.camera.bottom=-20;scene.add(sun);
const mat=(color,roughness=.8)=>new THREE.MeshStandardMaterial({color,roughness});
const green=mat(0x5eb65e),brown=mat(0x875535),leaf=mat(0x348a56),pink=mat(0xf6b3bf),blue=mat(0x9aaecb),cream=mat(0xf5d6a5),dark=mat(0x242638),white=mat(0xffffff),yellow=mat(0xffcb42);
function sphere(parent,x,y,z,sx,sy,sz,m){const a=new THREE.Mesh(new THREE.SphereGeometry(1,24,16),m);a.position.set(x,y,z);a.scale.set(sx,sy,sz);a.castShadow=true;a.receiveShadow=true;parent.add(a);return a}
function cylinder(parent,x,y,z,rt,rb,h,m){const a=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,12),m);a.position.set(x,y,z);a.castShadow=true;parent.add(a);return a}
const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),green);ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
for(let i=0;i<28;i++){const a=i*2.399,x=Math.sin(a)*(7+(i%5)*2.3),z=-4-Math.cos(a)*(5+(i%4)*2.2),tree=new THREE.Group();tree.position.set(x,0,z);cylinder(tree,0,2,0,.24,.38,4,brown);sphere(tree,0,4.3,0,1.55,1.6,1.4,leaf);sphere(tree,-.8,3.8,.2,1.1,1.2,1,leaf);sphere(tree,.9,3.9,0,1,1.1,1,leaf);scene.add(tree)}
for(let i=0;i<65;i++){const x=Math.sin(i*19.7)*17,z=Math.cos(i*11.3)*14;sphere(scene,x,.13,z,.12,.22,.12,i%3===0?yellow:mat(0xf389ac))}
const elephant=new THREE.Group();elephant.position.set(-2.2,0,1.1);scene.add(elephant);
sphere(elephant,0,1.25,0,1.18,.88,.78,blue);sphere(elephant,-.78,1.78,.4,.77,.74,.67,blue);sphere(elephant,-1.29,1.75,.87,.49,.58,.22,blue);sphere(elephant,-1.31,1.75,1.04,.35,.43,.1,pink);
for(const x of [-.75,.73])for(const z of [-.4,.42])cylinder(elephant,x,.53,z,.23,.26,.85,blue);
sphere(elephant,-.96,2.03,1.03,.1,.13,.06,white);sphere(elephant,-.98,2.03,1.085,.05,.07,.03,dark);
const trunk=cylinder(elephant,-1.36,1.12,.73,.19,.13,1.1,blue);trunk.rotation.z=-.22;
const monkey=new THREE.Group();monkey.position.set(2.15,0,1.5);scene.add(monkey);
sphere(monkey,0,1.18,0,.65,.77,.5,brown);sphere(monkey,0,2.15,.12,.67,.63,.55,brown);sphere(monkey,0,2.05,.54,.5,.42,.22,cream);sphere(monkey,-.65,2.2,.08,.29,.33,.19,brown);sphere(monkey,.65,2.2,.08,.29,.33,.19,brown);
for(const x of [-.2,.2]){sphere(monkey,x,2.27,.75,.08,.11,.06,white);sphere(monkey,x,2.27,.8,.042,.065,.04,dark)}
for(const x of [-.42,.42])cylinder(monkey,x,.53,0,.13,.16,.9,brown);
const tail=new THREE.Mesh(new THREE.TorusGeometry(.62,.105,8,40,Math.PI*1.65),brown);tail.position.set(.78,1.3,-.1);tail.rotation.z=-.2;monkey.add(tail);
const oldDraw=window.draw||draw;
function draw3d(t,duration,scenes,title){const w=canvas.width,h=canvas.height;renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.set(Math.sin(t*.18)*1.2, h>w?5.2:4.3,h>w?19:14);camera.lookAt(0,1.55,0);camera.updateProjectionMatrix();elephant.position.y=Math.sin(t*3)*.1;elephant.rotation.y=Math.sin(t*.7)*.14;monkey.position.y=Math.sin(t*4+.5)*.14;monkey.rotation.y=Math.sin(t*.9)*.25;renderer.render(scene,camera);c.drawImage(renderer.domElement,0,0,w,h);const n=Math.min(scenes.length-1,Math.floor(Math.min(.999,t/duration)*scenes.length));c.fillStyle="#152544d9";c.fillRect(0,0,w,Math.max(60,h*.1));c.fillStyle="white";c.font="bold "+Math.max(19,Math.floor(w/31))+"px system-ui";c.textAlign="center";c.fillText(title.slice(0,42),w/2,Math.max(38,h*.065));c.fillStyle="#122344e8";c.fillRect(0,h-125,w,125);const lines=wrap(scenes[n],Math.max(22,Math.floor(w/21)));c.font="bold "+Math.max(16,Math.floor(w/44))+"px system-ui";lines.slice(0,3).forEach((s,i)=>c.fillText(s,w/2,h-88+i*30))}
window.draw=draw3d;
const originalGenerate=document.getElementById("generate").onclick;
document.getElementById("generate").onclick=function(){const original=window.draw;try{draw=draw3d;originalGenerate()}catch(e){status.textContent="3D error: "+e.message;console.error(e)}};
draw3d(0,30,["Meet our new 3D jungle friends!"],"Kids Cartoon Factory 3D");
})();
