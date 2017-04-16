'use strict';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js').then(function (registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch(function (err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
var dbPromise = idb.open('lurinfacts', 2, function (upgradeDB) {
    if (upgradeDB.oldVersion < 1) {
        upgradeDB.createObjectStore('latestimages');
    }
    if (upgradeDB.oldVersion < 2) {
        upgradeDB.createObjectStore('images');
        upgradeDB.createObjectStore('facts');
    }
});