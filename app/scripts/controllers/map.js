'use strict';

/**
 * @ngdoc function
 * @name lurinfacts.controller:MapCtrl
 * @description
 * # MapCtrl
 * Controller of lurinfacts
 */
(function () {
    angular.module('lurinfacts')
        .controller('MapCtrl', ['$scope', 'markerFactory', 'uiGmapGoogleMapApi', function ($scope, markerFactory, uiGmapGoogleMapApi) {

            $scope.map = {};

            $scope.markers = {}

            $scope.selectedMarker = {};

            markerFactory.getMarkers().success(function (data) {
                $scope.markers = data;
            });

            uiGmapGoogleMapApi.then(function (maps) {
                angular.extend($scope.map, {
                    center: {
                        latitude: 26.949573,
                        longitude: 7.446969
                    },
                    zoom: 3,
                    control: {}
                });

            });

            $scope.windowOptions = {
                show: false
            };

            $scope.onClick = function (marker) {
                $scope.selectedMarker = marker.model;
                $scope.windowOptions.show = !$scope.windowOptions.show;
            };

            $scope.closeClick = function () {
                $scope.windowOptions.show = false;
            };


        }])
})();