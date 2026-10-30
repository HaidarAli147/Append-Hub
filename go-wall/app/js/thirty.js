/* Thirty scoreboard, embedded in the native Go-Wall sport tabs. */
const Thirty=(()=>{
const KEY='gowall.thirty.v2';
const fresh=()=>({players:Array.from({length:4},(_,i)=>({id:i+1,name:'اللاعب '+(i+1),score:0})),last:null,limit:30,log:[]});
let data;try{data=JSON.parse(localStorage.getItem(KEY))||fresh()}catch{data=fresh()}
if(!Array.isArray(data.players)||data.players.length<4)data=fresh();
if(!Number.isInteger(data.limit)||data.limit<1||data.limit>999)data.limit=30;
let undo=[];
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const en=()=>typeof state!=='undefined'&&state.lang==='en';
const label=(a,b)=>en()?b:a;
let displayOnly=false;
function persist(){try{localStorage.setItem(KEY,JSON.stringify(data))}catch{}}
function render(){
const root=document.getElementById('panel-thirty');if(!root)return;
root.innerHTML='<div class="thirty-top"><div class="thirty-header"><b>'+label('لعبة ثلاثين','Thirty')+'</b><span>'+label('٤ لاعبين أو أكثر • حد نقاط قابل للتعديل','4+ players • customizable points limit')+'</span></div><div class="thirty-controls" '+(displayOnly?'hidden':'')+'><label>'+label('عدد اللاعبين','Players')+' <input type="number" id="thirty-count" min="4" max="24" value="'+data.players.length+'"></label><label>'+label('حد المباراة','Match limit')+' <input type="text" inputmode="numeric" pattern="[0-9]+" maxlength="3" id="thirty-limit" value="'+data.limit+'"></label><button class="btn" data-thirty="limit">'+label('حفظ الحد','Save limit')+'</button><button class="btn" data-thirty="count">'+label('تطبيق','Apply')+'</button><button class="btn" data-thirty="undo">'+label('تراجع','Undo')+'</button><button class="btn" data-thirty="clear">'+label('إلغاء اللمسة','Clear touch')+'</button><button class="btn danger" data-thirty="reset">'+label('مباراة جديدة','New game')+'</button></div><p>'+label('آخر لمسة: ','Last touch: ')+(data.players.find(p=>p.id===data.last)?.name||'—')+'</p></div><div class="thirty-grid">'+data.players.map((p,i)=>{const out=p.score>=data.limit,repeat=p.id===data.last;return '<article class="thirty-player" data-side="'+i%2+'"><input class="thirty-name" data-thirty-name="'+p.id+'" value="'+escape(p.name)+'" maxlength="30"><div class="thirty-score">'+p.score+' <small>/ '+data.limit+'</small></div><p>'+(out?label('خسر','Eliminated'):repeat?label('بانتظار لمسة لاعب آخر','Waiting for another player'):label('جاهز','Ready'))+'</p><div class="thirty-buttons"><button class="btn" data-thirty="touch" data-id="'+p.id+'" '+(out||repeat?'disabled':'')+'>'+label('لمسة','Touch')+'</button>'+[['normal',1,'هدف +١','Goal +1'],['volley',5,'على الطاير +٥','Volley +5'],['double',30,'دبل كيك +٣٠','Double kick +30'],['bicycle',30,'مقصية +٣٠','Bicycle +30']].map(([kind,points,ar,eng])=>'<button class="btn" data-thirty="award" data-id="'+p.id+'" data-kind="'+kind+'" '+(out||data.last!==p.id?'disabled':'')+'>'+label(ar,eng)+'</button>').join('')+'</div></article>'}).join('')+'</div><div class="thirty-history"><b>'+label('سجل المباراة','Match history')+'</b><p>'+data.log.slice(0,8).map(escape).join(' · ')+'</p></div>';
}
function perform(action,opts={}){
const p=data.players.find(p=>p.id===Number(opts.id));
if(action==='undo'){if(!undo.length)return;data=undo.pop();persist();render();return}
if(action==='name'){if(!p)return;p.name=String(opts.name||'').slice(0,30);persist();return}
if(action==='reset'&&!opts.confirmed&&!confirm(label('تصفير المباراة؟','Reset the match?')))return;
if(action==='touch'&&(!p||p.score>=data.limit||data.last===p.id))return;
if(action==='award'&&(!p||p.score>=data.limit||data.last!==p.id||!['normal','volley','double','bicycle'].includes(opts.kind)))return;
if(action==='limit'&&(!Number.isInteger(Number(opts.n))||Number(opts.n)<1||Number(opts.n)>999))return;
if(action==='count'&&(!Number.isInteger(Number(opts.n))||Number(opts.n)<4||Number(opts.n)>24))return;
undo.push(JSON.parse(JSON.stringify(data)));if(undo.length>80)undo.shift();
if(action==='touch'){data.last=p.id;data.log.unshift(p.name+': '+label('لمسة','Touch'))}
else if(action==='award'){const pts={normal:1,volley:5,double:30,bicycle:30}[opts.kind];p.score+=pts;data.log.unshift(p.name+': +'+pts);if(p.score>=data.limit){data.log.unshift(p.name+': '+label('خسر','Eliminated'));data.last=null}}
else if(action==='limit'){data.limit=Number(opts.n)}
else if(action==='count'){const n=Number(opts.n);while(data.players.length<n)data.players.push({id:Math.max(0,...data.players.map(p=>p.id))+1,name:label('اللاعب ','Player ')+(data.players.length+1),score:0});data.players.length=n;if(!data.players.some(p=>p.id===data.last))data.last=null}
else if(action==='reset'){data.players.forEach(p=>p.score=0);data.last=null;data.log=[]}
else if(action==='clear')data.last=null;
persist();render();
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-thirty]');if(!b)return;e.stopPropagation();perform(b.dataset.thirty,{...b.dataset,n:b.dataset.thirty==='limit'?document.getElementById('thirty-limit')?.value:document.getElementById('thirty-count')?.value})});
document.addEventListener('change',e=>{if(e.target.dataset.thirtyName)perform('name',{id:e.target.dataset.thirtyName,name:e.target.value})});
return {render,perform,snapshot:()=>JSON.parse(JSON.stringify(data)),setDisplayOnly(v){displayOnly=!!v;render()}};
})();
