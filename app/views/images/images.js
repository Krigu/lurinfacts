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
                .controller('ImagesCtrl', ['$scope', ImagesCtrl]);


        function ImagesCtrl($scope, factsFactory, ImageLocationService) {
                $scope.locations = [];

                var FetchAll = function () {
                        return dbPromise.then(function (db) {
                                return db.transaction('images')
                                        .objectStore('images').getAll();
                        });
                };

                FetchAll().then(function (allObjs) {
                        console.log(allObjs);
                        allObjs.map(function (x) { 
                                $scope.locations.unshift(x);
                                $scope.$evalAsync()
                         });
                });
        };
})();