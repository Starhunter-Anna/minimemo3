const CACHE_NAME = 'minimemo-v2';

// Files we know are local
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/constants.ts',
  '/components/NoteCard.tsx',
  '/components/NoteEditor.tsx',
  '/components/FilterBar.tsx',
  '/components/SettingsModal.tsx',
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
  // Essential for making the CDN-based React app work offline.
  if (url.hostname.includes('tailwindcss.com') ||
      url.hostname.includes('googleapis.com') ||
      url.hostname.includes('gstatic.com') ||
      url.hostname.includes('aistudiocdn.com')) {
    
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        
        // Create a promise to fetch and update cache
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            // Only cache valid responses
            if(networkResponse.ok) {
                cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
            // Network failed, nothing to do here
          });

        // Return cached response immediately if available, otherwise wait for network
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Strategy for Local App Files
  // Cache First, fall back to network
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});