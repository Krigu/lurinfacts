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
                $scope.selectedLocation = {};

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

                $scope.selectImage = function (location) {
                        var idx = getLocationIndex(location.imageKey);
                        $scope.selectedLocation = prepareLocation(saveIndex(idx));
                }

                var getLocationIndex = function (imageKey) {
                        for (var i = 0; i < $scope.locations.length; i++) {
                                if ($scope.locations[i].imageKey == imageKey) {
                                        return i;
                                }
                        }
                        return 0;
                }

                var prepareLocation = function (idx) {
                        var l = $scope.locations[idx];
                        l.previousLocation = $scope.locations[saveIndex(idx - 1)];
                        l.nextLocation = $scope.locations[saveIndex(idx + 1)];
                        return l;
                }

                var saveIndex = function (idx) {
                        //handles index overflows and underflows
                        return (idx < 0 ? $scope.locations.length - 1 : idx) >= $scope.locations.length ? 0 : idx;
                }

                $scope.handler = {
                        nextImage: function (loc) {
                                var idx = getLocationIndex(loc.imageKey);
                                idx++;
                                return prepareLocation(saveIndex(idx));
                        },
                        previousImage: function (loc) {
                                var idx = getLocationIndex(loc.imageKey);
                                idx--;
                                return prepareLocation(saveIndex(idx));
                        }

                };

        }
})();