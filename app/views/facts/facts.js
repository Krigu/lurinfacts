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
        .controller('FactsCtrl', ['$scope', '$routeParams', 'factsFactory', '$location', 'NotificationService', function ($scope, $routeParams, $factsFactory, $location, NotificationService) {

            $scope.name = 'FactsCtrl';

            $scope.facts = [];

            $scope.update = function (fact) {
                if (!navigator.onLine) {
                    NotificationService.error('Your internet connection is lost and lurin couldn\'t fix it. try later.');
                    return;
                }
                fact.insertTime = new Date().getTime();
                $factsFactory.saveProposal(fact).then(function () {
                    $scope.fact = {};
                    $scope.factsForm.$setPristine();
                    NotificationService.success('fact added, lurin will decide if it\'s worth it');
                }, function () {
                    NotificationService.error('lurin doesn\'t like this fact, error during save.');
                });
            };

            $scope.selectFact = function (fact) {
                $scope.selectedFact = fact;
                $location.search('factKey=' + fact.key);
            };

            $scope.isInvalid = function () {
                return $scope.factsForm.$dirty && $scope.factsForm.$invalid;
            };


            var init = function () {
                return fetchFromCache().then(function (allObjs) {
                    allObjs.map(function (x) {
                        $scope.facts.unshift(x);
                        if ($routeParams.factKey === x.key) {
                            $scope.selectFact(x);
                        }
                    });
                    $scope.$evalAsync();
                }).then(checkIfNewFact);
            };

            var fetchFromCache = function () {
                return dbPromise.then(function (db) {
                    return db.transaction('facts')
                        .objectStore('facts').getAll();
                });
            };


            var checkIfNewFact = function () {
                $factsFactory.factsAsFirebaseRef().on('child_added', function (snapshot) {
                    var isNewFact = !$scope.facts.filter(function (x) { return x.key === snapshot.key; }).length;
                    var fact = snapshot.val();
                    if (isNewFact) {
                        if ($routeParams.factKey === snapshot.key) {
                            $scope.selectFact(fact);
                        }
                        $scope.facts.unshift(fact);
                        addFactToCache(fact, snapshot.key);
                    }
                });
            };
            var addFactToCache = function (fact, key) {
                fact.key = key;
                fact.inserted = new Date();
                dbPromise.then(function (db) {
                    var tx = db.transaction('facts', 'readwrite');
                    tx.objectStore('facts').put(fact, fact.key);
                    return tx.complete;
                });
            };
            init();
        }]);


})();