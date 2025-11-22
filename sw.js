const CACHE_NAME = 'minimemo-v3';

// Only cache the shell. Assets will be cached at runtime.
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Strategy for External CDN Assets (React, Fonts, Tailwind)
  // Stale-While-Revalidate: Use cache if available, but update in background.
  if (url.hostname.includes('tailwindcss.com') ||
      url.hostname.includes('googleapis.com') ||
      url.hostname.includes('gstatic.com') ||
      url.hostname.includes('aistudiocdn.com')) {
    
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if(networkResponse.ok) {
                cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
             // Network failed
          });

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Strategy for Local App Files
  // Cache First for assets, but we need to cache them dynamically as they are requested
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        // Check if we received a valid response
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // IMPORTANT: Clone the response. A response is a stream
        // and because we want the browser to consume the response
        // as well as the cache consuming the response, we need
        // to clone it so we have two streams.
        const responseToCache = networkResponse.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      });
    })
  );
});