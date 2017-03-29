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
    .module('lurinfacts', ['ngMessages', 'ui.router', 'uiGmapgoogle-maps', 'angular-flexslider', 'mgcrea.ngStrap', 'ngNotify', 'firebase'])
    .config(function ($stateProvider, $locationProvider, uiGmapGoogleMapApiProvider) {
        $locationProvider.hashPrefix('');
        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyCkg9lEDwpI3a_YteembM0t_iOmR3jdOD8',
            libraries: 'weather,geometry,visualization'
        });

        $stateProvider
            .state('facts', {
                url: '/facts',
                templateUrl: 'views/facts/facts.html',
                controller: 'FactsCtrl'
            })
            .state('home', {
                url: '/home',
                templateUrl: 'views/home/home.html',
                controller: 'HomeCtrl'
            })
            .state('admin_addImage', {
                url: '/admin/addImage',
                templateUrl: 'views/admin/image/addImage.html',
                controller: 'AddImageCtrl'
            })
            .state('admin_manageImage', {
                url: '/admin/manageImage',
                templateUrl: 'views/admin/image/manageImage.html',
                controller: 'ManageImageCtrl'
            })
            .state('admin_passwordChange', {
                url: '/admin/passwordChange',
                templateUrl: 'views/admin/user/PasswordChange.html',
                controller: 'PasswordChangeCtrl'
            })
            .state('admin_manageFacts', {
                url: '/admin/manageFacts',
                templateUrl: 'views/admin/facts/manageFacts.html',
                controller: 'ManageFactsCtrl'
            })
            .state('admin_manageProposals', {
                url: '/admin/manageProposals',
                templateUrl: 'views/admin/facts/manageProposals.html',
                controller: 'ManageProposalCtrl'
            })
            .state('map', {
                url: '/map',
                templateUrl: 'views/map/map.html',
                controller: 'MapCtrl',
            })
            .state('images', {
                url: '/images',
                templateUrl: 'views/images/images.html',
                controller: 'ImagesCtrl',
            })
            .state('contribute', {
                url: '/contribute',
                templateUrl: 'views/facts/contribute.html',
                controller: 'FactsCtrl'
            });
    });