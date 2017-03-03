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
                .controller('HomeCtrl', ['$scope', 'factsFactory', 'ImageLocationService', function ($scope, factsFactory, ImageLocationService) {
                        $scope.facts = [];
                        $scope.locations = [];
                        ImageLocationService.latestLocation(2).on("child_added", function (snapshot) {
                                //console.log("location ", snapshot.val())
                                $scope.locations.unshift(snapshot.val());
                        });

                        $scope.facts = [];
                        factsFactory.latestFacts(3).on("child_added", function (snapshot) {
                                //console.log("snapshot", snapshot.val())
                                $scope.facts.unshift(snapshot.val());
                        });
                }]);
})();