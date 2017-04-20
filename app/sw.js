
var CACHE_NAME = 'lurinfacts_v#CACHE_VERSION_PLACEHOLDER#';
var urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/views/home/home.html',
  '/views/facts/contribute.html',
  '/views/facts/facts.html',
  '/views/images/images.html',
  '/views/admin/loginDirective.html',
  '/styles/main.css',
  '/images/header.png',
  '/scripts/init/idb.js',
  '/scripts/init/init.js',
  '/scripts/scripts.js',
  '/scripts/vendor.js'
  /*
  'https://cdn.firebase.com/js/simple-login/1.6.4/firebase-simple-login.js',
  'https://maps.googleapis.com/maps/api/js?key=AIzaSyCkg9lEDwpI3a_YteembM0t_iOmR3jdOD8',
  'https://cdn.polyfill.io/v2/polyfill.min.js'
  */
];

self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('Opened cache, adding', urlsToCache);
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function (event) {
  //console.log("fetch  "+event.request);
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response.
        var fetchRequest = event.request.clone();
        //console.log("not in cache "+event.request.clone());
        return fetch(fetchRequest).then(
          function (response) {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function (cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});