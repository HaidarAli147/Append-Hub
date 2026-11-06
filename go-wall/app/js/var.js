/* Goaaal VAR: multiple phone cameras, controller review and live announcements. */
(()=>{
'use strict';
const pair=()=>window.GoWallPair;
const params=new URLSearchParams(location.search);
const camCode=params.get('var-camera');
const requestedCam=camCode!==null;
const matchViewRequested=params.has('match-view');
const matchViewCode=params.get('match-view')||'';
const validCam=/^\d{8}$/.test(camCode||'');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const css=document.createElement('style');css.textContent='#gw-var{border:2px solid white;padding:16px;margin:16px var(--gutter)}#gw-var button,#gw-var input{padding:10px;margin:5px;background:white;color:#30213f;border:0;font:inherit}#gw-var video{max-width:100%;background:#160e1d;min-height:120px}#gw-var-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}#gw-var-grid article{border:1px solid white;padding:10px}#gw-var-status{overflow-wrap:anywhere}body.gw-controller #gw-var{display:block}body.gw-controller #gw-var video{max-height:260px}body.gw-var-camera header,body.gw-var-camera main,body.gw-var-camera footer,body.gw-var-camera #gowall-remote,body.gw-var-camera .notes,body.gw-match-view header,body.gw-match-view main,body.gw-match-view footer,body.gw-match-view #gowall-remote,body.gw-match-view .notes,body.gw-match-view .mast,body.gw-match-view .tv-exit{display:none!important}body.gw-var-camera #gw-var{margin:12px;min-height:85vh}body.gw-match-view #gw-var{margin:0;min-height:100vh;box-sizing:border-box;background:#101321;color:#fff;border:none}#gw-match-video{display:block;width:100%;height:min(75vh,850px);object-fit:contain;background:#000}#gw-match-viewer input{font-size:22px;max-width:180px}#gw-var[hidden]{display:none!important}';document.head.append(css);
const section=document.createElement('section');section.id='gw-var';section.hidden=true;
section.innerHTML='<h2>📹 VAR · Camera & microphone</h2><p id="gw-var-status" role="status">Choose Controller on the phone first.</p><div id="gw-var-hub" hidden><p>Connect extra phones as cameras. Camera feeds stay in the controller for review.</p><div id="gw-var-link"></div><div id="gw-match-link"></div><p>To show the actual match on Retro TV or another screen, open Live Match Viewer there and enter this session code. Select a camera using its <b>📺 Send live match</b> button.</p><div><button id="gw-record-start">⏺ Record whole match (all cameras)</button><button id="gw-record-stop" disabled>■ Stop recording</button><button id="gw-record-save" disabled>💾 Save all camera recordings (ZIP)</button></div><p id="gw-record-note">Recordings are kept temporarily on this controller until downloaded. Keep it open, and save before closing.</p><p>Instant replays are kept only in this browser tab (latest completed 15-second segment per camera). They are deleted on refresh or close. Use Save replay to keep a copy.</p><div id="gw-var-grid"></div><div><button id="gw-var-mic">🎙 Start live announcement</button><button id="gw-var-stop" disabled>■ Stop announcement</button></div><p>Allow microphone access on the controller to speak through the display device.</p></div><div id="gw-match-viewer" hidden><h2>📺 Goaaal · Live Match Viewer</h2><p>Live camera video only. No scoreboard.</p><label>Match code <input id="gw-match-code" inputmode="numeric" maxlength="8" placeholder="8-digit code"></label><button id="gw-match-connect">▶ Connect to live match</button><p id="gw-match-status" role="status">Enter the code from the Goaaal controller.</p><video id="gw-match-video" autoplay playsinline controls></video></div><div id="gw-var-cam" hidden><p>Camera device: choose Start Camera and allow access. Keep this page open.</p><label>Camera name <input id="gw-var-name" maxlength="40" placeholder="Goal line camera"></label><button id="gw-var-start">📷 Start camera</button><button id="gw-var-switch" disabled>↻ Switch camera</button><video id="gw-var-self" autoplay playsinline muted></video></div>';
document.body.append(section);
const $=id=>document.getElementById(id),status=t=>$('gw-var-status').textContent=t;
let hubPeer=null,camPeer=null,cameraStream=null,cameraFacing='environment',micStream=null,micCall=null,camData=null,broadcastCall=null,broadcastFeed=null,broadcastMode=null;
let announcementAudio=null;
const enableAudioButton=document.createElement('button');
enableAudioButton.id='gw-enable-announcement-audio';
enableAudioButton.textContent='🔊 Enable announcement audio';
enableAudioButton.hidden=true;
enableAudioButton.style.cssText='position:fixed;right:12px;bottom:70px;z-index:2147483646;padding:15px;background:#fff;color:#251331;font-weight:bold;border:2px solid #7851a9;border-radius:9px';
document.body.append(enableAudioButton);
function showAudioEnable(message){
 enableAudioButton.hidden=false;
 enableAudioButton.textContent=message||'🔊 Tap to enable announcement audio';
}
async function playAnnouncement(){
 if(!announcementAudio)return;
 try{
  announcementAudio.muted=false;announcementAudio.volume=1;
  await announcementAudio.play();
  enableAudioButton.hidden=true;
 }catch(e){showAudioEnable('🔊 Tap to hear announcements');}
}
enableAudioButton.addEventListener('click',()=>{
 try{voiceCtx()?.resume?.();}catch{}
 try{actx?.resume?.();}catch{}
 playAnnouncement();
});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&announcementAudio)playAnnouncement()});
const cameraNames=new Map();
const REPLAY_WINDOW_MS=15000;
// Replay clips live in memory only. Closing or refreshing the page clears them.
window.addEventListener('pagehide',()=>{
 for(const f of feeds.values()){
  if(f.timer)clearTimeout(f.timer);
  if(f.rec?.state==='recording')try{f.rec.stop()}catch{}
  for(const clip of f.chunks)URL.revokeObjectURL(clip.url);
  if(f.selectedClip&&!f.chunks.includes(f.selectedClip))URL.revokeObjectURL(f.selectedClip.url);
 }
});
let recordingMatch=false;
const savedRecordings=[];
function extension(blob){return /mp4/i.test(blob.type)?'mp4':'webm'}
function recordingName(name,blob){return 'Goaaal-'+String(name||'Camera').replace(/[^a-z0-9_-]+/gi,'-')+'-'+new Date().toISOString().replace(/[:.]/g,'-')+'.'+extension(blob)}
function downloadBlob(blob,name){
 const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
}
async function saveClip(blob,name){
 if(!blob)return status('Nothing recorded yet.');
 const file=new File([blob],name,{type:blob.type||'video/webm'});
 if(navigator.canShare?.({files:[file]})&&navigator.share){
  try{await navigator.share({files:[file],title:'Goaaal recording'});return}catch(e){if(e.name==='AbortError')return}
 }
 downloadBlob(blob,name);
}
function startFullRecorder(f){
 if(!recordingMatch||!f.active||!window.MediaRecorder||!f.stream?.active)return;
 try{
  const mime=['video/mp4','video/webm;codecs=vp8','video/webm'].find(t=>MediaRecorder.isTypeSupported(t));
  const recorder=new MediaRecorder(f.stream,mime?{mimeType:mime}:undefined),parts=[];
  f.fullRecorder=recorder;
  recorder.ondataavailable=e=>{if(e.data.size)parts.push(e.data)};
  recorder.onstop=()=>{
   if(parts.length){const blob=new Blob(parts,{type:recorder.mimeType||'video/webm'});savedRecordings.push({name:recordingName(f.element.querySelector('.gw-camera-name')?.textContent,blob),blob});$('gw-record-save').disabled=false;f.fullBlob=blob;f.element.querySelector('.gw-save-match')?.removeAttribute('disabled')}
   f.fullRecorder=null;
  };
  recorder.onerror=()=>status('Full-match recording error on '+f.element.querySelector('.gw-camera-name')?.textContent);
  recorder.start(30000);
 }catch(e){status('Recording not supported: '+e.message)}
}
function stopFullRecorder(f){
 return new Promise(resolve=>{
  const rec=f.fullRecorder;
  if(!rec||rec.state==='inactive')return resolve();
  rec.addEventListener('stop',resolve,{once:true});
  try{rec.stop()}catch{resolve()}
 });
}
$('gw-record-start').onclick=()=>{
 if(!feeds.size)return status('Connect at least one camera first.');
 savedRecordings.length=0;recordingMatch=true;
 for(const f of feeds.values())startFullRecorder(f);
 $('gw-record-start').disabled=true;$('gw-record-stop').disabled=false;$('gw-record-save').disabled=true;
 status('Recording each connected camera. Save the recordings before closing the controller.');
};
$('gw-record-stop').onclick=async()=>{
 recordingMatch=false;
 await Promise.all([...feeds.values()].map(stopFullRecorder));
 $('gw-record-start').disabled=false;$('gw-record-stop').disabled=true;
 $('gw-record-save').disabled=!savedRecordings.length;
 status('Recording stopped. Download your files to keep them.');
};
$('gw-record-save').onclick=async()=>{
 if(!savedRecordings.length)return status('Stop the match recording first.');
 if(typeof JSZip==='undefined')return status('ZIP export unavailable. Use each camera’s Save match button.');
 try{
  const zip=new JSZip();for(const f of savedRecordings)zip.file(f.name,f.blob);
  status('Preparing your camera recordings…');
  downloadBlob(await zip.generateAsync({type:'blob',compression:'STORE'}),'Goaaal-match-cameras.zip');
  status('ZIP downloaded. Extract it to view a separate video from every connected camera.');
 }catch(e){status('Could not export recordings: '+e.message)}
};

const roleBox=document.querySelector('#gowall-remote .gw-actions');
const watchLink=document.createElement('a');
watchLink.href=location.pathname+'?match-view';
watchLink.textContent='📺 Open Live Match Viewer (video only)';
watchLink.style.cssText='display:inline-block;margin:8px 0;padding:12px 16px;border:2px solid currentColor;color:inherit;font-weight:bold';
watchLink.id='gw-open-match-viewer';
const remoteBox=document.getElementById('gowall-remote');
if(remoteBox&&!matchViewRequested&&!requestedCam)remoteBox.append(watchLink);
if(roleBox){const button=document.createElement('button');button.id='gw-var-role';button.textContent='📹 VAR Camera';roleBox.append(button);button.onclick=()=>{const entered=prompt('Enter the 8-digit display pairing code:');if(entered===null)return;if(!/^\d{8}$/.test(entered.trim())){status('Enter the same 8-digit code shown on the display.');section.hidden=false;return}location.href=location.pathname+'?var-camera='+encodeURIComponent(entered.trim())};}
const feeds=new Map();let cameraCounter=0;
const blockedCameras=new Set();
const cameraChannels=new Map();
const matchViewers=new Map(); // peer ID -> {channel, call}
let selectedMatchFeed=null;
function matchViewerLink(code){return location.origin+location.pathname+'?match-view='+encodeURIComponent(code)}
function stopMatchViewerCalls(){
 for(const viewer of matchViewers.values()){if(viewer.call){viewer.call.close();viewer.call=null}}
}
function startMatchViewerCall(viewer){
 if(!selectedMatchFeed?.active||!selectedMatchFeed.stream?.getVideoTracks().some(t=>t.readyState==='live')||!hubPeer?.open)return;
 if(viewer.call){viewer.call.close();viewer.call=null}
 try{
  const call=hubPeer.call(viewer.channel.peer,selectedMatchFeed.stream,{metadata:{kind:'match-live'}});
  if(!call)throw Error('Viewer call unavailable');
  viewer.call=call;
  call.on('error',()=>{if(viewer.call===call){viewer.call=null;status('Live match viewer connection failed. Reconnect viewer if needed.')}});
  call.on('close',()=>{if(viewer.call===call)viewer.call=null});
 }catch(e){status('Could not share live match: '+e.message)}
}
function sendLiveMatch(f){
 if(!f.active||!f.stream?.getVideoTracks().some(t=>t.readyState==='live'))return status('Camera is not ready.');
 selectedMatchFeed=f;
 stopMatchViewerCalls();
 for(const viewer of matchViewers.values())startMatchViewerCall(viewer);
 for(const feed of feeds.values()){
  const button=feed.element.querySelector('.gw-match-send');
  if(button)button.textContent=feed===f?'● Sending live match':'📺 Send live match';
 }
 status('Live match camera selected: '+f.element.querySelector('.gw-camera-name').textContent+'. Connect a viewer using the code or QR above.');
}

function setCameraName(peerId,name){
 const safe=String(name||'').trim().slice(0,40)||'Unnamed camera';
 cameraNames.set(peerId,safe);
 for(const f of feeds.values())if(f.call.peer===peerId)f.element.querySelector('.gw-camera-name').textContent=safe;
}
function stopBroadcast(){
 const call=broadcastCall;broadcastCall=null;broadcastFeed=null;broadcastMode=null;
 if(pair()?.role==='controller')pair()?.sendVarMessage?.({type:'var-stop'});
 if(call)call.close();
 for(const f of feeds.values()){const btn=f.element.querySelector('.gw-broadcast');if(btn)btn.textContent='📺 Show on display'}
}
async function broadcastCamera(f){
 if(broadcastFeed===f){stopBroadcast();status('Broadcast stopped.');return}
 if(!pair()?.connected||!pair()?.peer||!pair()?.displayPeerId)return status('Pair the controller with the display first.');
 const replay=f.element.querySelector('.gw-replay-video');
 const isReplay=!replay.hidden&&replay.src;
 if(isReplay){
  const clip=f.selectedClip||f.chunks.at(-1);
  if(!clip)return status('Select a recorded replay first.');
  stopBroadcast();
  try{
   const blob=await fetch(clip.url).then(r=>r.blob());
   const bytes=await blob.arrayBuffer();
   pair().sendVarMessage({type:'var-replay',bytes,mime:blob.type||clip.type});
   broadcastFeed=f;broadcastMode='replay';
   f.element.querySelector('.gw-broadcast').textContent='■ Stop display broadcast';
   status('Showing replay on display.');
  }catch(err){status('Could not send replay: '+err.message)}
  return;
 }
 const stream=f.element.querySelector('video')?.srcObject;
 if(!stream?.getVideoTracks().length)return status('Camera is not ready.');
 stopBroadcast();
 try{
  const call=pair().peer.call(pair().displayPeerId,stream,{metadata:{kind:'var-broadcast'}});
  if(!call)throw Error('Display connection not ready');
  broadcastCall=call;broadcastFeed=f;broadcastMode='live';
  call.on('close',()=>{if(broadcastCall===call)stopBroadcast()});
  call.on('error',()=>{if(broadcastCall===call){stopBroadcast();status('Broadcast connection lost.')}});
  f.element.querySelector('.gw-broadcast').textContent='■ Stop display broadcast';
  status('Showing live camera on display.');
 }catch(err){status('Broadcast failed: '+err.message)}
}
function stopFeed(id){
 const f=feeds.get(id);if(!f)return;
 feeds.delete(id);
 if(broadcastFeed===f)stopBroadcast();
 if(selectedMatchFeed===f){selectedMatchFeed=null;stopMatchViewerCalls();status('Selected live match camera disconnected. Select another camera.')}
 if(f.fullRecorder&&f.fullRecorder.state!=='inactive')stopFullRecorder(f);
 f.active=false;
 if(f.timer)clearTimeout(f.timer);
 if(f.rec&&f.rec.state!=='inactive')try{f.rec.stop()}catch{}
 f.call.close();
 f.element.querySelector('video')?.pause();
 f.element.querySelector('video')?.srcObject && (f.element.querySelector('video').srcObject=null);
 f.chunks.forEach(x=>URL.revokeObjectURL(x.url));
 if(f.selectedClip&&!f.chunks.includes(f.selectedClip))URL.revokeObjectURL(f.selectedClip.url);
 const replay=f.element.querySelector('.gw-replay-video');if(replay){replay.pause();replay.removeAttribute('src');replay.load()}
 f.element.remove();
}
function attachCamera(call){
 if(blockedCameras.has(call.peer)){call.close();return}
 const id=String(++cameraCounter);
 call.answer();
 call.on('stream',stream=>{
  const card=document.createElement('article');
  card.innerHTML='<strong class="gw-camera-name"></strong><video autoplay playsinline muted></video><div><button class="gw-replay" disabled>▶ Replay last 15 sec</button><button class="gw-save-replay" disabled>⬇ Save replay</button><button class="gw-save-match" disabled>⬇ Save match</button><button class="gw-live">● Live</button><button class="gw-broadcast">📺 Show on display</button><button class="gw-match-send">📺 Send live match</button><button class="gw-remove">✕ Remove camera</button></div><video class="gw-replay-video" controls playsinline hidden></video>';
  $('gw-var-grid').append(card);
  const live=card.querySelector('video'),replay=card.querySelector('.gw-replay-video'),replayButton=card.querySelector('.gw-replay');
  live.srcObject=stream;live.play().catch(()=>{});
  const f={call,element:card,chunks:[],rec:null,timer:null,active:true,stream,fullRecorder:null,fullBlob:null};
  feeds.set(id,f);
  setCameraName(call.peer,cameraNames.get(call.peer)||'Camera '+id);
  if(recordingMatch)startFullRecorder(f);
  card.querySelector('.gw-broadcast').onclick=()=>broadcastCamera(f);
  card.querySelector('.gw-match-send').onclick=()=>sendLiveMatch(f);
  card.querySelector('.gw-remove').onclick=()=>{const name=card.querySelector('.gw-camera-name').textContent;if(!confirm('Remove '+name+' from VAR?'))return;blockedCameras.add(call.peer);const channel=cameraChannels.get(call.peer);if(channel?.open)channel.send({type:'camera-removed'});stopFeed(id);cameraChannels.delete(call.peer);status(name+' removed from VAR.');};
  // MediaRecorder timeslice blobs may not be independently playable. Finalize each
  // recording before offering it for replay; keep only the latest finalized 15-second clip.
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
       while(f.chunks.length>1){
        const old=f.chunks.shift();
        if(old!==f.selectedClip)URL.revokeObjectURL(old.url);
       }
       replayButton.disabled=false;card.querySelector('.gw-save-replay').disabled=false;
      }
      recordNext();
     };
     rec.onerror=()=>{status('Camera '+id+': replay recording failed. Live video is still available.');f.active=false};
     rec.start();
     f.timer=setTimeout(()=>{if(rec.state==='recording')rec.stop()},REPLAY_WINDOW_MS);
    }catch(e){status('Camera '+id+': recording not supported on this device.');console.warn('VAR recording unavailable',e)}
   };
   recordNext();
  }else status('Camera '+id+': this browser does not support video recording.');
  card.querySelector('.gw-save-replay').onclick=()=>{
   const clip=f.selectedClip||f.chunks.at(-1);
   if(!clip)return status('No replay ready yet.');
   fetch(clip.url).then(r=>r.blob()).then(blob=>saveClip(blob,recordingName(card.querySelector('.gw-camera-name').textContent+'-replay',blob))).catch(e=>status('Replay download failed: '+e.message));
  };
  card.querySelector('.gw-save-match').onclick=()=>saveClip(f.fullBlob,recordingName(card.querySelector('.gw-camera-name').textContent, f.fullBlob||new Blob()));
  replayButton.onclick=()=>{
   const clip=f.chunks.at(-1);
   if(!clip)return status('Replay is not ready yet. The first complete clip takes about 15 seconds.');
   f.selectedClip=clip;replay.pause();replay.src=clip.url;replay.hidden=false;live.hidden=true;
   if(broadcastFeed===f){stopBroadcast();broadcastCamera(f)}
   replay.load();replay.play().catch(()=>status('Playback blocked or unsupported on this browser. Use Live to return to the camera.'));
  };
  card.querySelector('.gw-live').onclick=()=>{
   const selected=f.selectedClip;
   f.selectedClip=null;
   replay.removeAttribute('src');replay.load();replay.hidden=true;live.hidden=false;live.play().catch(()=>{});
   if(selected&&!f.chunks.includes(selected))URL.revokeObjectURL(selected.url);
   if(broadcastFeed===f){stopBroadcast();broadcastCamera(f)}
  };
  status('Camera '+id+' connected. A temporary 15-second replay will be ready after the first completed clip. Closing this page clears replay memory.');
 });
 call.on('close',()=>stopFeed(id));call.on('error',()=>stopFeed(id));
}
function setupHub(code){
 if(hubPeer)return;section.hidden=false;$('gw-var-hub').hidden=false;
 if(!/^\d{8}$/.test(code||''))return status('Connect the controller to the display to share its pairing code.');
 if(!window.Peer)return status('PeerJS is unavailable. Internet is required for pairing.');
 hubPeer=new Peer('gowall-var-'+code,{config:{iceServers:[{urls:'stun:stun.l.google.com:19302'}]}});
 hubPeer.on('open',()=>{const link=location.origin+location.pathname+'?var-camera='+code;$('gw-var-link').innerHTML='<p>Display and camera code: <b>'+code+'</b></p><p><a href="'+esc(link)+'" target="_blank" rel="noopener">'+esc(link)+'</a></p><div id="gw-camera-qr" style="display:inline-block;background:white;padding:12px"></div>';
   if(typeof QRCode!=='undefined')new QRCode($('gw-camera-qr'),{text:link,width:180,height:180,correctLevel:QRCode.CorrectLevel.M});
   const matchLink=matchViewerLink(code);
   $('gw-match-link').innerHTML='<h3>📺 Live Match Viewer · Retro TV</h3><p>Match code: <b>'+code+'</b></p><p><a href="'+esc(matchLink)+'" target="_blank" rel="noopener">'+esc(matchLink)+'</a></p><div id="gw-match-qr" style="display:inline-block;background:white;padding:12px"></div>';
   if(typeof QRCode!=='undefined')new QRCode($('gw-match-qr'),{text:matchLink,width:180,height:180,correctLevel:QRCode.CorrectLevel.M});
   status('Scan the QR code on another phone to add a camera.')});
 hubPeer.on('call',attachCamera);hubPeer.on('connection',c=>{if(blockedCameras.has(c.peer)){c.close();return}cameraChannels.set(c.peer,c);c.on('close',()=>{
  if(cameraChannels.get(c.peer)===c)cameraChannels.delete(c.peer);
  const viewer=matchViewers.get(c.peer);
  if(viewer?.channel===c){viewer.call?.close();matchViewers.delete(c.peer)}
 });c.on('data',m=>{
  if(m?.type==='camera-name')setCameraName(c.peer,m.name);
  if(m?.type==='match-viewer-join'){
   const viewer={channel:c,call:null};
   matchViewers.set(c.peer,viewer);
   c.send({type:'match-viewer-ack',camera:selectedMatchFeed?.element.querySelector('.gw-camera-name')?.textContent||null});
   startMatchViewerCall(viewer);
  }
 });});hubPeer.on('disconnected',()=>{status('Camera pairing signaling disconnected. Retrying…');if(!hubPeer.destroyed)hubPeer.reconnect()});hubPeer.on('error',e=>status('Camera connection error: '+e.type));
}
let cameraRetry=null,retryCount=0,cameraRemoved=false,manualSwitch=false;
function scheduleCameraRetry(){
 if(cameraRemoved||cameraRetry||!validCam)return;
 const delay=Math.min(15000,1000*Math.pow(2,Math.min(retryCount++,4)));
 status('Camera connection interrupted. Reconnecting in '+Math.ceil(delay/1000)+' seconds…');
 cameraRetry=setTimeout(()=>{cameraRetry=null;if(!cameraRemoved)connectCamera()},delay);
}
function connectCamera(){
 if(cameraRemoved||!cameraStream?.active||camPeer&&!camPeer.destroyed)return;
 if(!window.Peer)return status('Camera pairing library unavailable.');
 const p=new Peer(undefined,{config:{iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun1.l.google.com:19302'}]}});
 camPeer=p;
 p.on('open',()=>{
  if(camPeer!==p||cameraRemoved)return;
  camData=p.connect('gowall-var-'+camCode,{reliable:true});
  camData.on('open',()=>{retryCount=0;sendCameraName();status('Camera connected to controller.')});
  camData.on('data',m=>{if(m?.type==='camera-removed'){
   cameraRemoved=true;if(cameraRetry){clearTimeout(cameraRetry);cameraRetry=null}
   cameraStream?.getTracks().forEach(t=>t.stop());cameraStream=null;p.destroy();camPeer=null;camData=null;
   $('gw-var-self').srcObject=null;$('gw-var-switch').disabled=true;
   status('Camera removed by controller. Select Start Camera to join again.');
  }});
  camData.on('close',()=>{if(camPeer===p&&!cameraRemoved){p.destroy();camPeer=null;scheduleCameraRetry()}});
  const call=p.call('gowall-var-'+camCode,cameraStream);
  if(!call){p.destroy();camPeer=null;scheduleCameraRetry();return}
  call.on('close',()=>{if(camPeer===p&&!cameraRemoved){p.destroy();camPeer=null;scheduleCameraRetry()}});
  call.on('error',()=>{if(camPeer===p&&!cameraRemoved){p.destroy();camPeer=null;scheduleCameraRetry()}});
  status('Connecting camera to controller…');
 });
 p.on('disconnected',()=>{if(camPeer===p&&!p.destroyed)p.reconnect()});
 p.on('error',err=>{if(camPeer!==p||cameraRemoved)return;status('Camera connection issue: '+err.type);p.destroy();camPeer=null;scheduleCameraRetry()});
}
async function startCamera(){
 try{
  cameraRemoved=false;
  if(cameraRetry){clearTimeout(cameraRetry);cameraRetry=null}
  const old=cameraStream;
  const next=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:cameraFacing}},audio:false});
  cameraStream=next;old?.getTracks().forEach(t=>t.stop());
  $('gw-var-self').srcObject=next;$('gw-var-self').play().catch(()=>{});
  if(camPeer){camPeer.destroy();camPeer=null}
  camData=null;retryCount=0;
  connectCamera();$('gw-var-switch').disabled=false;
 }catch(e){status('Camera permission or connection failed: '+e.message)}
}
function sendCameraName(){if(camData?.open)camData.send({type:'camera-name',name:$('gw-var-name').value.trim().slice(0,40)||'Unnamed camera'})}
$('gw-var-name').addEventListener('change',()=>{localStorage.setItem('gw-var-camera-name',$('gw-var-name').value.slice(0,40));sendCameraName()});
$('gw-var-start').onclick=startCamera;
$('gw-var-switch').onclick=()=>{cameraFacing=cameraFacing==='environment'?'user':'environment';startCamera()};
async function startMic(){
 if(!pair()?.connected||!pair()?.peer||!pair()?.displayPeerId)return status('Pair the controller with the scoreboard first.');
 try{micStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true},video:false});
 micCall=pair().peer.call(pair().displayPeerId,micStream);
 if(!micCall)throw Error('Display connection not ready');
 micCall.on('close',()=>{if(micStream){stopMic();status('Announcement connection ended. Tap Start to try again.')}});
 micCall.on('error',err=>{if(micStream){stopMic();status('Announcement connection error: '+(err?.type||err?.message||'network issue')+'. Check that the display is connected and audio is enabled.')}});
 $('gw-var-mic').disabled=true;$('gw-var-stop').disabled=false;status('Microphone announcement is live on the scoreboard.');
 }catch(e){micStream?.getTracks().forEach(t=>t.stop());status('Microphone failed: '+e.message)}
}
function stopMic(){micCall?.close();micCall=null;micStream?.getTracks().forEach(t=>t.stop());micStream=null;$('gw-var-mic').disabled=false;$('gw-var-stop').disabled=true;status('Announcement stopped.')}
$('gw-var-mic').onclick=startMic;$('gw-var-stop').onclick=stopMic;
function initMatchViewer(){
 document.body.classList.add('gw-match-view');
 section.hidden=false;$('gw-var-hub').hidden=true;$('gw-var-cam').hidden=true;$('gw-match-viewer').hidden=false;
 const input=$('gw-match-code'),btn=$('gw-match-connect'),video=$('gw-match-video'),msg=$('gw-match-status');
 input.value=/^\d{8}$/.test(matchViewCode)?matchViewCode:'';
 let viewerPeer=null,viewerChannel=null,viewerCall=null;
 function setMessage(value){msg.textContent=value}
 function connect(){
  const code=input.value.trim();
  if(!/^\d{8}$/.test(code))return setMessage('Enter the 8-digit code from the Goaaal controller.');
  if(!window.Peer)return setMessage('WebRTC pairing is unavailable. Check the internet connection.');
  if(viewerPeer){viewerPeer.destroy();viewerPeer=null}
  if(viewerCall){viewerCall.close();viewerCall=null}
  video.pause();video.srcObject=null;
  setMessage('Connecting to the live match…');
  const expectedPeer='gowall-var-'+code;
  const peer=new Peer(undefined,{config:{iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun1.l.google.com:19302'}]}});
  viewerPeer=peer;
  peer.on('open',()=>{
   if(viewerPeer!==peer)return;
   const channel=peer.connect(expectedPeer,{reliable:true});
   viewerChannel=channel;
   channel.on('open',()=>{channel.send({type:'match-viewer-join'});setMessage('Connected. Waiting for the controller to select a live camera.')});
   channel.on('data',m=>{if(m?.type==='match-viewer-ack')setMessage(m.camera?'Waiting for '+m.camera+' stream…':'Connected. Select a camera on the controller.')});
   channel.on('close',()=>{if(viewerChannel===channel)setMessage('Controller disconnected. Press Connect to retry.')});
   channel.on('error',()=>setMessage('Cannot contact controller. Check the match code and network.'));
  });
  peer.on('call',call=>{
   if(call.peer!==expectedPeer||call.metadata?.kind!=='match-live'){call.close();return}
   if(viewerCall)viewerCall.close();
   viewerCall=call;
   call.answer();
   call.on('stream',stream=>{
    video.srcObject=stream;
    video.muted=false;
    video.play().then(()=>setMessage('● LIVE MATCH')).catch(()=>setMessage('Live feed received. Press Play on the video to start.'));
   });
   call.on('close',()=>{if(viewerCall===call){viewerCall=null;video.srcObject=null;setMessage('Video stopped. Waiting for another camera…')}});
   call.on('error',()=>setMessage('Live camera disconnected. Ask the controller to resend.'));
  });
  peer.on('disconnected',()=>{if(viewerPeer===peer&&!peer.destroyed)peer.reconnect()});
  peer.on('error',e=>setMessage('Connection error: '+e.type+'. Check match code or try again.'));
 }
 btn.onclick=connect;
 input.addEventListener('keydown',e=>{if(e.key==='Enter')connect()});
 if(/^\d{8}$/.test(matchViewCode))connect();
}
if(matchViewRequested){initMatchViewer()}
else if(requestedCam){$('gw-var-name').value=localStorage.getItem('gw-var-camera-name')||'';document.body.classList.add('gw-var-camera');section.hidden=false;$('gw-var-cam').hidden=false;status(validCam?'Camera mode. Connect to controller code '+camCode+'.':'Invalid camera code. Open a new link from the controller.');$('gw-var-start').disabled=!validCam;if(validCam){status('Connecting camera…');startCamera()}}
else {let currentReplayUrl=null;
document.addEventListener('gowall-var-message',e=>{
 const m=e.detail;
 if(m.type==='var-stop'){
  const overlay=document.getElementById('gw-var-display-overlay');
  if(overlay?.dataset.mode==='replay'){overlay.querySelector('video')?.pause();overlay.remove();if(currentReplayUrl)URL.revokeObjectURL(currentReplayUrl);currentReplayUrl=null}
  return;
 }
 if(m.type!=='var-replay')return;
 try{
  document.getElementById('gw-var-display-overlay')?.remove();
  if(currentReplayUrl)URL.revokeObjectURL(currentReplayUrl);
  const buffer=m.bytes instanceof ArrayBuffer?m.bytes:m.bytes?.buffer;
  if(!buffer)throw Error('Missing replay video');
  currentReplayUrl=URL.createObjectURL(new Blob([buffer],{type:m.mime||'video/mp4'}));
  const overlay=document.createElement('div');overlay.id='gw-var-display-overlay';overlay.dataset.mode='replay';overlay.style.cssText='position:fixed;inset:0;z-index:10000;background:#160e1d;display:flex;align-items:center;justify-content:center';
  const video=document.createElement('video');video.src=currentReplayUrl;video.controls=true;video.autoplay=true;video.playsInline=true;video.style.cssText='width:100%;height:100%;object-fit:contain';
  overlay.append(video);document.body.append(overlay);video.play().catch(()=>{});
 }catch(err){status('Display replay error: '+err.message)}
});
document.addEventListener('gowall-paired',e=>{if(pair()?.role==='controller')setupHub(e.detail.code)});document.addEventListener('gowall-role',e=>{if(e.detail.role==='controller'){section.hidden=false;$('gw-var-hub').hidden=false;status('First pair this controller with a display, then add a camera. The 📺 Send live match button appears below each connected camera. Live Match Viewer is a separate video-only screen.')}if(e.detail.role==='display'){section.hidden=true;showAudioEnable('🔊 Tap to enable announcement audio');const wait=setInterval(()=>{const p=pair()?.peer;if(!p)return;clearInterval(wait);p.on('call',call=>{if(call.peer!==pair()?.remotePeerId){call.close();return}
if(call.metadata?.kind==='var-broadcast'){
 call.answer();
 call.on('stream',stream=>{
  document.getElementById('gw-var-display-overlay')?.remove();
  const overlay=document.createElement('div');overlay.id='gw-var-display-overlay';overlay.style.cssText='position:fixed;inset:0;z-index:10000;background:#160e1d;display:flex;align-items:center;justify-content:center';
  const video=document.createElement('video');video.autoplay=true;video.playsInline=true;video.muted=true;video.style.cssText='width:100%;height:100%;object-fit:contain';
  video.srcObject=stream;overlay.append(video);document.body.append(overlay);video.play().catch(()=>{});
  const cleanup=()=>{overlay.remove();video.srcObject=null};call.on('close',cleanup);call.on('error',cleanup);
 });
 return;
}
call.answer();call.on('stream',stream=>{
  if(announcementAudio){announcementAudio.pause();announcementAudio.srcObject=null;announcementAudio.remove()}
  const audio=document.createElement('audio');
  announcementAudio=audio;
  audio.autoplay=true;audio.controls=false;audio.playsInline=true;
  audio.setAttribute('playsinline','');
  audio.srcObject=stream;
  audio.addEventListener('loadedmetadata',playAnnouncement);
  audio.addEventListener('canplay',playAnnouncement);
  document.body.append(audio);
  playAnnouncement();
  const cleanup=()=>{
   if(announcementAudio!==audio)return;
   audio.pause();audio.srcObject=null;audio.remove();announcementAudio=null;
   enableAudioButton.hidden=true;
  };
  call.on('close',cleanup);call.on('error',cleanup);
 })})},100)}});}
})();