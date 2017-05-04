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

        var init = function () {
            return fetchFromCache().then(function (allObjs) {
                allObjs.map(function (x) { vm.markers.unshift(x); });
            }).then(checkIfNewImage);
        };

        var fetchFromCache = function () {
            return dbPromise.then(function (db) {
                return db.transaction('images')
                    .objectStore('images').getAll();
            });
        };


        var checkIfNewImage = function () {
            ImageLocationService.locationsAsArray().on('child_added', function (snapshot) {
                var isNewMarker = !vm.markers.filter(function (x) { return x.imageKey === snapshot.val().imageKey; }).length;
                if (isNewMarker) {
                    vm.markers.unshift(snapshot.val());
                    addImageToCache(snapshot.val());
                }
            });
        };

        var addImageToCache = function (img) {
            img.inserted = new Date();
            //console.log('add entry to indexedDB ' + img.imageTitle, img.inserted);
            dbPromise.then(function (db) {
                const tx = db.transaction('images', 'readwrite');
                tx.objectStore('images').put(img, img.imageKey);
                return tx.complete;
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
