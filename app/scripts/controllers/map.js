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

            var self = this;

            this.map = {};

            this.markers = {}

            markerFactory.getMarkers().success(function(data){
                self.markers=data;
            });

            uiGmapGoogleMapApi.then(function (maps) {
                angular.extend(self.map, {
                    center: {
                        latitude: 26.949573,
                        longitude: 7.446969
                    },
                    zoom: 3,
                    control: {}
                });

            });
        }])
})();