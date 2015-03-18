'use strict';

/**
 * @ngdoc service
 * @name lurinfactsApp.PictureService
 * @description
 * # PictureService
 * Service in the lurinfactsApp.
 */
angular.module('lurinfacts')
    .factory('markerFactory', function ($http) {
        return {
            getMarkers: function () {
                return $http({
                    url: '/lurin.json',
                    method: 'GET'
                })
            }
        }
    });
