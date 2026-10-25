"use strict";

const $ = id => document.getElementById(id);
const state = { scenes: [], playing: false, muted: false, startedAt: 0, raf: 0, previewSeconds: 18, activeScene: 0, timer: null };
const defaults = {
  hero: { name: "Milo", type: "a shy baby elephant", look: "soft blue-gray skin, tiny yellow backpack, kind round eyes" },
  friend: { name: "Zuzu", type: "a playful little monkey", look: "warm chestnut fur, purple scarf, bright curious eyes" }
};

function cleanIdea(text) {
  return text.trim().replace(/[<>]/g, "").replace(/\s+/g, " ").slice(0, 700) || "a little elephant and a clever monkey go on a kind adventure";
}

function extractCharacters(idea) {
  const lower = idea.toLowerCase();
  let hero = { ...defaults.hero }, friend = { ...defaults.friend };
  if (lower.includes("dinosaur")) hero = { name: "Dino", type: "a tiny friendly dinosaur", look: "mint-green scales, a sunny orange satchel, gentle big eyes" };
  if (lower.includes("rabbit") || lower.includes("bunny")) hero = { name: "Pip", type: "a bouncy little bunny", look: "lavender ears, peach overalls, sparkly brown eyes" };
  if (lower.includes("cat")) hero = { name: "Mimi", type: "a curious kitten", look: "cream-and-caramel fur, teal bow tie, bright green eyes" };
  if (lower.includes("space") || lower.includes("moon") || lower.includes("rocket")) friend = { name: "Nova", type: "a tiny star robot", look: "round pearl-white body, glowing violet antenna, friendly digital face" };
  return { hero, friend };
}

function tr(text, language) {
  if (language === "Telugu") return text.replace("Oh no!", "అయ్యో!").replace("Let us", "మనము").replace("Thank you", "ధన్యవాదాలు");
  return text;
}

function buildEpisode() {
  const idea = cleanIdea($("idea").value);
  const language = $("language").value;
  const seconds = Number($("length").value);
  const age = $("age").value;
  const lesson = $("lesson").value.trim() || "Kindness and teamwork can solve a tricky problem.";
  const chars = extractCharacters(idea);
  const n = 8;
  const perScene = Math.max(7, Math.round(seconds / n));
  const setting = /space|moon|rocket/i.test(idea) ? "a dreamy moonlit playground with soft galaxies" : /school/i.test(idea) ? "a bright, cozy storybook schoolyard" : "a glowing magical jungle with candy-colored flowers";
  const object = /kite/i.test(idea) ? "rainbow kite" : /picnic/i.test(idea) ? "sparkling picnic basket" : /dinosaur/i.test(idea) ? "little golden map" : "mysterious twinkling surprise";
  const premise = idea.charAt(0).toUpperCase() + idea.slice(1).replace(/[.!?]+$/, "");
  const lines = [
    ["Narrator", `Whoa! ${premise}. Can you spot the surprise?`],
    [chars.hero.name, `Oh no! My ${object} has disappeared!`],
    [chars.friend.name, `Don't worry, ${chars.hero.name}! We can look together. Adventure buddies never give up!`],
    ["Narrator", `They followed a trail of glittery clues through ${setting}.`],
    [chars.hero.name, `That path looks a little scary... but I feel braver with you.`],
    [chars.friend.name, `Let's use our super skills: your careful eyes and my quick feet!`],
    ["Narrator", `With one clever idea and a big friendly cheer, they found the ${object}!`],
    [chars.hero.name, `We did it! ${lesson}`]
  ].map(([speaker, dialogue]) => [speaker, tr(dialogue, language)]);
  state.scenes = lines.map(([speaker, dialogue], index) => ({
    number: index + 1,
    title: ["The big surprise", "A worried friend", "Teamwork begins", "The glitter trail", "A brave little pause", "The clever plan", "The happy find", "A sparkly goodbye"][index],
    speaker,
    dialogue,
    duration: perScene,
    visual: `High-quality 3D children's animated film still, ${setting}. ${chars.hero.name}, ${chars.hero.type}, ${chars.hero.look}; ${chars.friend.name}, ${chars.friend.type}, ${chars.friend.look}. Scene ${index + 1}: ${dialogue.replace(/['"]/g, "")}. Warm cinematic lighting, expressive faces, soft depth of field, joyful colors, safe for children, consistent character design, no text, no watermark, 16:9.`,
    motion: ["Slow push-in; character looks toward camera with a surprised happy expression.", "Gentle close-up; hero looks around, then points toward the missing object.", "Two friends do a small excited high-five and run into the scene.", "Camera tracks beside the friends as they follow bright clues.", "Quiet pause; hero takes a breath, friend gives a reassuring nod.", "Fast playful montage; they examine clues and make a plan together.", "Wide celebratory shot; the object returns with glitter and happy jumps.", "Warm sunset close-up; both wave toward camera, then a star-shaped sparkle appears."][index],
    caption: dialogue
  }));
  return { idea, language, seconds, age, lesson, chars, setting, object, premise };
}

function renderEpisode(episode) {
  $("resultsSummary").textContent = `${episode.seconds / 60} minute ${episode.language} episode for ages ${episode.age} · 8 scenes · ${episode.chars.hero.name} & ${episode.chars.friend.name}`;
  $("hookText").textContent = state.scenes[0].dialogue;
  $("charactersText").textContent = `${episode.chars.hero.name} + ${episode.chars.friend.name}`;
  $("lessonText").textContent = episode.lesson;
  $("storyOutput").innerHTML = `<article class="story-card"><h3>${escapeHtml("Episode: " + episode.premise)}</h3><p><strong>Audience:</strong> ${escapeHtml(episode.age)} &nbsp;·&nbsp; <strong>Language:</strong> ${escapeHtml(episode.language)} &nbsp;·&nbsp; <strong>Target duration:</strong> ${episode.seconds}s</p><p><strong>Story promise:</strong> A safe, playful mini-adventure with a clear problem, cooperation, a small surprise, and a warm happy ending.</p></article>${state.scenes.map(scene => `<div class="dialogue-row"><div class="speaker">${escapeHtml(scene.speaker)}</div><p>${escapeHtml(scene.dialogue)}</p></div>`).join("")}`;
  $("sceneOutput").innerHTML = `<article class="story-card"><h3>Character Bible</h3><p><strong>${escapeHtml(episode.chars.hero.name)}</strong> — ${escapeHtml(episode.chars.hero.type)}, ${escapeHtml(episode.chars.hero.look)}.</p><p><strong>${escapeHtml(episode.chars.friend.name)}</strong> — ${escapeHtml(episode.chars.friend.type)}, ${escapeHtml(episode.chars.friend.look)}.</p><p>Generate and save a clean reference image for both characters before generating scenes. Reuse it in every scene.</p></article>${state.scenes.map(scene => `<article class="scene-card"><div class="scene-top"><h3>Scene ${scene.number}: ${escapeHtml(scene.title)}</h3><span class="scene-time">~${scene.duration}s</span></div><p class="scene-meta"><strong>Voice:</strong> ${escapeHtml(scene.speaker)} · “${escapeHtml(scene.dialogue)}”<br><strong>Motion:</strong> ${escapeHtml(scene.motion)}</p><div class="prompt-box">${escapeHtml(scene.visual)}</div></article>`).join("")}`;
  $("copyAll").disabled = false;
  $("downloadKit").disabled = false;
  setActiveScene(0);
}

function escapeHtml(value) { return value.replace(/[&<>'"]/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#039;", '"':"&quot;" }[char])); }

function kitText() {
  const story = $("storyOutput").innerText;
  const scene = $("sceneOutput").innerText;
  return `STORYSPARK STUDIO — EPISODE PRODUCTION KIT\n\n${story}\n\nSCENE-BY-SCENE GENERATION PROMPTS\n\n${scene}\n\nFINAL ASSEMBLY CHECKLIST\n1. Generate the character reference image once.\n2. Generate each visual scene using its prompt and motion direction.\n3. Create one saved voice per character and narrate the matching lines.\n4. Put clips in scene order, add captions, music and review before posting.\n\nCreator note: Review every generated item for quality, copyright, voice rights and child appropriateness before publishing.`;
}

function showToast(message) { const toast = $("toast"); toast.textContent = message; toast.classList.add("show"); clearTimeout(state.timer); state.timer = setTimeout(() => toast.classList.remove("show"), 2600); }

function setActiveScene(index) {
  if (!state.scenes.length) return;
  state.activeScene = Math.max(0, Math.min(index, state.scenes.length - 1));
  $("sceneCounter").textContent = `Scene ${state.activeScene + 1} of ${state.scenes.length}`;
  $("caption").textContent = state.scenes[state.activeScene].caption;
}

function drawStage(progress = 0) {
  const canvas = $("stage"), ctx = canvas.getContext("2d"), w = canvas.width, h = canvas.height;
  const now = progress * Math.PI * 2;
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#8edafa"); sky.addColorStop(.64, "#fbd69a"); sky.addColorStop(.65, "#6fc979"); sky.addColorStop(1, "#429b61"); ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#fff2a3"; ctx.beginPath(); ctx.arc(w*.82, h*.18, 70, 0, Math.PI*2); ctx.fill();
  for (let i=0;i<9;i++) { const x=(i*163 + progress*75)%(w+170)-80, y=h*.52+(i%3)*20; ctx.fillStyle=i%2?"#399b6a":"#2f8059"; ctx.beginPath(); ctx.arc(x,y,78,0,Math.PI*2); ctx.fill(); ctx.fillStyle="#78503a";ctx.fillRect(x-12,y,24,h-y); }
  ctx.fillStyle="#75cc76";ctx.fillRect(0,h*.71,w,h*.29);
  for (let i=0;i<22;i++){ctx.fillStyle=i%2?"#f5b6d3":"#ffe06d";ctx.beginPath();ctx.arc((i*89)%w,h*.75+(i%4)*27,9,0,Math.PI*2);ctx.fill();}
  drawElephant(ctx, w*.34 + Math.sin(now)*18, h*.66 + Math.sin(now*3)*8, w/1280);
  drawMonkey(ctx, w*.66 - Math.sin(now)*18, h*.68 + Math.sin(now*3+.7)*10, w/1280);
  if (state.activeScene === 6) { ctx.font=`${48*(w/1280)}px sans-serif`;ctx.fillText("🌈",w*.5,h*.36+Math.sin(now*2)*7); }
  ctx.fillStyle="#1724471a";ctx.fillRect(0,0,w,h);
}

function drawElephant(ctx, x, y, s) { ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle="#9babd3";ellipse(ctx,0,0,90,72);ellipse(ctx,-70,-42,48,53);ctx.fillStyle="#8796c2";ellipse(ctx,-94,-42,31,44);ctx.fillStyle="#f0a8b9";ellipse(ctx,-95,-41,20,29);ctx.fillStyle="#fff";ellipse(ctx,-49,-61,9,12);ctx.fillStyle="#2a3556";ellipse(ctx,-48,-61,4,6);ctx.strokeStyle="#9babd3";ctx.lineWidth=22;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-104,-22);ctx.quadraticCurveTo(-116,22,-102,47);ctx.stroke();for(const leg of [-48,34]){ctx.fillStyle="#8796c2";ctx.fillRect(leg,28,28,66);ellipse(ctx,leg+14,94,16,9)}ctx.fillStyle="#ffd45d";roundRect(ctx,-22,-16,49,39,10);ctx.fillStyle="#fff";ctx.font="bold 22px sans-serif";ctx.fillText("M",-10,11);ctx.restore(); }
function drawMonkey(ctx, x, y, s) {ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle="#8c5438";ctx.lineWidth=14;ctx.beginPath();ctx.arc(47,10,44,-1.4,1.7);ctx.stroke();ctx.fillStyle="#995d3b";ellipse(ctx,0,0,55,61);ellipse(ctx,0,-58,54,47);ellipse(ctx,-46,-58,22,24);ellipse(ctx,46,-58,22,24);ctx.fillStyle="#f0c796";ellipse(ctx,0,-51,38,29);ctx.fillStyle="#fff";ellipse(ctx,-15,-63,6,8);ellipse(ctx,15,-63,6,8);ctx.fillStyle="#273052";ellipse(ctx,-15,-63,3,5);ellipse(ctx,15,-63,3,5);ctx.fillStyle="#e36f6e";ellipse(ctx,0,-35,13,7);ctx.fillStyle="#80503a";ctx.fillRect(-36,36,17,54);ctx.fillRect(19,36,17,54);ctx.fillStyle="#8b6be7";ctx.fillRect(-59,-7,118,16);ctx.restore();}
function ellipse(ctx,x,y,rx,ry){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();}
function roundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}

function speakCurrent() {
  if (state.muted || !state.scenes.length || !window.speechSynthesis) return;
  speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(state.scenes[state.activeScene].caption); utterance.rate=.95;utterance.pitch=state.activeScene%2?1.18:1.02; utterance.lang=$("language").value === "Telugu" ? "te-IN" : "en-US"; speechSynthesis.speak(utterance);
}

function animatePreview(ts) {
  if (!state.playing) return;
  const elapsed = (ts-state.startedAt)/1000;
  const ratio = Math.min(elapsed/state.previewSeconds,1);
  const scene = Math.min(state.scenes.length-1,Math.floor(ratio*state.scenes.length));
  if (scene !== state.activeScene) { setActiveScene(scene); speakCurrent(); }
  drawStage(ratio); $("meterFill").style.width = `${ratio*100}%`; $("previewTime").textContent = `0:${String(Math.floor(ratio*state.previewSeconds)).padStart(2,"0")}`;
  if(ratio<1) state.raf=requestAnimationFrame(animatePreview); else stopPreview();
}
function playPreview(){if(!state.scenes.length){buildAndShow();} if(state.playing)return;state.playing=true;state.startedAt=performance.now();$("playPreview").textContent="❚❚";speakCurrent();state.raf=requestAnimationFrame(animatePreview);}
function stopPreview(){state.playing=false;cancelAnimationFrame(state.raf);$("playPreview").textContent="▶";speechSynthesis?.cancel();}

function buildAndShow(){stopPreview();const episode=buildEpisode();renderEpisode(episode);drawStage(0);$("meterFill").style.width="0%";$("previewTime").textContent="0:00";showToast("Your 8-scene episode kit is ready ✨");document.querySelector(".results").scrollIntoView({behavior:"smooth",block:"start"});}

document.querySelectorAll(".idea-chip").forEach(button=>button.addEventListener("click",()=>{$("idea").value=button.textContent.replace(/^\S+\s/,"")+". Turn it into a kind, funny adventure with a surprise ending.";}));
$("buildStory").addEventListener("click",buildAndShow);
$("playPreview").addEventListener("click",()=>state.playing?stopPreview():playPreview());
$("soundToggle").addEventListener("click",()=>{state.muted=!state.muted;$("soundToggle").textContent=state.muted?"🔇":"🔊";if(state.muted)speechSynthesis?.cancel();showToast(state.muted?"Preview narration muted":"Preview narration on");});
$("copyAll").addEventListener("click",async()=>{try{await navigator.clipboard.writeText(kitText());showToast("Complete production kit copied");}catch{showToast("Copy was blocked—please select the text manually.");}});
$("downloadKit").addEventListener("click",()=>{const blob=new Blob([kitText()],{type:"text/plain;charset=utf-8"});const link=document.createElement("a");link.href=URL.createObjectURL(blob);link.download="storyspark-episode-kit.txt";link.click();URL.revokeObjectURL(link.href);showToast("Production kit downloaded");});
$("newProject").addEventListener("click",()=>{stopPreview();$("idea").value="";$("idea").focus();showToast("Fresh story canvas ready");window.scrollTo({top:0,behavior:"smooth"});});
document.querySelectorAll(".tab").forEach(tab=>tab.addEventListener("click",()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".tab-panel").forEach(x=>x.classList.remove("active"));tab.classList.add("active");$(tab.dataset.tab+"Panel").classList.add("active");}));
buildAndShow();
