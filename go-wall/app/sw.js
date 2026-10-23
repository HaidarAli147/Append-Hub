/* Network-first with offline fallback: always fresh when online, still works at the pitch without signal. */
const CACHE = 'gowall-v22';
const ASSETS = ['./', 'index.html', 'css/style.css', 'js/app.js', 'js/thirty.js', 'js/browser-pair.js', 'js/var.js', '../../shared/assets/logos/go-wall-full.png', '../../shared/assets/logos/go-wall-compact.png', 'manifest.webmanifest'];

self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(keys => Promise.all(
    keys.filter(k => k.startsWith('gowall-') && k !== CACHE).map(k => caches.delete(k))
  )).then(() => self.clients.claim())
));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => { if (res.status === 200) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); } return res; })
      .catch(() => caches.match(e.request))
  );
});
