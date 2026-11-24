/* Brindis 3600 — Service Worker (Guía C3-A2: «proxy invisible» entre navegador y red)
   install: precache de todos los archivos · fetch: Cache Storage primero, red de respaldo · activate: limpia versiones viejas. */
const CACHE_NAME = 'cat-3-licoreria-brindis-3600-v1.0.0';
const ASSETS_TO_CACHE = [
 "./",
 "./assets/images/agua-con-gas-600-ml.svg",
 "./assets/images/black-label.svg",
 "./assets/images/caja-pace-a-x12.svg",
 "./assets/images/casa-real-etiqueta-negra.svg",
 "./assets/images/combo-fiesta.svg",
 "./assets/images/corona-extra.svg",
 "./assets/images/ducal.svg",
 "./assets/images/fernet.svg",
 "./assets/images/gaseosa-cola-2-l.svg",
 "./assets/images/gaseosa-lim-n-2-l.svg",
 "./assets/images/hielo-en-bolsa-5-kg.svg",
 "./assets/images/huari-bock.svg",
 "./assets/images/huari-pilsener.svg",
 "./assets/images/logo.svg",
 "./assets/images/los-parrales.svg",
 "./assets/images/old-parr-12.svg",
 "./assets/images/pace-a-lata-pack-x6.svg",
 "./assets/images/pace-a-pilsener.svg",
 "./assets/images/pack-brindis-whisky.svg",
 "./assets/images/red-label.svg",
 "./assets/images/ron-a-ejo.svg",
 "./assets/images/singani-rujero.svg",
 "./assets/images/taqui-a.svg",
 "./assets/images/tequila-reposado.svg",
 "./assets/images/vino-blanco-torront-s.svg",
 "./assets/images/vino-rosado-tarija.svg",
 "./assets/images/vino-tinto-reserva-tarija.svg",
 "./assets/images/vodka-absolut.svg",
 "./data/products.json",
 "./data/site.json",
 "./icons/icon-192.png",
 "./icons/icon-512.png",
 "./index.html",
 "./manifest.json",
 "./script.js",
 "./styles.css",
 "./vendor/jquery-3.6.0.min.js",
 "./vendor/purify.min.js"
];
const RUNTIME_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('cat-3-licoreria-brindis-3600-') && k !== CACHE_NAME).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (event) => {
  const request = event.request; const url = new URL(request.url);
  if (request.method !== 'GET') return;
  if (url.origin !== self.location.origin && !RUNTIME_HOSTS.includes(url.hostname)) return;
  event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
    if (response && response.ok) { const copy = response.clone(); caches.open(CACHE_NAME).then((c) => c.put(request, copy)); }
    return response;
  }).catch(() => request.mode === 'navigate' ? caches.match('./index.html') : new Response('Recurso no disponible sin conexión.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }))));
});
self.addEventListener('sync', (event) => { if (event.tag === 'pedidos-pendientes') event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((l) => l.forEach((c) => c.postMessage({ type: 'SYNC_AVAILABLE' })))); });
self.addEventListener('message', (event) => { if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting(); });
