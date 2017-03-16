'use strict';

/**
 * @ngdoc function
 * @name lurinfacts.controller:FactsCtrl
 * @description
 * # FactsCtrl
 * Controller of lurinfacts
 */
(function () {
        angular.module('lurinfacts')
                .controller('HomeCtrl', ['$scope', 'factsFactory', 'ImageLocationService', HomeCtrl]);


        function HomeCtrl($scope, factsFactory, ImageLocationService) {
                $scope.facts = [];
                $scope.locations = [];

                var FetchAll = function () {
                        return dbPromise.then(function (db) {
                                return db.transaction('latestimages')
                                        .objectStore('latestimages').getAll();
                        });
                };

                FetchAll().then(function (allObjs) {
                        console.log(allObjs);
                        allObjs.map(function (x) { $scope.locations.unshift(x) });
                });

                var DeleteOldEntries = function () {
                        FetchAll().then(function (all) {
                                all
                                        .sort(function (a, b) { return b.inserted.getTime() - a.inserted.getTime() })
                                        .filter(function (x, idx) { return idx >= 2 })
                                        .map(DeleteOldEntry);
                        })
                };

                var DeleteOldEntry = function (img) {
                        console.log('delete entry from indexedDB ' + img.imageTitle);
                        dbPromise.then(function (db) {
                                return db.transaction('latestimages', 'readwrite')
                                        .objectStore('latestimages').delete(img.imageKey);
                        }).then(function (obj) { console.log(obj) });
                };

                var AddImageToCache = function (img) {
                        img.inserted = new Date();
                        console.log('add entry to indexedDB ' + img.imageTitle, img.inserted);
                        dbPromise.then(function (db) {
                                const tx = db.transaction('latestimages', 'readwrite');
                                tx.objectStore('latestimages').put(img, img.imageKey);
                                return tx.complete;
                        }).then(DeleteOldEntries)
                }

                ImageLocationService.latestLocation(2).on("child_added", function (snapshot) {
                        //not added yet
                        if (!$scope.locations.filter(function (x) { return x.imageKey == snapshot.val().imageKey }).length) {
                                $scope.locations.unshift(snapshot.val());
                        }
                        AddImageToCache(snapshot.val());
                });



                $scope.facts = [];
                factsFactory.latestFacts(3).on("child_added", function (snapshot) {
                        //console.log("snapshot", snapshot.val())
                        $scope.facts.unshift(snapshot.val());
                });
        };
})();