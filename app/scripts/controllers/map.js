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
        .controller('MapCtrl', MapCtrl);
    MapCtrl.$inject = ['$scope', 'markerFactory', 'ImageLocationService', 'uiGmapGoogleMapApi'];

    function MapCtrl($scope, markerFactory, ImageLocationService, uiGmapGoogleMapApi) {
        var vm = this;
        $scope.map = {
            center: {
                latitude: 26.949573,
                longitude: 7.446969
            },
            zoom: 3,
            control: {}
        };

        $scope.markers = {};

        $scope.selectedMarker = {};

        $scope.control = {};

        vm.markers = ImageLocationService.locationsAsFirebaseArray();

        uiGmapGoogleMapApi.then(function () {
            console.log('uiGmapGoogleMapApi ready.')
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
            var long = marker.location.longitude;
            var m = $scope.control.getGMap();
            m.panTo(new google.maps.LatLng(lat, long));
            m.setZoom(6);

            $scope.showWindow(true);
        };

        $scope.markersEvents = {

            mouseover: function (gMarker, eventName, model) {
                
                $scope.selectedMarker = model;
                $scope.showWindow(true);
                //model.show = true;
                //$scope.$apply();
            }
        };

    };
})();
