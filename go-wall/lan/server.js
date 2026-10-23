/* Go-Wall LAN companion. Run from go-wall/lan with npm start. */
'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto');
const {WebSocketServer,WebSocket}=require('ws');
const root=path.resolve(__dirname,'../..'),port=Number(process.env.PORT)||8765;
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.webmanifest':'application/manifest+json','.png':'image/png','.svg':'image/svg+xml','.mp3':'audio/mpeg','.ico':'image/x-icon','.woff2':'font/woff2'};
const code=String(crypto.randomInt(100000,1000000));let display=null;const controllers=new Set();
const server=http.createServer((req,res)=>{
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400).end();return}
 if(pathname==='/go-wall/lan/'||pathname==='/go-wall/lan')pathname='/go-wall/lan/controller.html';
 let file=path.resolve(root,'.'+pathname);
 if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return}
 try{if(fs.statSync(file).isDirectory())file=path.join(file,'index.html')}catch{}
 fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end('Not found');return}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}).end(data)});
});
const wss=new WebSocketServer({server,path:'/go-wall/lan/socket',maxPayload:8192});
const send=(ws,obj)=>{if(ws.readyState===WebSocket.OPEN)ws.send(JSON.stringify(obj))};
wss.on('connection',(ws,req)=>{
 // Browser origin must match the local server, blocking unrelated websites.
 if(req.headers.origin && new URL(req.headers.origin).host!==req.headers.host){ws.close(1008,'Invalid origin');return}
 ws.role=null;ws.on('message',raw=>{
  let m;try{m=JSON.parse(raw)}catch{return}
  if(!m||typeof m!=='object')return;
  if(m.type==='join-display'&&!display){display=ws;ws.role='display';send(ws,{type:'paired',role:'display',code});return}
  if(m.type==='join-controller'&&m.code===code&&display?.readyState===WebSocket.OPEN){ws.role='controller';controllers.add(ws);send(ws,{type:'paired',role:'controller'});send(display,{type:'sync-request'});return}
  if(ws===display&&m.type==='state'){for(const c of controllers)send(c,{type:'state',data:m.data});return}
  if(ws.role==='controller'&&m.type==='command'&&typeof m.action==='string'&&JSON.stringify(m).length<1024){send(display,{type:'command',action:m.action,data:m.data||{}})}
 });ws.on('close',()=>{if(ws===display){display=null;for(const c of controllers){send(c,{type:'disconnected'});c.close()}controllers.clear()}controllers.delete(ws)});
});
server.listen(port,'0.0.0.0',()=>{console.log('Go-Wall LAN pairing code:',code);for(const net of Object.values(os.networkInterfaces()))for(const n of net||[])if(n.family==='IPv4'&&!n.internal)console.log('Display: http://'+n.address+':'+port+'/go-wall/app/?lan=display');console.log('Controller: http://<display-ip>:'+port+'/go-wall/lan/')});
