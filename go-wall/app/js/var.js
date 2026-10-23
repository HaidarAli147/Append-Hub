/* Go-Wall VAR: multiple phone cameras, controller review and live announcements. */
(()=>{
'use strict';
const pair=()=>window.GoWallPair;
const params=new URLSearchParams(location.search);
const camCode=params.get('var-camera');
const requestedCam=camCode!==null;
const validCam=/^\d{8}$/.test(camCode||'');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const css=document.createElement('style');css.textContent='#gw-var{border:2px solid white;padding:16px;margin:16px var(--gutter)}#gw-var button,#gw-var input{padding:10px;margin:5px;background:white;color:#30213f;border:0;font:inherit}#gw-var video{max-width:100%;background:#160e1d;min-height:120px}#gw-var-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}#gw-var-grid article{border:1px solid white;padding:10px}#gw-var-status{overflow-wrap:anywhere}body.gw-controller #gw-var{display:block}body.gw-controller #gw-var video{max-height:260px}body.gw-var-camera header,body.gw-var-camera main,body.gw-var-camera footer,body.gw-var-camera #gowall-remote,body.gw-var-camera .notes{display:none!important}body.gw-var-camera #gw-var{margin:12px;min-height:85vh}#gw-var[hidden]{display:none!important}';document.head.append(css);
const section=document.createElement('section');section.id='gw-var';section.hidden=true;
section.innerHTML='<h2>📹 VAR · Camera & microphone</h2><p id="gw-var-status" role="status">Choose Controller on the phone first.</p><div id="gw-var-hub" hidden><p>Connect extra phones as cameras. Camera feeds stay in the controller for review.</p><div id="gw-var-link"></div><div id="gw-var-grid"></div><div><button id="gw-var-mic">🎙 Start live announcement</button><button id="gw-var-stop" disabled>■ Stop announcement</button></div><p>Allow microphone access on the controller to speak through the display device.</p></div><div id="gw-var-cam" hidden><p>Camera device: choose Start Camera and allow access. Keep this page open.</p><button id="gw-var-start">📷 Start camera</button><button id="gw-var-switch" disabled>↻ Switch camera</button><video id="gw-var-self" autoplay playsinline muted></video></div>';
document.body.append(section);
const $=id=>document.getElementById(id),status=t=>$('gw-var-status').textContent=t;
let hubPeer=null,camPeer=null,cameraStream=null,cameraFacing='environment',micStream=null,micCall=null;
const roleBox=document.querySelector('#gowall-remote .gw-actions');
if(roleBox){const button=document.createElement('button');button.id='gw-var-role';button.textContent='📹 VAR Camera';roleBox.append(button);button.onclick=()=>{const entered=prompt('Enter the 8-digit display pairing code:');if(entered===null)return;if(!/^\d{8}$/.test(entered.trim())){status('Enter the same 8-digit code shown on the display.');section.hidden=false;return}location.href=location.pathname+'?var-camera='+encodeURIComponent(entered.trim())};}
const feeds=new Map();let cameraCounter=0;
function stopFeed(id){
 const f=feeds.get(id);if(!f)return;
 feeds.delete(id);
 f.active=false;
 if(f.timer)clearTimeout(f.timer);
 if(f.rec&&f.rec.state!=='inactive')try{f.rec.stop()}catch{}
 f.call.close();
 f.chunks.forEach(x=>URL.revokeObjectURL(x.url));
 const replay=f.element.querySelector('.gw-replay-video');if(replay){replay.pause();replay.removeAttribute('src');replay.load()}
 f.element.remove();
}
function attachCamera(call){
 const id=String(++cameraCounter);
 call.answer();
 call.on('stream',stream=>{
  const card=document.createElement('article');
  card.innerHTML='<strong>Camera '+id+'</strong><video autoplay playsinline muted></video><div><button class="gw-replay" disabled>▶ Replay last clip</button><button class="gw-live">● Live</button></div><video class="gw-replay-video" controls playsinline hidden></video>';
  $('gw-var-grid').append(card);
  const live=card.querySelector('video'),replay=card.querySelector('.gw-replay-video'),replayButton=card.querySelector('.gw-replay');
  live.srcObject=stream;live.play().catch(()=>{});
  const f={call,element:card,chunks:[],rec:null,timer:null,active:true};
  feeds.set(id,f);
  // MediaRecorder timeslice blobs may not be independently playable. Finalize each
  // recording before offering it for replay; retain the most recent three clips.
  const mime=window.MediaRecorder&&['video/mp4','video/webm;codecs=vp8','video/webm'].find(t=>MediaRecorder.isTypeSupported(t));
  if(window.MediaRecorder){
   const recordNext=()=>{
    if(!f.active||!stream.getVideoTracks().some(t=>t.readyState==='live'))return;
    try{
     const rec=new MediaRecorder(stream,mime?{mimeType:mime}:undefined);
     f.rec=rec;
     const parts=[];
     rec.ondataavailable=e=>{if(e.data.size)parts.push(e.data)};
     rec.onstop=()=>{
      if(!f.active)return;
      if(parts.length){
       const blob=new Blob(parts,{type:rec.mimeType||parts[0].type||'video/webm'});
       const url=URL.createObjectURL(blob);
       f.chunks.push({url,type:blob.type});
       while(f.chunks.length>3)URL.revokeObjectURL(f.chunks.shift().url);
       replayButton.disabled=false;
      }
      recordNext();
     };
     rec.onerror=()=>{status('Camera '+id+': replay recording failed. Live video is still available.');f.active=false};
     rec.start();
     f.timer=setTimeout(()=>{if(rec.state==='recording')rec.stop()},8000);
    }catch(e){status('Camera '+id+': recording not supported on this device.');console.warn('VAR recording unavailable',e)}
   };
   recordNext();
  }else status('Camera '+id+': this browser does not support video recording.');
  replayButton.onclick=()=>{
   const clip=f.chunks.at(-1);
   if(!clip)return status('Replay is not ready yet. The first clip takes about 8 seconds.');
   replay.pause();replay.src=clip.url;replay.hidden=false;live.hidden=true;
   replay.load();replay.play().catch(()=>status('Playback blocked or unsupported on this browser. Use Live to return to the camera.'));
  };
  card.querySelector('.gw-live').onclick=()=>{
   replay.pause();replay.hidden=true;live.hidden=false;live.play().catch(()=>{});
  };
  status('Camera '+id+' connected. Replay will be ready after the first 8-second clip.');
 });
 call.on('close',()=>stopFeed(id));call.on('error',()=>stopFeed(id));
}
function setupHub(code){
 if(hubPeer)return;section.hidden=false;$('gw-var-hub').hidden=false;
 if(!/^\d{8}$/.test(code||''))return status('Connect the controller to the display to share its pairing code.');
 if(!window.Peer)return status('PeerJS is unavailable. Internet is required for pairing.');
 hubPeer=new Peer('gowall-var-'+code,{config:{iceServers:[{urls:'stun:stun.l.google.com:19302'}]}});
 hubPeer.on('open',()=>{const link=location.origin+location.pathname+'?var-camera='+code;$('gw-var-link').innerHTML='<p>Display and camera code: <b>'+code+'</b></p><p><a href="'+esc(link)+'" target="_blank" rel="noopener">'+esc(link)+'</a></p>';status('Share the link or code with camera devices.')});
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
 if(!pair()?.connected||!pair()?.peer||!pair()?.displayPeerId)return status('Pair the controller with the scoreboard first.');
 try{micStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true},video:false});
 micCall=pair().peer.call(pair().displayPeerId,micStream);
 if(!micCall)throw Error('Display connection not ready');
 micCall.on('close',()=>{if(micStream)stopMic()});
 micCall.on('error',()=>{if(micStream)stopMic()});
 $('gw-var-mic').disabled=true;$('gw-var-stop').disabled=false;status('Microphone announcement is live on the scoreboard.');
 }catch(e){micStream?.getTracks().forEach(t=>t.stop());status('Microphone failed: '+e.message)}
}
function stopMic(){micCall?.close();micCall=null;micStream?.getTracks().forEach(t=>t.stop());micStream=null;$('gw-var-mic').disabled=false;$('gw-var-stop').disabled=true;status('Announcement stopped.')}
$('gw-var-mic').onclick=startMic;$('gw-var-stop').onclick=stopMic;
if(requestedCam){document.body.classList.add('gw-var-camera');section.hidden=false;$('gw-var-cam').hidden=false;status(validCam?'Camera mode. Connect to controller code '+camCode+'.':'Invalid camera code. Open a new link from the controller.');$('gw-var-start').disabled=!validCam}
else {document.addEventListener('gowall-paired',e=>{if(pair()?.role==='controller')setupHub(e.detail.code)});document.addEventListener('gowall-role',e=>{if(e.detail.role==='controller'){section.hidden=false;$('gw-var-hub').hidden=false;status('Connect to the display to use its pairing code for all cameras.')}if(e.detail.role==='display'){section.hidden=true;const wait=setInterval(()=>{const p=pair()?.peer;if(!p)return;clearInterval(wait);p.on('call',call=>{if(call.peer!==pair()?.remotePeerId){call.close();return}call.answer();call.on('stream',stream=>{const audio=document.createElement('audio');audio.autoplay=true;audio.srcObject=stream;audio.setAttribute('playsinline','');document.body.append(audio);audio.play().catch(()=>{});const cleanup=()=>{audio.pause();audio.srcObject=null;audio.remove()};call.on('close',cleanup);call.on('error',cleanup)})})},100)}});}
})();