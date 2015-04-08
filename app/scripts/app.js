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
    'ngRoute',
    'firebase'
  ])
  .config(function($routeProvider) {
    $routeProvider
      .when('/admin/addImage', {
        templateUrl: 'views/admin/addImage.html',
        controller: 'AddImageCtrl'
      }).when('/admin/manageImage', {
        templateUrl: 'views/admin/manageImage.html',
        controller: 'ManageImageCtrl'
      })
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
