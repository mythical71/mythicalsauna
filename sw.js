const CACHE = 'sauna-v2';
const ASSETS = ['./', './index.html', './manifest.webmanifest'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin === location.origin) {
    if (url.pathname.endsWith('/') || url.pathname.endsWith('/index.html')) {
      e.respondWith(caches.match('./index.html').then(r => r || fetch(e.request)));
      return;
    }
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});