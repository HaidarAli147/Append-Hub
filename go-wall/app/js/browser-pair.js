/* Go-Wall browser pairing. PeerJS signaling only; WebRTC host candidates restrict media/data to LAN. */
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const box=document.createElement('section');
box.id='gowall-remote';box.className='no-tv';
box.innerHTML='<h2>📱 Go-Wall · Two devices</h2><p>Open this same page on both devices, connected to the same Wi-Fi. Choose a role below.</p><div class="gw-actions"><button id="gw-display">🖥️ Display</button><button id="gw-control">📱 Controller</button></div><div id="gw-details" role="status"></div><div id="gw-controls" hidden><div id="gw-score">0 : 0</div><div id="gw-names"></div><div id="gw-standard-controls" class="gw-actions"><button data-gw="toggle">▶ / ⏸ Clock</button><button data-gw="undo">↶ Undo</button><button data-gw="one">+1 Team 1</button><button data-gw="two">+1 Team 2</button><button data-gw="minusone">−1 Team 1</button><button data-gw="minustwo">−1 Team 2</button><button data-gw="voice">🎙 Commentator ON/OFF</button><button data-gw="testvoice">🔈 Test commentator</button><button data-gw="sound">🔊 Sound</button></div><div class="gw-actions"><button data-gw="football">Football</button><button data-gw="handball">Handball</button><button data-gw="tennis">Tennis</button><button data-gw="thirty">Thirty</button></div><div id="gw-thirty-controls"></div><div id="gw-full-controls"></div><div class="gw-actions"></div></div>';
document.querySelector('.mast')?.after(box);
const style=document.createElement('style');style.textContent='#gowall-remote{margin:16px var(--gutter);padding:20px;border:2px solid white}#gowall-remote h2{margin:0 0 8px}.gw-actions{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.gw-actions button{padding:10px;background:#fff;color:#352246;border:0;font-weight:700}#gw-score{font-size:42px;font-weight:bold}#gw-details{overflow-wrap:anywhere}body.gw-controller .mast,body.gw-controller main,body.gw-controller .notes,body.gw-controller footer{display:none!important}body.gw-controller #gowall-remote{min-height:80vh}body.gw-controller #gw-controls:not([hidden]){display:block}';style.textContent+='.gw-remote-section{border:2px solid #fff;padding:12px;margin:12px 0}.gw-remote-section h3{margin:0 0 10px}.gw-remote-section label{display:inline-flex;gap:6px;align-items:center;margin:6px;flex-wrap:wrap}.gw-remote-section input,.gw-remote-section select{color:#222;background:white;padding:7px;max-width:180px}.gw-remote-section strong{display:block;margin:8px 0}.gw-stat{margin:8px 0}.gw-stat button{margin:3px}';style.textContent+='[hidden]{display:none!important}#gw-thirty-controls{display:grid;gap:12px;margin-top:14px}.gw-thirty-toolbar{display:flex;flex-wrap:wrap;gap:8px;align-items:center}.gw-thirty-player{border:2px solid #fff;padding:12px}.gw-thirty-player strong{display:block;font-size:28px}.gw-thirty-player input,.gw-thirty-toolbar input{background:#fff;color:#2a1a3d;padding:9px;max-width:180px}.gw-thirty-player button:disabled{opacity:.35}';document.head.append(style);
let peer=null,connection=null,role=null,connected=false;
function announcePairRole(){document.dispatchEvent(new CustomEvent('gowall-role',{detail:{role}}))}
window.GoWallPair={get peer(){return peer},get connected(){return connected},get role(){return role},get displayPeerId(){return role==='controller'?connection?.peer:role==='display'?peer?.id:null},get remotePeerId(){return connection?.peer||null}};
const escGw=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let fullSnapshot=null;
const remoteButton=(label,action,attrs='')=>'<button data-remote-action="'+action+'" '+attrs+'>'+label+'</button>';
function renderFullRemote(){
 const root=$('gw-full-controls'),s=fullSnapshot;
 if(!s||s.sport==='thirty'){root.innerHTML='';return}
 const sp=s.sport, teams=sp==='football'?s.fb.teams:sp==='handball'?s.hb.teams:null;
 const field=(name,value,attr)=>'<label>'+name+' <input '+attr+' value="'+escGw(value)+'"></label>';
 const shared='<section class="gw-remote-section"><h3>Match controls</h3><div class="gw-actions">'+remoteButton('↶ Undo','undo')+remoteButton('Reset match','reset')+remoteButton('🎙 Commentator','voice')+remoteButton('🔊 Sound','sound')+remoteButton('العربية / English','lang')+'</div></section>';
 let html=shared;
 if(teams){
  html+='<section class="gw-remote-section"><h3>Clock & periods</h3><div class="gw-actions">'+remoteButton(s.run[sp==='football'?'fb':'hb']?'⏸ Pause':'▶ Start','toggle');
  if(sp==='football'){
   html+=remoteButton('−1 minute','nudge','data-min="-1"')+remoteButton('+1 minute','nudge','data-min="1"')+
   '<label>Period <select data-remote-select="period">'+['First half','Half-time','Second half','Full time'].map((v,i)=>'<option value="'+i+'" '+(s.fb.period===i?'selected':'')+'>'+v+'</option>').join('')+'</select></label>';
  }else{
   html+=remoteButton('Reset 30 min','hb-reset-half')+remoteButton('Next half','hb-next-half');
  }
  const clockMs=sp==='football'?s.fb.elapsed:s.hb.remaining;
  const mm=Math.floor(clockMs/60000),ss=Math.floor(clockMs%60000/1000);
  html+='<label>Clock (mm:ss) <input data-remote-clock type="text" inputmode="numeric" pattern="[0-9]{1,3}:[0-5][0-9]" value="'+String(mm).padStart(2,'0')+':'+String(ss).padStart(2,'0')+'"></label>'+remoteButton('Set clock','set-clock')+'</div></section>';
  html+=teams.map((t,i)=>{
   const key=sp==='football'?'fb':'hb';
   let h='<section class="gw-remote-section"><h3>Team '+(i+1)+'</h3>'+field('Name',t.name,'data-remote-name="'+key+'" data-team="'+i+'"')+field('Color',t.color,'type="color" data-remote-color="'+key+'" data-team="'+i+'"')+'<strong>'+escGw(t.name)+' · '+t.score+'</strong><div class="gw-actions">'+remoteButton('Goal +1','score','data-sport="'+key+'" data-team="'+i+'" data-delta="1"')+remoteButton('Goal −1','score','data-sport="'+key+'" data-team="'+i+'" data-delta="-1"')+'</div>';
   if(sp==='football'){
    for(const [k,name] of [['fouls','Fouls'],['yellow','Yellow cards'],['red','Red cards']])h+='<div class="gw-stat">'+name+' ('+t[k]+') '+remoteButton('−1','stat','data-sport="fb" data-team="'+i+'" data-key="'+k+'" data-delta="-1"')+remoteButton('+1','stat','data-sport="fb" data-team="'+i+'" data-key="'+k+'" data-delta="1"')+'</div>';
   }else{
    h+='<div class="gw-actions">'+remoteButton('Timeout ('+t.timeouts+' left)','hb-timeout','data-team="'+i+'" '+(t.timeouts<=0?'disabled':''))+remoteButton('2-minute penalty','hb-penalty','data-team="'+i+'"')+'</div>';
    (s.hb.pens[i]||[]).forEach((p,j)=>h+='<div class="gw-stat">Penalty '+(j+1)+' '+remoteButton('Remove','hb-pen-del','data-team="'+i+'" data-idx="'+j+'"')+'</div>');
   }
   return h+'</section>';
  }).join('');
 }else{
  const t=s.tn;
  html+='<section class="gw-remote-section"><h3>Tennis options</h3><label>Best of <select data-remote-select="bestof">'+[1,3,5].map(n=>'<option value="'+n+'" '+(t.bestOf===n?'selected':'')+'>'+n+'</option>').join('')+'</select></label><label><input type="checkbox" data-remote-noad '+(t.noAd?'checked':'')+'> No advantage</label><div class="gw-actions">'+remoteButton('New tennis match','tn-new')+'</div></section>';
  html+=t.names.map((name,i)=>'<section class="gw-remote-section"><h3>Player '+(i+1)+'</h3>'+field('Name',name,'data-remote-tname="'+i+'"')+field('Color',t.colors[i],'type="color" data-remote-tcolor="'+i+'"')+'<div class="gw-actions">'+remoteButton('Point +1','tn-point','data-p="'+i+'"')+remoteButton('Set server','tn-server','data-p="'+i+'"')+'</div></section>').join('');
 }
 root.innerHTML=html;
}
let thirtySnapshot=null;
function renderThirtyRemote(){const area=$('gw-thirty-controls');if(!thirtySnapshot||box.dataset.sport!=='thirty'){area.innerHTML='';return;}const s=thirtySnapshot;area.innerHTML='<div class="gw-thirty-toolbar"><label>Players <input id="gw-thirty-count" type="number" min="4" max="24" value="'+s.players.length+'"></label><button data-gw-thirty="count">Set players</button><button data-gw-thirty="undo">↶ Undo</button><button data-gw-thirty="clear">Clear touch</button><button data-gw-thirty="reset">New game</button></div><p>Last touch: '+escGw(s.players.find(p=>p.id===s.last)?.name||'None')+'</p>'+s.players.map(p=>{const out=p.score>=30,repeat=s.last===p.id;return '<section class="gw-thirty-player"><input aria-label="Player name" data-gw-thirty-name="'+p.id+'" value="'+escGw(p.name)+'" maxlength="30"><strong>'+p.score+' / 30</strong><div class="gw-actions"><button data-gw-thirty="touch" data-id="'+p.id+'" '+(out||repeat?'disabled':'')+'>Touch</button>'+[['normal','Goal +1'],['volley','Volley +5'],['double','Double kick +30'],['bicycle','Bicycle +30']].map(([kind,name])=>'<button data-gw-thirty="award" data-id="'+p.id+'" data-kind="'+kind+'" '+(out||s.last!==p.id?'disabled':'')+'>'+name+'</button>').join('')+'</div>'+(out?'<b>Eliminated</b>':'')+'</section>'}).join('');}

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
   thirtySnapshot=s.thirty;fullSnapshot=s;
   box.dataset.sport=s.sport;
   $('gw-standard-controls').hidden=true;
   if(s.sport==='thirty'&&!$('gw-thirty-controls').contains(document.activeElement))renderThirtyRemote();else if(s.sport!=='thirty')$('gw-thirty-controls').innerHTML='';
   if(!$('gw-full-controls').contains(document.activeElement))renderFullRemote();  }
  if(role==='display'&&m.type==='command'){
   if(m.action==='testvoice'){try{voiceCtx().resume().then(()=>speak(['voice_on'],true)).catch(()=>{});}catch{}return;}
   const a=m.action,d=m.data||{};
   if(a==='thirty'){if(state.sport!=='thirty')return;if(['touch','award','undo','clear','count','name','reset'].includes(d.action))Thirty.perform(d.action,d);sync();return;}
   if(a==='sport'){if(['football','handball','tennis','thirty'].includes(d.sport))actions.sport(d);sync();return}
   const key=state.sport==='football'?'fb':state.sport==='handball'?'hb':null;
   if(a==='set-clock'){
    if(!key||!Number.isInteger(d.ms)||d.ms<0||d.ms>36000000)return;
    if(key==='fb'){state.fb.elapsed=d.ms;fbNotified.period=-1;}else setHbRemaining(Math.min(d.ms,HB_HALF));
    commit();sync();return;
   }
   if(a==='period'){if(key!=='fb'||!Number.isInteger(d.period)||d.period<0||d.period>=FB_PERIODS.length)return;setPeriod(d.period);sync();return}
   if(a==='bestof'){if(state.sport!=='tennis'||![1,3,5].includes(d.value))return;state.tn.bestOf=d.value;commit();sync();return}
   if(a==='noad'){if(state.sport!=='tennis'||typeof d.value!=='boolean')return;state.tn.noAd=d.value;commit();sync();return}
   if(a==='edit-name'||a==='edit-color'){
    if(!Number.isInteger(d.team)||![0,1].includes(d.team))return;
    const val=String(d.value||'').slice(0,a==='edit-name'?40:7);
    if(a==='edit-color'&&!/^#[0-9a-fA-F]{6}$/.test(val))return;
    if(d.sport==='tn'&&state.sport==='tennis'){if(a==='edit-name')state.tn.names[d.team]=val;else state.tn.colors[d.team]=val}
    else if(d.sport===key&&key){if(a==='edit-name')state[key].teams[d.team].name=val;else state[key].teams[d.team].color=val}
    else return;
    commit();sync();return;
   }
   if(a==='reset'||a==='tn-new'){
    if(!d.confirmed)return;
    if(a==='tn-new'&&state.sport==='tennis'){state.tn=newTennis(state.tn);undoStack=[];commit();}
    else if(a==='reset'){
     pauseAll();const defaultsState=defaults();
     if(key){defaultsState[key].teams.forEach((t,i)=>{t.name=state[key].teams[i].name;t.color=state[key].teams[i].color});state[key]=defaultsState[key];}
     else if(state.sport==='tennis')state.tn=newTennis(state.tn);
     else return;
     undoStack=[];commit();
    }
    sync();return;
   }
   const allowed=['toggle','undo','voice','sound','lang','score','stat','nudge','hb-timeout','hb-penalty','hb-pen-del','hb-next-half','hb-reset-half','tn-point','tn-server'];
   if(!allowed.includes(a))return;
   if(a==='score'&&!(d.sport===key&&[0,1].includes(d.team)&&[-1,1].includes(d.delta)))return;
   if(a==='stat'&&!(key==='fb'&&d.sport==='fb'&&[0,1].includes(d.team)&&['fouls','yellow','red'].includes(d.key)&&[-1,1].includes(d.delta)))return;
   if(a==='nudge'&&!(key==='fb'&&[-1,1].includes(d.min)))return;
   if(a.startsWith('hb-')&&!(key==='hb'&&(!('team' in d)||[0,1].includes(d.team))))return;
   if(a==='hb-pen-del'&&!(Number.isInteger(d.idx)&&d.idx>=0&&d.idx<(state.hb.pens[d.team]?.length||0)))return;
   if(a.startsWith('tn-')&&!(state.sport==='tennis'&&[0,1].includes(d.p)))return;
   if(a==='toggle'&&!key)return;
   if(a==='undo'&&state.sport==='thirty')return;
   if(a==='score'&&d.delta===1){
    const T=state[key].teams[d.team];mutate(()=>{T.score++;if(key==='fb')state.fb.log.unshift({icon:'⚽',team:d.team,label:fbLabel()});});
    sound('goal');announceGoal(key,d.team,'');sync();return;
   }
   Promise.resolve(actions[a](d)).then(sync).catch(()=>{});

  }
 });
}
$('gw-display').onclick=()=>{
 if(peer)return;
 role='display';announcePairRole();Thirty.setDisplayOnly(true);const code=String(Math.floor(10000000+Math.random()*90000000));
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
 role='controller';announcePairRole();document.body.classList.add('gw-controller');
 const label=document.createElement('label');label.textContent='Display pairing code: ';
 const input=document.createElement('input');input.inputMode='numeric';input.maxLength=8;input.placeholder='8 digits';input.style.cssText='font:inherit;color:#222;background:white;width:150px;padding:8px';
 const button=document.createElement('button');button.textContent='Connect';button.style.cssText='padding:8px;margin:8px;background:white;color:#222';
 label.append(input,button);details.replaceChildren(label);button.disabled=true;button.title='Preparing connection';
 initPeer(undefined,()=>{button.disabled=false;button.title='';button.onclick=()=>{
  if(!/^\d{8}$/.test(input.value)){message('Enter the 8-digit code shown on the display.');return}
  message('Connecting…');const c=peer.connect('gowall-'+input.value,{reliable:true});handle(c);
 };});
};
box.addEventListener('change',e=>{const t=e.target;
 if(t.dataset.remoteName){command('edit-name',{sport:t.dataset.remoteName,team:+t.dataset.team,value:t.value});return}
 if(t.dataset.remoteColor){command('edit-color',{sport:t.dataset.remoteColor,team:+t.dataset.team,value:t.value});return}
 if(t.dataset.remoteTname!==undefined){command('edit-name',{sport:'tn',team:+t.dataset.remoteTname,value:t.value});return}
 if(t.dataset.remoteTcolor!==undefined){command('edit-color',{sport:'tn',team:+t.dataset.remoteTcolor,value:t.value});return}
 if(t.dataset.remoteSelect){command(t.dataset.remoteSelect,{[t.dataset.remoteSelect==='period'?'period':'value']:+t.value});return}
 if(t.dataset.remoteNoad!==undefined){command('noad',{value:t.checked});return}
if(t.dataset.gwThirtyName&&connected)command('thirty',{action:'name',id:t.dataset.gwThirtyName,name:t.value});
});
box.addEventListener('click',e=>{
 const r=e.target.closest('[data-remote-action]');if(r){if(!connected)return message('Connect to the display first.');const a=r.dataset.remoteAction;if(['reset','tn-new'].includes(a)&&!confirm('Start a new match?'))return;if(a==='set-clock'){const raw=box.querySelector('[data-remote-clock]')?.value||'';if(!/^\d{1,3}:[0-5]\d$/.test(raw))return message('Use mm:ss for the clock');const [m,sec]=raw.split(':').map(Number);command(a,{ms:(m*60+sec)*1000});return}command(a,{...Object.fromEntries(Object.entries(r.dataset).filter(([k])=>k!=='remoteAction').map(([k,v])=>[k,['team','delta','min','p','idx'].includes(k)?Number(v):v])),confirmed:true});return}
 const th=e.target.closest('[data-gw-thirty]');if(th){if(!connected)return message('Connect to the display first.');const action=th.dataset.gwThirty;if(action==='reset'&&!confirm('Start a new Thirty game?'))return;command('thirty',{action,id:th.dataset.id,kind:th.dataset.kind,n:$('gw-thirty-count')?.value,confirmed:action==='reset'});return}
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