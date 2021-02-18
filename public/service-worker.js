// console.log("Hello from service worker!");

// const CACHE_NAME = 'static-cache-v2';
// const DATA_CACHE_NAME = 'data-cache-v1'

// const urlsToCache = [
//   '/',
//     'public/index.html',
//   'public/styles.css',
//     '/manifest.webmanifest',
//     'public/icons/icon-192.png',
//   'public/icons/icon-512.png',
// ];

// self.addEventListener('install', function(event) {
//   event.waitUntil(
//     caches.open(CACHE_NAME)
//       .then(function(cache) {
//         return cache.addAll(urlsToCache);
//       })
//   );
// });

// self.addEventListener('fetch', function(event) {
//     event.respondWith(
//         fetch(event.request)
//             .then(function (response) {
//                 caches.open(CACHE_NAME).then(function (cache) {
//                     cache.put(event.request, response);
//                 });
//             })
//             .catch(function () {
//                 caches.match(event.request).then(function (response) {
//                     return response;
//                 }
//                 );
//             })
//     )
// });


