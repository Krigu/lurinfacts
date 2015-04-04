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
    'ngMessages', 'ngRoute', 'uiGmapgoogle-maps',  'angular-flexslider', 'mgcrea.ngStrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/facts', {
        templateUrl: 'views/facts.html',
        controller: 'FactsCtrl'
      })
      .when('/map', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl'
      })
      .when('/contribute', {
        templateUrl: 'views/contribute.html',
        controller: 'FactsCtrl'
      })
      .otherwise({ redirectTo: '/facts' });
  });
