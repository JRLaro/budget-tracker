console.log("Hello from service worker!");

const CACHE_NAME = "cached-static";
const DATA_CACHE_NAME = "cache-c";


const URLS_TO_CACHE = [
    "/",
    "/index.html", 
    "/styles.css",
    "/index.js",
    "/db.js",
    "/manifest.webmanifest",
    "/icons/icon-192.png",
    "/icons/icon-512.png",
];



// install
self.addEventListener("install", function(evt) {
    evt.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
        console.log("Your files were pre-cached successfully!");
        return cache.addAll(URLS_TO_CACHE);
      })
    );
  
    self.skipWaiting();
  });
  

// Activate
  self.addEventListener("activate", function(evt) {
    evt.waitUntil(
      caches.keys().then(keyList => {
        return Promise.all(
          keyList.map(key => {
            if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
              console.log("Removing old cache data", key);
              return caches.delete(key);
            }
          })
        );
      })
    );
  
    self.clients.claim();
  });
  
  // Fetch
  self.addEventListener("fetch", function(evt) {
    // cache successful requests to the API
    if (evt.request.url.includes("/api/")) {
      evt.respondWith(
        caches.open(DATA_CACHE_NAME).then(cache => {
          return fetch(evt.request)
            .then(response => {
              // If the response was good, clone it and store it in the cache.
              if (response.status === 200) {
                cache.put(evt.request.url, response.clone());
              }
  
              return response;
            })
            .catch(err => {
              // Network request failed, try to get it from the cache.
              return cache.match(evt.request);
            });
        }).catch(err => console.log(err))
      );
  
      return;
    }
  
    // if the request is not for the API, serve static assets using "offline-first" approach.
    // see https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#cache-falling-back-to-network
    evt.respondWith(
      caches.match(evt.request).then(function(response) {
        return response || fetch(evt.request);
      })
    );
  });
  










// self.addEventListener("install", event => {
//     event.waitUntil(
//         caches
//         .open(CACHE_NAME)
//         .then(cache => cache.addAll(urlsToCache))
//         .then(() => self.skipWaiting())
//     );
// });

// self.addEventListener("activate", event => {
//     const currentCaches = [CACHE_NAME, DATA_CACHE_NAME];
//     event.waitUntil(
//         caches
//         .keys()
//         .then(cacheNames => {
           
//             return cacheNames.filter(
//                 cacheName => !currentCaches.includes(cacheName)
//             );
//         })
//         .then(cachesToDelete => {
//             return Promise.all(
//                 cachesToDelete.map(cacheToDelete => {
//                     return caches.delete(cacheToDelete);
//                 })
//             );
//         })
//         .then(() => self.clients.claim())
//     );
// });

// self.addEventListener("fetch", event => {
    
//     if (
//         event.request.method !== "GET" ||

//     ) {
//         event.respondWith(fetch(event.request));
//         return;
//     }

    
//     if (event.request.url.includes("/api/")) {
    
//         event.respondWith(
//             caches.open(DATA_CACHE_NAME).then(cache => {
//                 return fetch(event.request)
//                     .then(response => {
//                         cache.put(event.request, response.clone());
//                         return response;
//                     })
//                     .catch(() => caches.match(event.request));
//             })
//         );
//         return;
//     }


//     event.respondWith(
//         caches.match(event.request).then(cachedResponse => {
//             if (cachedResponse) {
//                 return cachedResponse;
//             }

        
//             return caches.open(DATA_CACHE_NAME).then(cache => {
//                 return fetch(event.request).then(response => {
//                     return cache.put(event.request, response.clone()).then(() => {
//                         return response;
//                     });
//                 });
//             });
//         })
//     );
// });

