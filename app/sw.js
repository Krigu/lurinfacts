
var CACHE_NAME = 'lurinfacts_v#CACHE_VERSION_PLACEHOLDER#';
var urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/views/home/home.html',
  '/views/facts/contribute.html',
  '/views/facts/facts.html',
  '/views/module/module.html',
  '/views/images/images.html',
  '/views/admin/loginDirective.html',
  '/styles/main.css',
  '/images/header.png',
  '/scripts/scripts.js',
  '/scripts/vendor.js'
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
