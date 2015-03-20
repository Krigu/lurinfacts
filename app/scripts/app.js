'use strict';

/**
 * @ngdoc overview
 * @name lurinfacts
 * @description
 * # lurinfacts
 *
 * Main module of the application.
 */
angular
    .module('lurinfacts', [
        'ngRoute', 'uiGmapgoogle-maps', 'angular-flexslider'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/map.html',
                controller: 'MapCtrl'
            })
            .otherwise({
                redirectTo: 'views/map.html'
            });
    });
