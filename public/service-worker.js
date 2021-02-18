console.log("Hello from service worker!");

const CACHE_NAME = 'static-cache-v2';
const RUNTIME_CACHE = "runtime-cache";
// const DATA_CACHE_NAME = 'data-cache-v1'


const urlsToCache = [
    "/",
    "/index.html",
    "/styles.css",
    "/index.js",
    "/db.js",
    "/manifest.webmanifest",
    'public/icons/icon-192.png',
  'public/icons/icon-512.png',
];


self.addEventListener("install", event => {
    event.waitUntil(
        caches
        .open(CACHE_NAME)
        .then(cache => cache.addAll(urlsToCache))
        .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", event => {
    const currentCaches = [CACHE_NAME, RUNTIME_CACHE];
    event.waitUntil(
        caches
        .keys()
        .then(cacheNames => {
           
            return cacheNames.filter(
                cacheName => !currentCaches.includes(cacheName)
            );
        })
        .then(cachesToDelete => {
            return Promise.all(
                cachesToDelete.map(cacheToDelete => {
                    return caches.delete(cacheToDelete);
                })
            );
        })
        .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {
    
    if (
        event.request.method !== "GET" ||
        !event.request.url.startsWith(self.location.origin)
    ) {
        event.respondWith(fetch(event.request));
        return;
    }

    
    if (event.request.url.includes("/api/")) {
    
        event.respondWith(
            caches.open(RUNTIME_CACHE).then(cache => {
                return fetch(event.request)
                    .then(response => {
                        cache.put(event.request, response.clone());
                        return response;
                    })
                    .catch(() => caches.match(event.request));
            })
        );
        return;
    }


    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }

        
            return caches.open(RUNTIME_CACHE).then(cache => {
                return fetch(event.request).then(response => {
                    return cache.put(event.request, response.clone()).then(() => {
                        return response;
                    });
                });
            });
        })
    );
});

