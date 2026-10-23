/* Go-Wall browser pairing. PeerJS signaling only; WebRTC host candidates restrict media/data to LAN. */
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const box=document.createElement('section');
box.id='gowall-remote';box.className='no-tv';
box.innerHTML='<h2>📱 Go-Wall · Two devices</h2><p>Open this same page on both devices, connected to the same Wi-Fi. Choose a role below.</p><div class="gw-actions"><button id="gw-display">🖥️ Display</button><button id="gw-control">📱 Controller</button></div><div id="gw-details" role="status"></div><div id="gw-controls" hidden><div id="gw-score">0 : 0</div><div id="gw-names"></div><div class="gw-actions"><button data-gw="toggle">▶ / ⏸ Clock</button><button data-gw="undo">↶ Undo</button><button data-gw="one">+1 Team 1</button><button data-gw="two">+1 Team 2</button><button data-gw="minusone">−1 Team 1</button><button data-gw="minustwo">−1 Team 2</button><button data-gw="voice">🎙 Commentator ON/OFF</button><button data-gw="testvoice">🔈 Test commentator</button><button data-gw="sound">🔊 Sound</button></div><div class="gw-actions"><button data-gw="football">Football</button><button data-gw="handball">Handball</button><button data-gw="tennis">Tennis</button><button data-gw="thirty">Thirty</button></div><div id="gw-thirty-controls" class="gw-actions"></div><div class="gw-actions"></div></div>';
document.querySelector('.mast')?.after(box);
const style=document.createElement('style');style.textContent='#gowall-remote{margin:16px var(--gutter);padding:20px;border:2px solid white}#gowall-remote h2{margin:0 0 8px}.gw-actions{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.gw-actions button{padding:10px;background:#fff;color:#352246;border:0;font-weight:700}#gw-score{font-size:42px;font-weight:bold}#gw-details{overflow-wrap:anywhere}body.gw-controller .mast,body.gw-controller main,body.gw-controller .notes,body.gw-controller footer{display:none!important}body.gw-controller #gowall-remote{min-height:80vh}body.gw-controller #gw-controls:not([hidden]){display:block}';document.head.append(style);
let peer=null,connection=null,role=null,connected=false;
const details=$('gw-details');
function message(t){details.textContent=t}
function initPeer(id,cb){
 if(!window.Peer){message('Pairing library unavailable. Check internet connection.');return}
 peer=new Peer(id,{config:{iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun1.l.google.com:19302'}]},debug:1});
 peer.on('open',cb);
 peer.on('error',err=>{message('Pairing error: '+err.type+'. Refresh both devices and retry.');console.error('Go-Wall pairing',err)});
 peer.on('disconnected',()=>message('Signaling disconnected. Reopen the page to retry.'));
}
function snapshot(){return {sport:state.sport,fb:state.fb,hb:state.hb,tn:state.tn,thirty:Thirty.snapshot(),lang:state.lang,run:{...run}}}
function sync(){if(role==='display'&&connected&&connection?.open)connection.send({type:'state',data:snapshot()})}
function command(action,data={}){
 if(role==='controller'&&connection?.open)connection.send({type:'command',action,data});
}
function handle(c){
 if(connection?.open){c.close();return}
 connection=c;
 c.on('open',()=>{connected=true;message(role==='display'?'Controller connected. Keep this screen open.':'Paired! Control the scoreboard below.');if(role==='controller')$('gw-controls').hidden=false;if(role==='display')sync()});
 c.on('close',()=>{connected=false;$('gw-controls').hidden=true;message('Connection lost. Reload both devices to reconnect.')});
 c.on('error',err=>{connected=false;$('gw-controls').hidden=true;message('Connection error. Check that both devices are on the same Wi-Fi.');console.error('Go-Wall channel',err)});
 c.on('data',m=>{
  if(!m||typeof m!=='object')return;
  if(role==='controller'&&m.type==='state'){
   const s=m.data;if(!s||!['football','handball','tennis','thirty'].includes(s.sport))return;
   const names=s.sport==='football'?s.fb?.teams:s.sport==='handball'?s.hb?.teams:null;
   $('gw-score').textContent=s.sport==='thirty'?(s.thirty?.players||[]).map(p=>p.score).join(' · '):names?names.map(t=>t.score).join(' : '):(s.tn?.pts||[0,0]).join(' : ');
   $('gw-names').textContent=s.sport==='thirty'?(s.thirty?.players||[]).map(p=>p.name).join(' · '):names?names.map(t=>t.name).join(' · '):(s.tn?.names||[]).join(' · ');
   $('gw-thirty-controls').innerHTML=s.sport==='thirty'?(s.thirty?.players||[]).map(p=>'<div><b>'+p.name.replace(/[&<>]/g,'')+' ('+p.score+'/30)</b><button data-gw-thirty="touch" data-id="'+p.id+'">Touch</button><button data-gw-thirty="award" data-kind="normal" data-id="'+p.id+'">+1</button><button data-gw-thirty="award" data-kind="volley" data-id="'+p.id+'">+5</button><button data-gw-thirty="award" data-kind="double" data-id="'+p.id+'">+30</button></div>').join(''):'';
   box.dataset.sport=s.sport;
  }
  if(role==='display'&&m.type==='command'){
   if(m.action==='testvoice'){try{voiceCtx().resume().then(()=>speak(['voice_on'],true)).catch(()=>{});}catch{}return;}
   const a=m.action,d=m.data||{};
   if(a==='thirty'){if(['touch','award','undo','clear'].includes(d.action))Thirty.perform(d.action,d);sync();return;}
   if(!['toggle','undo','voice','sound','sport','score','tn-point'].includes(a))return;
   if(a==='sport'&&!['football','handball','tennis','thirty'].includes(d.sport))return;
   if(a==='score'&&(!['fb','hb'].includes(d.sport)||![0,1].includes(d.team)||![-1,1].includes(d.delta)))return;
   if(a==='tn-point'&&![0,1].includes(d.p))return;
   if(a==='score'&&d.delta===1){
    // Remote goals cannot open the scorer dialog on the display: announce immediately.
    const T=state[d.sport].teams[d.team];if(!T)return;
    mutate(()=>{T.score+=1;if(d.sport==='fb')state.fb.log.unshift({icon:'⚽',team:d.team,label:fbLabel()});});
    sound('goal');announceGoal(d.sport,d.team,'');sync();return;
   }
   Promise.resolve(actions[a](d)).then(sync).catch(()=>{});
  }
 });
}
$('gw-display').onclick=()=>{
 if(peer)return;
 role='display';const code=String(Math.floor(10000000+Math.random()*90000000));
 message('Creating display session…');
 // This tap unlocks the display's Web Audio before remote events arrive.
 try{voiceCtx();vctx?.resume();actx?.resume?.();}catch{}
 initPeer('gowall-'+code,()=>{
  message('Pairing code: '+code+' · Open this page on your phone, select Controller, and enter the code.');
  peer.on('connection',handle);
  if(!document.body.classList.contains('tv'))toggleTv();
  const badge=document.createElement('div');badge.textContent='Go-Wall code: '+code;badge.style.cssText='position:fixed;z-index:9999;top:8px;left:8px;background:#2a1a3d;color:white;padding:8px;font:18px sans-serif';document.body.append(badge);
  setInterval(sync,500);
 });
};
$('gw-control').onclick=()=>{
 if(peer)return;
 role='controller';document.body.classList.add('gw-controller');
 const label=document.createElement('label');label.textContent='Display pairing code: ';
 const input=document.createElement('input');input.inputMode='numeric';input.maxLength=8;input.placeholder='8 digits';input.style.cssText='font:inherit;color:#222;background:white;width:150px;padding:8px';
 const button=document.createElement('button');button.textContent='Connect';button.style.cssText='padding:8px;margin:8px;background:white;color:#222';
 label.append(input,button);details.replaceChildren(label);button.disabled=true;button.title='Preparing connection';
 initPeer(undefined,()=>{button.disabled=false;button.title='';button.onclick=()=>{
  if(!/^\d{8}$/.test(input.value)){message('Enter the 8-digit code shown on the display.');return}
  message('Connecting…');const c=peer.connect('gowall-'+input.value,{reliable:true});handle(c);
 };});
};
box.addEventListener('click',e=>{
 const th=e.target.closest('[data-gw-thirty]');if(th){command('thirty',{action:th.dataset.gwThirty,id:th.dataset.id,kind:th.dataset.kind});return}
 const a=e.target.closest('[data-gw]')?.dataset.gw;if(!a)return;if(!connected){message('Not paired yet. Enter the display code and wait for “Paired!”');return}
 if(a==='testvoice'){command('testvoice');return}
 if(['football','handball','tennis','thirty'].includes(a)){command('sport',{sport:a});return}
 if(['one','two','minusone','minustwo'].includes(a)){
  const team=a.endsWith('two')?1:0,delta=a.startsWith('minus')?-1:1;
  const sp=box.dataset.sport||'football';
  if(sp==='tennis'){if(delta>0)command('tn-point',{p:team})}
  else command('score',{sport:sp==='football'?'fb':'hb',team,delta});return;
 }
 command(a);
});
})();