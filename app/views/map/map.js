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
    MapCtrl.$inject = ['$scope', 'ImageCacheService', 'uiGmapGoogleMapApi','NotificationService'];

    function MapCtrl($scope, ImageCacheService, uiGmapGoogleMapApi,NotificationService) {
        var vm = this;
        $scope.map = {
            center: {
                latitude: 26.949573,
                longitude: 7.446969
            },
            zoom: 3,
            control: {}
        };

        $scope.$watch(function () { return navigator.onLine; },
            function (isOnline) {
                vm.isOnline = isOnline;
                console.log('is onLine ' + isOnline);
                if(!isOnline){
                    var txt = 'Lurin saw that you are offline. Google Maps do only work properly online.<br/> <a href="#/images"> Do you like to see only the images instead?</a>';
                    NotificationService.warn(txt, {duration: 12000,html: true});
                }
            });

        $scope.selectedMarker = {};

        $scope.control = {};

        vm.markers = [];

        var init = function () {
            return ImageCacheService.fetchCachedImages(function (x) { vm.markers.unshift(x); }).then(function () {
                console.log('images loaded');
            });
        };

        uiGmapGoogleMapApi.then(function () {
            console.log('uiGmapGoogleMapApi ready.');
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
            }
        };

        init();
    }
})();
