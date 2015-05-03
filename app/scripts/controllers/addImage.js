(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name lurinfacts.controller:addImages
     * @description
     * # MapCtrl
     * Controller of lurinfacts
     */
    angular.module('lurinfacts')
        .controller('AddImageCtrl', function ($scope, ImageResizeService, ImageLocationService, GeoLocationService, NotificationService) {
            var vm = this;
            vm.title = 'Neues Bild hinzufügen';
            vm.newPoint = {
                funFact: '',
                imageTitle: '',
                location: ''
            };
            vm.map = {};
            vm.map.options = {};
            vm.map.control = {};
            vm.map.zoom = 5;

            vm.markerevents = {
                dragend: function (marker) {
                    console.log('marker dragend');
                    var lat = marker.getPosition().lat();
                    var lon = marker.getPosition().lng();
                    var coords = {
                        latitude: lat,
                        longitude: lon
                    };
                    vm.SetMarker(coords);
                    vm.updateLocationByCoords(coords);
                }
            };
            vm.SetMarker = function (coords) {
                vm.marker = {
                    coords: coords,
                    key: new Date().getTime()
                };
            };
            vm.SetMap = function (coords) {
                console.log('new marker position');
                vm.map.center = coords;
            };

            vm.currentPositionLoaded = function (position) {
                vm.updateLocationByCoords(position.coords);
                vm.SetMap(position.coords);
                vm.SetMarker(position.coords);
            };

            vm.updateLocationByCoords = function (coords) {
                GeoLocationService.getPositionByCoords(coords.latitude, coords.longitude).then(function (location) {
                    vm.newPoint.location = location;
                }, function (error) {
                    console.log('error on getPositionByCoords: ' + error);
                });
            };

            vm.getPositionByAddress = function () {
                GeoLocationService.getPositionByAddress(vm.newPoint.location.address).then(function (location) {
                    vm.newPoint.location = location;
                    var coords = {
                        latitude: location.lat,
                        longitude: location.lng
                    };
                    vm.SetMap(coords);
                    vm.SetMarker(coords);

                }, function (error) {
                    console.log('error on getPositionByAddress: ' + error);
                });

            };

            vm.uploadedFileChanged = function (el) {
                var f = el.files[0];
                var reader = new FileReader();
                reader.onload = (function () {
                    console.log('file read');
                    return function () {
                        //vm.imageSource = reader.result;
                        var promiseThumb = ImageResizeService.resize(reader.result, 200);
                        promiseThumb.then(function (img) {
                            vm.imageThumb = img;
                            console.log('thumb created');
                            // $scope.$apply();
                        }, function (reason) {
                            console.log('thumb create failed: ' + reason);
                        });
                        var promise = ImageResizeService.resize(reader.result, 1024);
                        promise.then(function (img) {
                            vm.imageSource = img;
                            console.log('image created');
                            // $scope.$apply();
                        }, function (reason) {
                            console.log('image created failed: ' + reason);
                        });
                    };
                })(f);
                reader.readAsDataURL(f);
            };
            vm.imagesLoaded = function () {
                return vm.imageThumb && vm.imageSource;

            };

            vm.SavePicture = function () {
                console.log('start saving everything');
                ImageLocationService.saveLocation(vm.newPoint, vm.imageSource, vm.imageThumb).then(function (data) {
                    console.log('everything saved under: ' + data[0]);
                    vm.imageThumb = null;
                    vm.imageSource = null;
                    vm.newPoint = null;
                    NotificationService.success('image successfully saved!');
                }, function (error) {
                    console.log('error during save: ' + error);
                    NotificationService.error('lurin hacked the application, something went wrong during save.');
                });
            };

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(vm.currentPositionLoaded);
            } else {
                vm.getPositionByAddress('schilthorn, mürren');
            }
        });
}());