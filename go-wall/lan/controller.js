'use strict';
let ws=null,latest=null;
const $=id=>document.getElementById(id),status=$('status');
function send(action,data={}){if(ws?.readyState===1)ws.send(JSON.stringify({type:'command',action,data}))}
$('pair').onclick=()=>{
 if(!/^\d{6}$/.test($('code').value)){status.textContent='Enter a 6-digit code';return}
 ws?.close();ws=new WebSocket((location.protocol==='https:'?'wss://':'ws://')+location.host+'/go-wall/lan/socket');
 ws.onopen=()=>ws.send(JSON.stringify({type:'join-controller',code:$('code').value}));
 ws.onmessage=e=>{let m;try{m=JSON.parse(e.data)}catch{return}
  if(m.type==='paired'){$('controls').hidden=false;status.textContent='Connected to display'}
  if(m.type==='disconnected'){status.textContent='Display disconnected';$('controls').hidden=true}
  if(m.type==='state'){latest=m.data?.state;const s=latest;if(!s)return;$('sport').value=s.sport;
   const sport=s.sport,team=sport==='football'?s.fb.teams:sport==='handball'?s.hb.teams:null;
   const scores=team?team.map(x=>x.score):s.tn.pts;
   $('score').textContent=scores.join(' : ');
   $('names').textContent=team?team.map(x=>x.name).join(' · '):s.tn.names.join(' · ');
  }};
 ws.onclose=()=>{status.textContent='Disconnected';$('controls').hidden=true};
 ws.onerror=()=>status.textContent='Connection failed. Check LAN server and network.';
};
$('sport').onchange=e=>send('sport',{sport:e.target.value});
document.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{
 const a=b.dataset.a,s=latest?.sport;if(!s)return;
 if(a==='plus0'||a==='plus1'||a==='minus0'||a==='minus1'){
 const team=Number(a.slice(-1)),delta=a.startsWith('plus')?1:-1;
 if(s==='tennis'){if(delta>0)send('tn-point',{p:team})}
 else send('score',{sport:s==='football'?'fb':'hb',team,delta});return}
 if(a==='next')return send('hb-next-half');
 if(a==='nudge-'||a==='nudge+')return send('nudge',{min:a==='nudge-'?-1:1});
 send(a);
});
