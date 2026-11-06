const C='sostav-v4';
const SHELL=['./','./index.html','./manifest.webmanifest','./js/lottie.min.js','./icons/icon-180.png','./icons/icon-192.png','./icons/icon-512.png',
  ...['book','cool','dizzy','idea','laptop','noentry','phone','relieved','star','sweat'].map(n=>`./anim/${n}.json`)];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  const put=res=>{if(res&&res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res};
  if(u.origin===location.origin){
    // always ask the network first (bypassing the browser cache) so updates arrive immediately; cache only when offline
    e.respondWith(fetch(r,{cache:'no-store'}).then(put).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('./index.html'))));
  }else if(/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(put)));
  }
});
