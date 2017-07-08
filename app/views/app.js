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
    .config(function ($routeProvider, $locationProvider, uiGmapGoogleMapApiProvider) {
        $locationProvider.hashPrefix('');
        try {
            uiGmapGoogleMapApiProvider.configure({
                key: 'AIzaSyCkg9lEDwpI3a_YteembM0t_iOmR3jdOD8',
                libraries: 'weather,geometry,visualization'
            });
        } catch (err) {
            console.log('uiGmapGoogleMapApiProvider configuring failed', err);
        }

        $routeProvider
            .when('/facts', {
                templateUrl: 'views/facts/facts.html',
                controller: 'FactsCtrl'
            })
            .when('/home', {
                templateUrl: 'views/home/home.html',
                controller: 'HomeCtrl'
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
            .when('/images', {
                templateUrl: 'views/images/images.html',
                controller: 'ImagesCtrl',
                reloadOnSearch : false
            })
            .when('/images/?:imageKey', {
                templateUrl: 'views/images/images.html',
                controller: 'ImagesCtrl',
                reloadOnSearch : false
            })
            .when('/contribute', {
                templateUrl: 'views/facts/contribute.html',
                controller: 'FactsCtrl'
            })
            .otherwise({
                redirectTo: '/home'
            });

    });