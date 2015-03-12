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
        .controller('MapCtrl', ['$scope', 'uiGmapGoogleMapApi',
            '$interval', '$timeout', 'uiGmapGmapUtil',
            function ($scope, uiGmapGoogleMapApi, $interval, $timeout, uiGmapGmapUtil) {
                this.map = {};
                var self = this;
                uiGmapGoogleMapApi.then(function (maps) {
                    angular.extend(self.map, {
                        center: {
                            latitude: 42.194576,
                            longitude: -122.709477
                        },
                        zoom: 13,
                        control: {}
                    });

                });
            }])
})();
