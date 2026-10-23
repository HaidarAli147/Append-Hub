/* Go-Wall VAR: multiple phone cameras, controller review and live announcements. */
(()=>{
'use strict';
const pair=()=>window.GoWallPair;
const params=new URLSearchParams(location.search);
const camCode=params.get('var-camera');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const css=document.createElement('style');css.textContent='#gw-var{border:2px solid white;padding:16px;margin:16px var(--gutter)}#gw-var button,#gw-var input{padding:10px;margin:5px;background:white;color:#30213f;border:0;font:inherit}#gw-var video{max-width:100%;background:#160e1d;min-height:120px}#gw-var-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}#gw-var-grid article{border:1px solid white;padding:10px}#gw-var-status{overflow-wrap:anywhere}body.gw-controller #gw-var{display:block}body.gw-controller #gw-var video{max-height:260px}body.gw-var-camera header,body.gw-var-camera main,body.gw-var-camera footer,body.gw-var-camera #gowall-remote,body.gw-var-camera .notes{display:none!important}body.gw-var-camera #gw-var{margin:12px;min-height:85vh}#gw-var[hidden]{display:none!important}';document.head.append(css);
const section=document.createElement('section');section.id='gw-var';section.hidden=true;
section.innerHTML='<h2>📹 VAR · Camera & microphone</h2><p id="gw-var-status" role="status">Choose Controller on the phone first.</p><div id="gw-var-hub" hidden><p>Connect extra phones as cameras. Camera feeds stay in the controller for review.</p><div id="gw-var-link"></div><div id="gw-var-grid"></div><div><button id="gw-var-mic">🎙 Start live announcement</button><button id="gw-var-stop" disabled>■ Stop announcement</button></div><p>Allow microphone access on the controller to speak through the display device.</p></div><div id="gw-var-cam" hidden><p>Camera device: choose Start Camera and allow access. Keep this page open.</p><button id="gw-var-start">📷 Start camera</button><button id="gw-var-switch" disabled>↻ Switch camera</button><video id="gw-var-self" autoplay playsinline muted></video></div>';
document.body.append(section);
const $=id=>document.getElementById(id),status=t=>$('gw-var-status').textContent=t;
let hubPeer=null,camPeer=null,cameraStream=null,cameraFacing='environment',micStream=null,micCall=null,displayCall=null;
const feeds=new Map();let cameraCounter=0;
function stopFeed(id){const f=feeds.get(id);if(!f)return;f.call.close();if(f.rec&&f.rec.state!=='inactive')f.rec.stop();f.chunks.forEach(x=>URL.revokeObjectURL(x.url));f.element.remove();feeds.delete(id)}
function attachCamera(call){
 const id=String(++cameraCounter);
 call.answer();call.on('stream',stream=>{
  const card=document.createElement('article');card.innerHTML='<strong>Camera '+id+'</strong><video autoplay playsinline muted></video><div><button class="gw-replay">▶ Replay last clip</button><button class="gw-live">● Live</button></div><video class="gw-replay-video" controls playsinline hidden></video>';
  $('gw-var-grid').append(card);const live=card.querySelector('video');live.srcObject=stream;live.play().catch(()=>{});
  const f={call,element:card,chunks:[],rec:null};feeds.set(id,f);
  if(window.MediaRecorder){
   try{const mime=['video/webm;codecs=vp8,opus','video/webm','video/mp4'].find(t=>MediaRecorder.isTypeSupported(t));const rec=new MediaRecorder(stream,mime?{mimeType:mime}:undefined);f.rec=rec;
    rec.ondataavailable=e=>{if(e.data.size){const url=URL.createObjectURL(e.data);f.chunks.push({url,type:e.data.type});while(f.chunks.length>6){const old=f.chunks.shift();URL.revokeObjectURL(old.url)}}};
    rec.start(2500);
   }catch(e){console.warn('VAR recording unavailable',e)}
  }
  card.querySelector('.gw-replay').onclick=()=>{const clip=f.chunks.at(-1);if(!clip)return status('Replay is not ready yet. Wait a few seconds.');const replay=card.querySelector('.gw-replay-video');replay.src=clip.url;replay.hidden=false;live.hidden=true;replay.play().catch(()=>{})};
  card.querySelector('.gw-live').onclick=()=>{const replay=card.querySelector('.gw-replay-video');replay.pause();replay.hidden=true;live.hidden=false;live.play().catch(()=>{})};
  status('Camera '+id+' connected. '+feeds.size+' camera(s) online.');
 });
 call.on('close',()=>stopFeed(id));call.on('error',()=>stopFeed(id));
}
function setupHub(){
 if(hubPeer)return;section.hidden=false;$('gw-var-hub').hidden=false;const code=String(Math.floor(100000+Math.random()*900000));
 if(!window.Peer)return status('PeerJS is unavailable. Internet is required for pairing.');
 hubPeer=new Peer('gowall-var-'+code,{config:{iceServers:[{urls:'stun:stun.l.google.com:19302'}]}});
 hubPeer.on('open',()=>{const link=location.origin+location.pathname+'?var-camera='+code;$('gw-var-link').innerHTML='<p>Camera code: <b>'+code+'</b></p><p><a href="'+esc(link)+'" target="_blank" rel="noopener">'+esc(link)+'</a></p>';status('Share the link or code with camera devices.')});
 hubPeer.on('call',attachCamera);hubPeer.on('error',e=>status('Camera connection error: '+e.type));
}
async function startCamera(){
 try{cameraStream?.getTracks().forEach(t=>t.stop());cameraStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:cameraFacing}},audio:false});
 $('gw-var-self').srcObject=cameraStream;$('gw-var-self').play().catch(()=>{});
 if(!camPeer){camPeer=new Peer(undefined,{config:{iceServers:[{urls:'stun:stun.l.google.com:19302'}]}});camPeer.on('open',()=>{const call=camPeer.call('gowall-var-'+camCode,cameraStream);call.on('error',()=>status('Could not connect to controller.'));status('Streaming camera to controller.');});camPeer.on('error',e=>status('Camera error: '+e.type));}
 else{camPeer.destroy();camPeer=null;startCamera();return}
 $('gw-var-switch').disabled=false;
 }catch(e){status('Camera permission or connection failed: '+e.message)}
}
$('gw-var-start').onclick=startCamera;
$('gw-var-switch').onclick=()=>{cameraFacing=cameraFacing==='environment'?'user':'environment';if(camPeer){camPeer.destroy();camPeer=null}startCamera()};
async function startMic(){
 if(!pair()?.connected||!pair()?.peer)return status('Pair the controller with the scoreboard first.');
 try{micStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true},video:false});
 micCall=pair().peer.call(window.GoWallDisplayPeerId||'',micStream);
 if(!micCall||!window.GoWallDisplayPeerId)throw Error('Display connection not ready');
 $('gw-var-mic').disabled=true;$('gw-var-stop').disabled=false;status('Microphone announcement is live on the scoreboard.');
 }catch(e){micStream?.getTracks().forEach(t=>t.stop());status('Microphone failed: '+e.message)}
}
function stopMic(){micCall?.close();micCall=null;micStream?.getTracks().forEach(t=>t.stop());micStream=null;$('gw-var-mic').disabled=false;$('gw-var-stop').disabled=true;status('Announcement stopped.')}
$('gw-var-mic').onclick=startMic;$('gw-var-stop').onclick=stopMic;
if(camCode){document.body.classList.add('gw-var-camera');section.hidden=false;$('gw-var-cam').hidden=false;status('Camera mode. Connect to controller code '+camCode+'.')}
else document.addEventListener('gowall-role',e=>{if(e.detail.role==='controller')setupHub();if(e.detail.role==='display'){section.hidden=true;const wait=setInterval(()=>{const p=pair()?.peer;if(!p)return;clearInterval(wait);p.on('call',call=>{call.answer();call.on('stream',stream=>{const audio=document.createElement('audio');audio.autoplay=true;audio.srcObject=stream;audio.play().catch(()=>{});call.on('close',()=>audio.remove())})})},100)}});
})();