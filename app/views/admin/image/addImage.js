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
        .controller('AddImageCtrl', function ($scope, ImageResizeService, ImageLocationService, GeoLocationService, NotificationService, uiGmapGoogleMapApi) {
            var vm = this;
            vm.newPoint = {};
            vm.map = {};

            vm.marker = {
                key: new Date().getTime()
            };
            vm.markerevents = {
                dragend: function (marker) {
                    console.log('marker dragged');
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

            vm.reset = function () {
                vm.map = {
                    options: {},
                    center: {
                        latitude: 47,
                        longitude: 9
                    }
                };
                vm.newPoint = {
                    funFact: '',
                    imageTitle: '',
                    location: {},
                    insertTime : new Date().getTime()
                };
                vm.imageThumb = null;
                vm.imageSource = null;
            };

            vm.SetMarker = function (coords) {
                vm.marker = {
                    coords: coords,
                    key: new Date().getTime()
                };
            };
            vm.SetMap = function (coords) {
                uiGmapGoogleMapApi.then(function () {
                    vm.map.center = {
                        latitude: coords.latitude,
                        longitude: coords.longitude
                    };
                    vm.map.zoom = 5;
                });
                console.log('new marker position');
            };

            vm.currentPositionLoaded = function (position) {
                vm.updateLocationByCoords(position.coords);
                vm.SetMap(position.coords);
            };

            vm.updateLocationByCoords = function (coords) {
                GeoLocationService.getPositionByCoords(coords.latitude, coords.longitude).then(function (location) {
                    vm.newPoint.location = location;
                }, function (error) {
                    NotificationService.error('lurin hacked the application, something went druing address lookup.');
                    console.log('error on getPositionByCoords: ' + error);
                });
            };

            vm.getPositionByAddress = function () {
                GeoLocationService.getPositionByAddress(vm.newPoint.location.address).then(function (location) {
                    vm.newPoint.location = location;
                    var coords = {
                        latitude: location.latitude,
                        longitude: location.longitude
                    };
                    vm.SetMap(coords);
                    vm.SetMarker(coords);

                }, function (error) {
                    NotificationService.error('lurin hacked the application, something went druing address lookup.');
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
                    NotificationService.success('image successfully saved!');
                    vm.reset();
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

            vm.reset();
        });
}());