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


        function ImagesCtrl($scope) {
                $scope.locations = [];

                var fetchAll = function () {
                        return dbPromise.then(function (db) {
                                return db.transaction('images')
                                        .objectStore('images').getAll();
                        });
                };

                fetchAll().then(function (allObjs) {
                        console.log(allObjs);
                        allObjs.map(function (x) { 
                                $scope.locations.unshift(x);
                                $scope.$evalAsync();
                         });
                });
        }
})();