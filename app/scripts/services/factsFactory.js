'use strict';

/**
 * @ngdoc service
 * @name lurinfactsApp.PictureService
 * @description
 * # PictureService
 * Service in the lurinfactsApp.
 */
angular.module('lurinfacts')
    .factory('factsFactory', function ($http) {
        return {
            getFacts: function () {
                return $http({
                    url: '/facts.json',
                    method: 'GET'
                });
            }
        };
    });
