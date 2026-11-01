// Minimal dependency-free, loopback-only static server. Run: node serve.cjs
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const {spawn} = require('node:child_process');
const readline = require('node:readline');
const root = __dirname;
const port = Number(process.env.PORT || 8000);
let pythonWorker, sequence=0;
const pendingPython=new Map();
function executePython(operation,payload){
  if(!pythonWorker){
    const command=process.env.FRIENDS_PYTHON || (process.platform==='win32'?'py':'python3');
    const args=[...(process.platform==='win32'&&!process.env.FRIENDS_PYTHON?['-3']:[]),path.join(root,'python','episode_recommender.py'),'--worker'];
    const worker=spawn(command,args,{cwd:root,windowsHide:true,stdio:['pipe','pipe','pipe']});
    pythonWorker=worker;
    const fail=()=>{if(pythonWorker===worker)pythonWorker=undefined;for(const item of pendingPython.values()){clearTimeout(item.timer);item.reject(Error('Python unavailable'));}pendingPython.clear();};
    worker.on('error',fail);worker.on('close',fail);worker.stdin.on('error',fail);worker.stderr.resume();
    readline.createInterface({input:worker.stdout}).on('line',line=>{try{const message=JSON.parse(line),item=pendingPython.get(message.id);if(item){clearTimeout(item.timer);pendingPython.delete(message.id);message.error?item.reject(Error(message.error)):item.resolve(message.result);}}catch{fail();worker.kill();}});
  }
  return new Promise((resolve,reject)=>{const id=++sequence;const timer=setTimeout(()=>{pendingPython.delete(id);reject(Error('Python timeout'));},12000);pendingPython.set(id,{resolve,reject,timer});pythonWorker.stdin.write(JSON.stringify({id,operation,payload})+'\n');});
}
process.on('exit',()=>pythonWorker?.kill());
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.md': 'text/plain', '.txt': 'text/plain' };
const server = http.createServer((request, response) => {
  if (request.url === '/api/recommend' || request.url === '/api/simulate') {
    if(request.method !== 'POST') {response.writeHead(405).end();return;}
    if(request.headers.origin && request.headers.origin !== `http://127.0.0.1:${port}`) {response.writeHead(403).end();return;}
    let body='', oversized=false;
    request.on('data', chunk=>{body+=chunk;if(body.length>8192){oversized=true;response.writeHead(413).end();request.destroy();}});
    request.on('end',()=>{
      if(oversized)return;
      try {const value=JSON.parse(body);if(!value || Array.isArray(value) || typeof value!=='object')throw Error();}catch{response.writeHead(400).end('Invalid JSON object');return;}
      executePython(request.url.endsWith('simulate')?'simulate':'recommend',JSON.parse(body)).then(result=>{
        response.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(JSON.stringify(result));
      }).catch(()=>{if(!response.writableEnded)response.writeHead(503,{'Content-Type':'application/json'}).end(JSON.stringify({error:'Python unavailable; browser fallback remains usable.'}));});
    });
    return;
  }
  let name;
  try { name = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
  catch { response.writeHead(400).end('Bad request'); return; }
  if (request.method !== 'GET' && request.method !== 'HEAD') { response.writeHead(405).end(); return; }
  const segments = name.split('/');
  if (segments.some(segment => segment.startsWith('.') || segment.includes('\\') || segment.includes(':'))) { response.writeHead(403).end(); return; }
  const target = path.resolve(root, '.' + (name === '/' ? '/index.html' : name));
  if (!target.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
  fs.stat(target, (error, stat) => {
    if (error || !stat.isFile()) { response.writeHead(404).end('Not found'); return; }
    response.writeHead(200, { 'Content-Type': (types[path.extname(target)] || 'application/octet-stream') + '; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    if (request.method === 'HEAD') response.end();
    else fs.createReadStream(target).on('error', () => response.destroy()).pipe(response);
  });
});
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => console.log(`Friends v0.8: http://127.0.0.1:${port} (Ctrl+C to stop; Python API enabled)`));
