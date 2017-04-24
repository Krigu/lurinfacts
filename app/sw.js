
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
(global => {
  'use strict';

  // Load the sw-toolbox library.
  importScripts('../bower_components/sw-toolbox/sw-toolbox.js');

  toolbox.precache(urlsToCache);


  // The route for any requests from the googleapis origin
  toolbox.router.get('/(.*)', global.toolbox.cacheFirst, {
    origin: /\.cdn\.firebase\.com$/
  });

  toolbox.router.get('/(.*)', global.toolbox.cacheFirst, {
    origin: /\.maps\.googleapis\.com$/
  });

  toolbox.router.get('/(.*)', global.toolbox.cacheFirst, {
    origin: /\.cdn\.polyfill\.io$/
  });

  global.toolbox.router.default = global.toolbox.cacheFirst;
  global.toolbox.options.debug = true;

  // Ensure that our service worker takes control of the page as soon as possible.
  global.addEventListener('install', event => event.waitUntil(global.skipWaiting()));
  global.addEventListener('activate', event => event.waitUntil(global.clients.claim()));
})(self);
