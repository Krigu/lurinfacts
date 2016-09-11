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
    .module('lurinfacts', ['ngMessages', 'ngRoute', 'uiGmapgoogle-maps', 'angular-flexslider', 'mgcrea.ngStrap', 'ngNotify', 'firebase'])
    .config(function ($routeProvider, uiGmapGoogleMapApiProvider) {

        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyCkg9lEDwpI3a_YteembM0t_iOmR3jdOD8',
            libraries: 'weather,geometry,visualization'
        });

        $routeProvider
            .when('/facts', {
                templateUrl: 'views/facts/facts.html',
                controller: 'FactsCtrl'
            })
            .when('/admin/addImage', {
                templateUrl: 'views/admin/image/addImage.html',
                controller: 'AddImageCtrl'
            })
            .when('/admin/manageImage', {
                templateUrl: 'views/admin/image/manageImage.html',
                controller: 'ManageImageCtrl'
            })
            .when('/admin/passwordChange', {
                templateUrl: 'views/admin/user/PasswordChange.html',
                controller: 'PasswordChangeCtrl'
            })
            .when('/admin/manageFacts', {
                templateUrl: 'views/admin/facts/manageFacts.html',
                controller: 'ManageFactsCtrl'
            })
            .when('/admin/manageProposals', {
                templateUrl: 'views/admin/facts/manageProposals.html',
                controller: 'ManageProposalCtrl'
            })
            .when('/map', {
                templateUrl: 'views/map/map.html',
                controller: 'MapCtrl'
            })
            .when('/contribute', {
                templateUrl: 'views/facts/contribute.html',
                controller: 'FactsCtrl'
            })
            .otherwise({
                redirectTo: '/facts'
            });
    });