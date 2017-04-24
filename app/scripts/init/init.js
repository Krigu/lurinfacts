'use strict';

// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', function () {
//         navigator.serviceWorker.register('sw.js').then(function (registration) {
//             // Registration was successful
//             console.log('ServiceWorker registration successful with scope: ', registration.scope);
//         }).catch(function (err) {
//             // registration failed :(
//             console.log('ServiceWorker registration failed: ', err);
//         });
//     });
// }
var dbPromise = idb.open('lurinfacts', 2, function (upgradeDB) {
    if (upgradeDB.oldVersion < 1) {
        upgradeDB.createObjectStore('latestimages');
    }
    if (upgradeDB.oldVersion < 2) {
        upgradeDB.createObjectStore('images');
        upgradeDB.createObjectStore('facts');
    }
});

window.setTimeout(function () {
    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date();
        a = s.createElement(o),
            m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m)
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

    ga('create', 'UA-XXXXX-X');
    ga('send', 'pageview');
}, 2000);