/* ===== LAYER: Focus Rescue (additive, removable) =====
   Train-and-princess view for an ALREADY RUNNING focus session.
   It does not own a timer: it reads startedAt + totalSec, so it never drifts from the app's session.
   API:  FocusRescue.open({title,totalSec,startedAt,onDone,onExpire,onClose})   FocusRescue.close()
   Toggle: localStorage los_rescueOn = "0" to disable.  Stats: los_rescueStats.                       */
(function(){
if(window.FocusRescue)return;
const SYMS="<svg width=\"0\" height=\"0\" style=\"position:absolute\"><defs>\n<symbol id=\"fr-hero\" viewBox=\"0 0 40 60\">\n  <path d=\"M10 16 L1 54 L20 47 L39 54 L30 16Z\" fill=\"#dc2626\"/>\n  <rect x=\"12\" y=\"38\" width=\"7\" height=\"16\" fill=\"#1d4ed8\"/><rect x=\"21\" y=\"38\" width=\"7\" height=\"16\" fill=\"#1d4ed8\"/>\n  <rect x=\"12\" y=\"50\" width=\"7\" height=\"7\" rx=\"1\" fill=\"#dc2626\"/><rect x=\"21\" y=\"50\" width=\"7\" height=\"7\" rx=\"1\" fill=\"#dc2626\"/>\n  <rect x=\"6\" y=\"18\" width=\"6\" height=\"15\" rx=\"3\" fill=\"#1d4ed8\"/><rect x=\"28\" y=\"18\" width=\"6\" height=\"15\" rx=\"3\" fill=\"#1d4ed8\"/>\n  <rect x=\"11\" y=\"16\" width=\"18\" height=\"24\" rx=\"4\" fill=\"#1d4ed8\"/>\n  <rect x=\"11\" y=\"35\" width=\"18\" height=\"5\" fill=\"#dc2626\"/><rect x=\"18\" y=\"35\" width=\"4\" height=\"5\" fill=\"#facc15\"/>\n  <path d=\"M20 19 L27 24 L20 33 L13 24Z\" fill=\"#facc15\" stroke=\"#dc2626\" stroke-width=\"1.5\"/>\n  <circle cx=\"20\" cy=\"9\" r=\"7\" fill=\"#fcd9b6\"/>\n  <path d=\"M13 9 Q13 1 21 1.5 Q27 2 27 9 Q24 5 19 5.5 Q22 8 19 8 Q15 6 13 9Z\" fill=\"#111827\"/>\n  <circle cx=\"17.5\" cy=\"10\" r=\".9\" fill=\"#111\"/><circle cx=\"22.5\" cy=\"10\" r=\".9\" fill=\"#111\"/>\n  <path d=\"M17.5 13 Q20 15 22.5 13\" stroke=\"#b45309\" fill=\"none\" stroke-width=\".8\"/>\n</symbol>\n<symbol id=\"fr-prin\" viewBox=\"0 0 40 60\">\n  <path d=\"M15 15 L4 57 L36 57 L25 15Z\" fill=\"#ec4899\"/><path d=\"M15 15 L25 15 L27 26 L13 26Z\" fill=\"#db2777\"/>\n  <path d=\"M9 44 Q20 50 31 44\" stroke=\"#fbcfe8\" fill=\"none\" stroke-width=\"2\"/>\n  <rect x=\"8\" y=\"17\" width=\"5\" height=\"14\" rx=\"2.5\" fill=\"#fcd9b6\"/><rect x=\"27\" y=\"17\" width=\"5\" height=\"14\" rx=\"2.5\" fill=\"#fcd9b6\"/>\n  <path d=\"M12 8 Q10 26 15 30 L25 30 Q30 26 28 8Z\" fill=\"#f5c542\"/>\n  <circle cx=\"20\" cy=\"10\" r=\"7\" fill=\"#fcd9b6\"/>\n  <path d=\"M13 8 Q20 -1 27 8 Q20 5 13 8Z\" fill=\"#f5c542\"/>\n  <path d=\"M14 3 L15.5 -3 L18 1 L20 -4 L22 1 L24.5 -3 L26 3Z\" fill=\"#facc15\" stroke=\"#ca8a04\" stroke-width=\".6\"/>\n  <circle cx=\"17.5\" cy=\"10\" r=\".9\" fill=\"#111\"/><circle cx=\"22.5\" cy=\"10\" r=\".9\" fill=\"#111\"/>\n  <path d=\"M18 13 Q20 14.5 22 13\" stroke=\"#be123c\" fill=\"none\" stroke-width=\".9\"/>\n</symbol>\n</defs></svg>", STAGE="<svg viewBox=\"0 0 300 300\">\n      <circle cx=\"150\" cy=\"150\" r=\"115\" fill=\"none\" stroke=\"#c9ccdb\" stroke-width=\"14\" stroke-dasharray=\"2 7\"/>\n      <circle cx=\"150\" cy=\"150\" r=\"121\" fill=\"none\" stroke=\"#8b90aa\" stroke-width=\"2\"/>\n      <circle cx=\"150\" cy=\"150\" r=\"109\" fill=\"none\" stroke=\"#8b90aa\" stroke-width=\"2\"/>\n      <g id=\"fr-smoke\"></g>\n      <!-- princess lying full-length on the track, tied with ropes -->\n      <g id=\"fr-lying\" transform=\"translate(150 35)\">\n        <path d=\"M-6 -5 L26 -8 L26 8 L-6 5Z\" fill=\"#ec4899\"/>\n        <path d=\"M-6 -5 L2 -5 L2 5 L-6 5Z\" fill=\"#db2777\"/>\n        <rect x=\"26\" y=\"-6\" width=\"7\" height=\"4\" rx=\"2\" fill=\"#7c2d12\"/><rect x=\"26\" y=\"2\" width=\"7\" height=\"4\" rx=\"2\" fill=\"#7c2d12\"/>\n        <path d=\"M-24 -6 Q-30 6 -18 9 L-8 6 L-8 -6Z\" fill=\"#f5c542\"/>\n        <circle cx=\"-15\" cy=\"0\" r=\"7\" fill=\"#fcd9b6\"/>\n        <path d=\"M-19 -6 L-22 -11 L-17 -8 L-15 -13 L-13 -8 L-9 -11 L-10 -5Z\" fill=\"#facc15\" stroke=\"#ca8a04\" stroke-width=\".5\"/>\n        <circle cx=\"-17\" cy=\"-1\" r=\".8\" fill=\"#111\"/><circle cx=\"-12\" cy=\"-1\" r=\".8\" fill=\"#111\"/>\n        <ellipse cx=\"-14.5\" cy=\"3.2\" rx=\"1.6\" ry=\"1.2\" fill=\"#be123c\"/>\n        <path d=\"M-8 3 L2 6\" stroke=\"#fcd9b6\" stroke-width=\"3.5\" stroke-linecap=\"round\"/>\n        <g stroke=\"#92400e\" stroke-width=\"3\" stroke-linecap=\"round\"><path d=\"M-3 -9 V9\"/><path d=\"M10 -9 V9\"/><path d=\"M22 -9 V9\"/></g>\n        <text x=\"4\" y=\"-16\" font-size=\"10\" font-weight=\"700\" fill=\"#e11d48\" text-anchor=\"middle\">Help!</text>\n      </g>\n      <g id=\"fr-train\"></g>\n    </svg>", CSS="\n#fr-overlay{position:fixed;inset:0;z-index:99999;background:#070a14;display:flex;align-items:center;justify-content:center;padding:16px;font-family:Inter,system-ui,sans-serif}\n#fr-overlay *{box-sizing:border-box}\n#fr-overlay svg{display:block}\n.fr-card{background:#fff;border-radius:20px;padding:22px;width:100%;max-width:400px;text-align:center;box-shadow:0 0 80px #3b3bd066}\n.fr-eye{font-size:11px;letter-spacing:.12em;font-weight:700;color:#4f46e5}\n.fr-card h1{margin:6px 0 14px;font:700 22px Georgia,serif;color:#111}\n.fr-stage{position:relative;width:100%;max-width:320px;margin:0 auto}\n.fr-stage>svg{width:100%}\n.fr-center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none}\n#fr-time{font:600 34px ui-monospace,Menlo,monospace;color:#4f46e5}\n#fr-msg{font-size:12px;color:#7a7f99;margin-top:2px;padding:0 20px}\n.fr-pop{font:900 44px Georgia,serif;color:#e11d48;animation:frpop .5s cubic-bezier(.2,1.6,.4,1) both;transform:rotate(-8deg)}\n@keyframes frpop{from{transform:scale(0) rotate(-8deg)}to{transform:scale(1) rotate(-8deg)}}\n.fr-hug{display:flex;align-items:flex-end}\n.fr-hug svg{width:70px;height:105px}\n.fr-hug svg:first-child{animation:frL .8s ease-out both}\n.fr-hug svg:last-child{margin-left:-16px;animation:frR .8s ease-out both}\n@keyframes frL{from{transform:translateX(-60px);opacity:0}}\n@keyframes frR{from{transform:translateX(30px);opacity:0}}\n.fr-heart{position:absolute;bottom:40%;font-size:22px;animation:frup 2s ease-out forwards}\n@keyframes frup{to{transform:translateY(-140px);opacity:0}}\n.fr-btns{display:flex;gap:8px;justify-content:center;margin-top:14px}\n.fr-btns button{border:1px solid #d5d8e4;background:#eff0f6;border-radius:8px;padding:9px 14px;font-weight:600;font-size:13px;cursor:pointer;color:#111}\n.fr-btns button.ok{background:#16a34a;color:#fff;border-color:#16a34a}\n.fr-sess{font-size:12px;color:#9aa0bb;margin-top:12px}.fr-sess b{color:#4f46e5}\n.fr-shake{animation:frsh .25s infinite}@keyframes frsh{50%{transform:translateX(2px)}}\n";
const R=115,C=150,A0=-10,SWEEP=280,OFFS=[0,-14.5,-27,-39.5,-52],COLORS=['#2563eb','#16a34a','#f59e0b','#9333ea'];
const $=id=>document.getElementById('fr-'+id);
let ov=null,raf=0,ctx=null,o=null,state='idle',lastPuff=0;
const wheel=x=>`<circle cx="${x}" cy="7" r="3" fill="#111827"/>`;
const ENGINE=`<rect x="-15" y="-10" width="11" height="15" fill="#b91c1c"/><rect x="-4" y="-6" width="20" height="11" rx="2" fill="#1f2937"/><rect x="6" y="-12" width="5" height="7" fill="#374151"/><path d="M16 -4 L21 5 L16 5Z" fill="#6b7280"/><circle cx="14" cy="-1" r="2" fill="#fde047"/><rect x="-12" y="-7" width="5" height="4" fill="#bfdbfe"/>${wheel(-9)}${wheel(0)}${wheel(9)}`;
const coach=c=>`<rect x="-11" y="-8" width="22" height="14" rx="2" fill="${c}"/><g fill="#dbeafe"><rect x="-8" y="-5" width="4" height="4"/><rect x="-2" y="-5" width="4" height="4"/><rect x="4" y="-5" width="4" height="4"/></g>${wheel(-6)}${wheel(6)}`;
const pos=a=>[C+R*Math.cos(a*Math.PI/180),C+R*Math.sin(a*Math.PI/180)];
const fmt=s=>{s=Math.max(0,Math.ceil(s));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
const today=()=>new Date().toISOString().slice(0,10);
function stats(add){let s;try{s=JSON.parse(localStorage.getItem('los_rescueStats'))}catch(e){}
  if(!s||s.day!==today())s={day:today(),saved:0,lost:0};
  if(add){s[add]++;try{localStorage.setItem('los_rescueStats',JSON.stringify(s))}catch(e){}}return s}
function place(a){OFFS.forEach((off,i)=>{const b=a+off,[x,y]=pos(b);$('car'+i).setAttribute('transform',`translate(${x} ${y}) rotate(${b+90})`)})}
function puff(a){const [x,y]=pos(a+3),c=document.createElementNS('http://www.w3.org/2000/svg','circle'),ox=Math.cos(a*Math.PI/180)*14,oy=Math.sin(a*Math.PI/180)*14;
  c.setAttribute('cx',x+ox);c.setAttribute('cy',y+oy);c.setAttribute('r',4);c.setAttribute('fill','#b8bcd0');$('smoke').appendChild(c);let k=0;
  (function f(){k++;c.setAttribute('cx',x+ox*(1+k/25));c.setAttribute('cy',y+oy*(1+k/25));c.setAttribute('r',4+k*.15);c.setAttribute('opacity',.7-k/60);k<42?requestAnimationFrame(f):c.remove()})()}
/* sounds: synthesised, no files */
function tone(type,f1,f2,dur,vol,delay=0,vib=0){if(!ctx)return;const os=ctx.createOscillator(),g=ctx.createGain(),t=ctx.currentTime+delay;
  os.type=type;os.frequency.setValueAtTime(f1,t);os.frequency.exponentialRampToValueAtTime(f2,t+dur);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.02);g.gain.exponentialRampToValueAtTime(.001,t+dur);
  if(vib){const l=ctx.createOscillator(),lg=ctx.createGain();l.frequency.value=vib;lg.gain.value=70;l.connect(lg);lg.connect(os.frequency);l.start(t);l.stop(t+dur)}
  os.connect(g);g.connect(ctx.destination);os.start(t);os.stop(t+dur)}
const kiss=()=>[0,.35,.7].forEach(d=>{tone('sine',1200,350,.09,.6,d);tone('triangle',2400,700,.05,.2,d)});
const scream=()=>{[0,7].forEach(dt=>{tone('sawtooth',650+dt*8,1600+dt*8,.5,.16,0,10);tone('sawtooth',1600+dt*8,900+dt*8,.9,.16,.5,11)});tone('square',1900,1200,1.2,.05,.3,14)};
function build(){
  const st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
  ov=document.createElement('div');ov.id='fr-overlay';ov.style.display='none';
  ov.innerHTML=SYMS+`<div class="fr-card"><div class="fr-eye">DEEP FOCUS · RESCUE MODE</div><h1 id="fr-title"></h1>
  <div class="fr-stage" id="fr-stage">${STAGE}<div class="fr-center" id="fr-center"></div></div>
  <div class="fr-btns"><button id="fr-exit">✕ Exit</button><button class="ok" id="fr-done">✔ Task Done</button></div>
  <div class="fr-sess">Princess saved today: <b id="fr-saved"></b> · lost: <b id="fr-lost"></b></div></div>`;
  document.body.appendChild(ov);
  $('train').innerHTML=OFFS.map((_,i)=>`<g id="fr-car${i}">${i?coach(COLORS[i-1]):ENGINE}</g>`).join('');
  $('exit').onclick=close;
  $('done').onclick=()=>{if(state==='running')win()};
}
function paintStats(){const s=stats();$('saved').textContent=s.saved;$('lost').textContent=s.lost}
function hearts(){for(let i=0;i<9;i++){const h=document.createElement('div');h.className='fr-heart';h.textContent=i%2?'❤️':'💖';
  h.style.left=(20+Math.random()*60)+'%';h.style.animationDelay=(Math.random()*.6)+'s';$('stage').appendChild(h);setTimeout(()=>h.remove(),3000)}}
function tick(){
  const el=(Date.now()-o.startedAt)/1000,f=Math.min(el/o.totalSec,1),a=A0+SWEEP*f;
  place(a);$('time').textContent=fmt(o.totalSec-el);$('msg').textContent='Finish the task before the train arrives!';
  if(f>.85)$('stage').classList.add('fr-shake');
  if(Date.now()-lastPuff>350){puff(a);lastPuff=Date.now()}
  if(f>=1)return fail();raf=requestAnimationFrame(tick)}
function win(){cancelAnimationFrame(raf);state='saved';stats('saved');paintStats();
  $('stage').classList.remove('fr-shake');$('done').style.display='none';$('lying').style.display='none';
  $('center').innerHTML='<div class="fr-hug"><svg><use href="#fr-hero"/></svg><svg><use href="#fr-prin"/></svg></div><div style="font-size:20px">❤️💋</div><div id="fr-msg">She is safe. Well done, hero!</div>';
  if(ctx)ctx.resume();setTimeout(kiss,700);hearts();try{o.onDone&&o.onDone()}catch(e){console.warn(e)}}
function fail(){state='failed';stats('lost');paintStats();$('stage').classList.remove('fr-shake');$('done').style.display='none';$('lying').style.opacity=.35;
  $('center').innerHTML='<div class="fr-pop">OOPS!</div><div id="fr-msg" style="margin-top:8px">Time is up. The train got there first.</div>';
  scream();try{o.onExpire&&o.onExpire()}catch(e){console.warn(e)}}
function open(opt){
  if(localStorage.getItem('los_rescueOn')==='0')return;
  if(!ov)build();o=Object.assign({totalSec:1500,startedAt:Date.now(),title:'Focus Session'},opt);
  try{ctx=ctx||new(window.AudioContext||window.webkitAudioContext)();ctx.resume()}catch(e){}
  cancelAnimationFrame(raf);state='running';$('title').textContent=o.title;
  $('lying').style.display='';$('lying').style.opacity=1;$('smoke').innerHTML='';$('done').style.display='';$('stage').classList.remove('fr-shake');
  $('center').innerHTML=`<svg width="30" height="45"><use href="#fr-hero"/></svg><div id="fr-time"></div><div id="fr-msg"></div>`;
  paintStats();place(A0);ov.style.display='flex';tick()}
function close(){cancelAnimationFrame(raf);if(ov)ov.style.display='none';state='idle';try{o&&o.onClose&&o.onClose()}catch(e){}}
window.FocusRescue={open,close};
})();
/* ===== END LAYER: Focus Rescue ===== */
