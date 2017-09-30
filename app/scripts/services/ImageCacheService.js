(function () {
    'use strict';
    angular.module('lurinfacts')
        .factory('ImageCacheService', ImageCacheService);
    ImageCacheService.$inject = ['ImageLocationService', '$q'];

    function ImageCacheService(ImageLocationService, $q) {
        var cachedImages = [];

        var fetchCachedImages = function (onImageLoaded) {
            return fetchFromCache().then(function (allObjs) {
                allObjs.map(function (x) { onImageLoaded(x); });
                //only do it in the next tick
                setTimeout(function(){checkIfNewImage(onImageLoaded)},0);
            });
        };

        var fetchFromCache = function () {
            if (cachedImages.length > 0) {
                return $q.resolve(cachedImages);
            }

            return dbPromise.then(function (db) {
                return db.transaction('images').objectStore('images').getAll();

            }).then(function (images) {
                cachedImages.push.apply(cachedImages, images);
                return images;
            });
        };


        var checkIfNewImage = function (onImageLoaded) {
            ImageLocationService.locationsAsArray().on('child_added', function (snapshot) {
                var isNewMarker = !cachedImages.filter(function (x) { return x.imageKey === snapshot.val().imageKey; }).length;
                if (isNewMarker) {
                    onImageLoaded(snapshot.val());
                    addImageToCache(snapshot.val());
                }
            });
        };

        var addImageToCache = function (img) {
            img.inserted = new Date();
            dbPromise.then(function (db) {
                var tx = db.transaction('images', 'readwrite');
                tx.objectStore('images').put(img, img.imageKey);
                console.log('add entry to indexedDB ' + img.imageTitle, img.inserted);
                return tx.complete;
            });
        };
        return { fetchCachedImages: fetchCachedImages };
    }
})();