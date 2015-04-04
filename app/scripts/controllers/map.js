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

            $scope.markers = {};

            $scope.selectedMarker = {};

            $scope.control = {};

            markerFactory.getMarkers().success(function (data) {
                $scope.markers = data;
            });

            uiGmapGoogleMapApi.then(function () {
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

            $scope.showWindow = function(show){
                $scope.windowOptions.show = show;
            };

            $scope.onClick = function (marker) {
                $scope.selectedMarker = marker.model;
                $scope.showWindow(!$scope.windowOptions.show);
            };

            $scope.closeClick = function () {
                $scope.showWindow(false);
            };

            $scope.zoom = function (marker) {
                $scope.selectedMarker = marker;

                var m = $scope.control.getGMap();
                m.panTo(new google.maps.LatLng(marker.latitude, marker.longitude));
                m.setZoom(6);

                $scope.showWindow(true);
            }


        }]);
})();
