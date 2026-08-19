const fs = require('fs');
const path = require('path');

const ROOT = 'c:\\Users\\user\\OneDrive\\Desktop\\動物保護団体ヨンナナ';
const SUB  = path.join(ROOT, 'afc-pet-finder');

const swContent = `/**
 * AFC Pet Finder - Service Worker v12 (Force Cache Refresh)
 */

const CACHE_NAME = 'afc-pet-finder-v12';

// Force immediate takeover
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Purging legacy cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Network first strategy
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
`;

fs.writeFileSync(path.join(ROOT, 'sw.js'), swContent, 'utf8');
fs.writeFileSync(path.join(SUB, 'sw.js'), swContent, 'utf8');

console.log('⚡ SW.js updated to v12 with automatic legacy cache purging!');
