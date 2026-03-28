// goulburn.ai — Self-unregistering service worker
// Clears all caches and unregisters itself to fix hydration issues.
// PWA support will be re-added once the core platform is stable.

self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
          caches.keys().then((keys) =>
                  Promise.all(keys.map((k) => caches.delete(k)))
                                 ).then(() =>
                  self.registration.unregister()
                                            ).then(() =>
                  self.clients.matchAll({ type: 'window' })
                                                       ).then((clients) => {
                  clients.forEach((client) => client.navigate(client.url));
          })
        );
});

// Pass through all fetch requests — never intercept or cache
self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request));
});
