
var CACHE_NAME = 'lurinfacts_v#CACHE_VERSION_PLACEHOLDER#';
var urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/views/home/home.html',
  '/views/facts/contribute.html',
  '/views/facts/facts.html',
  '/views/modal/modal-fact.html',
  '/views/modal/modal-image.html',
  '/views/settings/settings.html',
  '/views/images/images.html',
  '/views/admin/loginDirective.html',
  '/styles/main.css',
  '/images/header.png',
  'images/twitter_logo.png',
  '/scripts/scripts.js',
  '/scripts/vendor.js',
  '/styles/vendor.css',
  '/fonts/glyphicons-halflings-regular.eot',
  '/fonts/glyphicons-halflings-regular.woff2'
];
(global => {
  'use strict';

  // Load the sw-toolbox library.
  importScripts('../bower_components/sw-toolbox/sw-toolbox.js');
  toolbox.precache(urlsToCache);
  toolbox.options.debug = false;
  toolbox.router.default = global.toolbox.cacheFirst;

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

  //do not cache all big images
  toolbox.router.get('/(.*)', global.toolbox.networkOnly, {
    origin: /firebasestorage\.googleapis\.com$/
  });


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
      type: "message",
      title: "Lurin just like to say that he is watching you!",
      message: "",
      timestamp: new Date()
    };
  }

  function handlePushMessage(pushMsg) {
    console.log('handle push msg:' + pushMsg.type);
    var data = { url: '#/home'};
    if(pushMsg.itemKey && pushMsg.type == 'newfact' || pushMsg.type == 'randomfact'){
      data = { url: "#/facts?factKey="+pushMsg.itemKey };
    }
    if(pushMsg.itemKey && pushMsg.type == 'newimage' || pushMsg.type == 'randomimage'){
      data = { url: "#/images?imageKey="+pushMsg.itemKey };
    }

    const options = {
      badge: '/images/logo192m.png',
      icon: '/images/logo192m.png',
      body: pushMsg.message,
      data: data,
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
