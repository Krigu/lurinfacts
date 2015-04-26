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
    'ngMessages', 'ngRoute', 'uiGmapgoogle-maps', 'angular-flexslider', 'mgcrea.ngStrap',
    'firebase'
  ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/facts', {
                templateUrl: 'views/facts.html',
                controller: 'FactsCtrl'
            })
            .when('/admin/addImage', {
                templateUrl: 'views/admin/addImage.html',
                controller: 'AddImageCtrl'
            })
            .when('/admin/manageImage', {
                templateUrl: 'views/admin/manageImage.html',
                controller: 'ManageImageCtrl'
            })
            .when('/admin/manageFacts', {
                templateUrl: 'views/admin/manageFacts.html',
                controller: 'ManageFactsCtrl'
            })
            .when('/map', {
                templateUrl: 'views/map.html',
                controller: 'MapCtrl'
            })
            .when('/contribute', {
                templateUrl: 'views/contribute.html',
                controller: 'FactsCtrl'
            })
            .otherwise({
                redirectTo: '/facts'
            });
    });