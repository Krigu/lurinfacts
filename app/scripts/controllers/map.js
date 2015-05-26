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
        .controller('MapCtrl', ['$scope', 'markerFactory', 'ImageLocationService', 'uiGmapGoogleMapApi', function ($scope, markerFactory, ImageLocationService, uiGmapGoogleMapApi) {
            var vm = this;
            $scope.map = {};

            $scope.markers = {};

            $scope.selectedMarker = {};

            $scope.control = {};

            vm.markers = ImageLocationService.locationsAsFirebaseArray();
            /*
                        ImageLocationService.locationsAsArray().once("child_added", function (data) {
                            $scope.markers = data;
                        });
                        */
            //            markerFactory.getMarkers().success(function (data) {
            //                $scope.markers = data;
            //            });

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

            $scope.showWindow = function (show) {
                $scope.windowOptions.show = show;
            };

            $scope.onClick = function (marker) {
                $scope.selectedMarker = marker.model;
                $scope.showWindow(true);
            };

            $scope.closeClick = function () {
                $scope.showWindow(false);
            };

            $scope.zoom = function (marker) {
                $scope.selectedMarker = marker;
                var lat = marker.location.latitude;
                var long =  marker.location.longitude;
                var m = $scope.control.getGMap();
                m.panTo(new google.maps.LatLng(lat, long));
                m.setZoom(6);

                $scope.showWindow(true);
            };


        }]);
})();
