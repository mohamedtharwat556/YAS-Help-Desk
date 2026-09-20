/* ============================================================
   YAS Help Desk — Service Worker
   Offline support and caching for PWA
   ============================================================ */

const CACHE_NAME = 'yas-helpdesk-v3';
const OFFLINE_URL = 'index.html';

// Files to cache
const CACHE_FILES = [
  '/',
  '/index.html',
  '/support.html',
  '/tracking.html',
  '/login.html',
  '/dashboard.html',
  '/tickets.html',
  '/customers.html',
  '/devices.html',
  '/maintenance.html',
  '/warranty.html',
  '/reports.html',
  '/settings.html',
  '/ticket-details.html',
  '/customer-details.html',
  '/device-details.html',
  '/css/global.css',
  '/css/dashboard.css',
  '/css/customer.css',
  '/css/animations.css',
  '/css/responsive.css',
  '/js/storage.js',
  '/js/app.js',
  '/js/auth.js',
  '/js/notifications.js',
  '/js/tickets.js',
  '/js/customer.js',
  '/js/customers.js',
  '/js/devices.js',
  '/js/dashboard.js',
  '/js/ticket-manager.js',
  '/js/maintenance.js',
  '/js/warranty.js',
  '/js/reports.js',
  '/js/settings-page.js',
  '/js/file-upload.js',
  '/js/export.js',
  '/js/sla.js',
  '/manifest.json'
];

// Install event - cache files
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(CACHE_FILES);
      })
      .then(() => {
        console.log('[Service Worker] Skip waiting');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip API calls - they should always go to network
  if (event.request.url.includes('/api/')) {
    return;
  }
  
  // Skip external resources
  if (event.request.url.includes('http') && !event.request.url.includes(self.location.origin)) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached response if available
        if (cachedResponse) {
          console.log('[Service Worker] Serving from cache:', event.request.url);
          return cachedResponse;
        }
        
        // Otherwise, fetch from network
        console.log('[Service Worker] Fetching from network:', event.request.url);
        return fetch(event.request, { redirect: 'follow' })
          .then((networkResponse) => {
            // Cache the response for future use
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }
            return networkResponse;
          })
          .catch(() => {
            // If network fails, try to serve offline page
            if (event.request.destination === 'document') {
              return caches.match(OFFLINE_URL);
            }
            
            // Return a custom offline response for other requests
            return new Response('Offline - No network connection available', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => cache.addAll(event.data.urls))
    );
  }
});