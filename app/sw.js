
var CACHE_NAME = 'lurinfacts_v#CACHE_VERSION_PLACEHOLDER#';
var urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/views/home/home.html',
  '/views/facts/contribute.html',
  '/views/facts/facts.html',
  '/views/modal/modal.html',
  '/views/settings/settings.html',
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


  self.addEventListener('push', function (event) {
    if (event.data) {
      console.log('This push event has data: ', event.data.text());
    } else {
      console.log('This push event has no data.');
    }

    var pushMsg = convertMessage(event.data);
    if (pushMsg.type) {
      event.waitUntil(handlePushMessage(pushMsg));
    } else {
      console.log('This push event has no pushType.');
    }
  });

  function convertMessage(data) {
    try {
      return data.json();
    } catch (err) {
      console.log('could not jsonize ' + data.text(), err)
    }
    //return test message!
    return {
      type: "newfact",
      title: "new fact!",
      msg: "Lurin already got this push message",
      url: '#/images?imageKey=-Kb6rYfGtAZlbiVHGRuv',
      timestamp: new Date()
    };
  }

  function handlePushMessage(pushMsg) {
    console.log('handle push msg:' + pushMsg.pushType);

    const options = {
      badge: '/images/logo192m.png',
      icon: '/images/logo192m.png',
      body: pushMsg.msg,
      data: { url: pushMsg.url },
      vibrate: [500, 110, 500],
      timestamp: pushMsg.timestamp
    };

    return self.registration.showNotification(pushMsg.title, options);
  }

  self.addEventListener('notificationclick', function (event) {
    console.log('notificationclick: ', event);
    const clickedNotification = event.notification;
    clickedNotification.close();

    const lurinfactsLink = self.location.origin + '/'+ (clickedNotification.data && clickedNotification.data.url)  || '/';
    
    const promiseChain = clients.openWindow(lurinfactsLink);
    event.waitUntil(promiseChain);
  });

})(self);
