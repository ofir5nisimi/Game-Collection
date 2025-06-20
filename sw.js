// Service worker for Game Collection PWA
const CACHE_NAME = 'game-collection-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/main.js',
  '/script.js',
  '/manifest.json',
  '/images/app-icon-192.svg',
  '/images/app-icon-512.svg',
  '/images/memory-card-thumbnail.svg',
  '/images/counting-farm-thumbnail.svg',
  '/images/math-monster-munch-thumbnail.svg',
  '/games/memory-card/index.html',
  '/games/memory-card/styles.css',
  '/games/memory-card/script.js',
  '/games/counting-farm/index.html',
  '/games/counting-farm/styles.css',
  '/games/counting-farm/script.js',
  '/games/math-monster-munch/index.html',
  '/games/math-monster-munch/styles.css',
  '/games/math-monster-munch/script.js',
  '/games/counting-farm/chicken.png',
  '/games/counting-farm/cow.png',
  '/games/counting-farm/duck.png',
  '/games/counting-farm/horse.png',
  '/games/counting-farm/pig.png',
  '/games/counting-farm/sheep.png'
];

// Install service worker and cache the app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Update the cache when new content is available
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
