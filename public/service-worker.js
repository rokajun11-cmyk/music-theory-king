
const CACHE_NAME = 'music-theory-king-v12';

// Files that exist locally and MUST be cached for the app to start
const LOCAL_URLS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  // Source files required by Babel Standalone at runtime
  './App.tsx',
  // Converted JS files are now what the browser loads
  './constants.js',
  './services/audioEngine.js',
  './services/musicLogic.js'
];

// Domains that we want to cache dynamically (CDNs)
const EXTERNAL_DOMAINS = [
  'esm.sh',
  'cdn.tailwindcss.com',
  'unpkg.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache, installing local resources');
        return cache.addAll(LOCAL_URLS);
      })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Strategy 1: Stale-While-Revalidate for External CDNs (React, Fonts, Tailwind)
  // This allows the app to load fast from cache, but update in background if CDNs change
  if (EXTERNAL_DOMAINS.some(domain => requestUrl.hostname.includes(domain))) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          const fetchPromise = fetch(event.request).then(networkResponse => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // Strategy 2: Cache First for Local Files
  // Falls back to Network if not found (useful for development)
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(networkResponse => {
           // Optionally cache new local files visited
           if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                 cache.put(event.request, responseToCache);
              });
           }
           return networkResponse;
        });
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
