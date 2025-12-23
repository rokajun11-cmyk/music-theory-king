const CACHE_NAME = 'music-theory-king-pro-v4';

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json?v=1.1',
  './icon.svg?v=1.1'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) return caches.delete(cacheName);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // HTML/Manifest: Network First
  if (requestUrl.pathname.endsWith('index.html') || requestUrl.pathname === '/' || requestUrl.pathname.includes('manifest.json')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 其他资源: Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetchPromise = fetch(event.request).then(network => {
        if (network && network.status === 200) {
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, network.clone()));
        }
        return network;
      });
      return cached || fetchPromise;
    })
  );
});
