/* Optional LAN display bridge. Only active with ?lan=display on the local companion server. */
(()=>{
 if(new URLSearchParams(location.search).get('lan')!=='display')return;
 const status=document.createElement('div');status.id='lan-display-status';status.style.cssText='position:fixed;z-index:9999;top:8px;left:8px;padding:10px;background:#2a1a3d;color:white;font:16px sans-serif;border:2px solid white';status.textContent='Connecting to LAN…';document.body.append(status);
 const ws=new WebSocket((location.protocol==='https:'?'wss://':'ws://')+location.host+'/go-wall/lan/socket');
 const snapshot=()=>({state,run:{...run}});
 const send=()=>{if(ws.readyState===1)ws.send(JSON.stringify({type:'state',data:snapshot()}))};
 ws.onopen=()=>ws.send(JSON.stringify({type:'join-display'}));
 ws.onmessage=e=>{let m;try{m=JSON.parse(e.data)}catch{return}
 if(m.type==='paired'){status.textContent='Goaaal pairing code: '+m.code+' · Open /go-wall/lan/ on your controller';if(!document.body.classList.contains('tv'))toggleTv();send()}
 if(m.type==='sync-request'){send()}
 if(m.type==='command'){
  const allowed=['sport','undo','sound','voice','toggle','score','nudge','hb-timeout','hb-next-half','hb-reset-half','tn-point','tn-server','lang'];
  if(!allowed.includes(m.action))return;
  const d=m.data||{};
  if(m.action==='score'&&(!['fb','hb'].includes(d.sport)||![0,1].includes(d.team)||![-1,1].includes(d.delta)))return;
  if(m.action==='sport'&&!['football','handball','tennis'].includes(d.sport))return;
  if(['tn-point','tn-server'].includes(m.action)&&![0,1].includes(d.p))return;
  if(m.action==='nudge'&&![-1,1].includes(d.min))return;
  if(m.action==='hb-timeout'&&![0,1].includes(d.team))return;
  Promise.resolve(actions[m.action](d)).then(send).catch(()=>{});}
 };
 ws.onclose=()=>status.textContent='LAN disconnected. Refresh to reconnect.';
 // Timers update outside commit(), so send live snapshots periodically.
 setInterval(send,500);
})();
