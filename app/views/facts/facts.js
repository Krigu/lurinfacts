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
        .controller('FactsCtrl', ['$scope', 'factsFactory', 'NotificationService', function ($scope, $factsFactory, NotificationService) {

            $scope.name = 'FactsCtrl';

            $scope.facts = [];

            $scope.update = function (fact) {
                fact.insertTime = new Date().getTime();
                $factsFactory.saveProposal(fact).then(function () {
                    $scope.fact = {};
                    $scope.factsForm.$setPristine();
                    NotificationService.success('fact added, lurin will decide if it\'s worth it');
                }, function () {
                    NotificationService.error('lurin doesn\'t like this fact, error during save.');
                });
            };

            $scope.isInvalid = function () {
                return $scope.factsForm.$dirty && $scope.factsForm.$invalid;
            };


            var init = function () {
                return FetchFromCache().then(function (allObjs) {
                    allObjs.map(function (x) { $scope.facts.unshift(x) });
                }).then(checkIfNewImage);
            };

            var FetchFromCache = function () {
                return dbPromise.then(function (db) {
                    return db.transaction('facts')
                        .objectStore('facts').getAll();
                });
            };


            var checkIfNewImage = function () {
                $factsFactory.factsAsFirebaseRef().on("child_added", function (snapshot) {
                    var isNewFact = !$scope.facts.filter(function (x) { return x.key == snapshot.key }).length;
                    if (isNewFact) {
                        $scope.facts.unshift(snapshot.val());
                        AddFactToCache(snapshot.val(),snapshot.key);
                    }
                });
            };
            var AddFactToCache = function (img,key) {
                img.key = key;
                img.inserted = new Date();
                //console.log('add entry to indexedDB ' + img.imageTitle, img.inserted);
                dbPromise.then(function (db) {
                    const tx = db.transaction('facts', 'readwrite');
                    tx.objectStore('facts').put(img, img.key);
                    return tx.complete;
                });
            };
            init();
        }]);
})();