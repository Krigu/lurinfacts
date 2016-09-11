(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name lurinfacts.controller:MapCtrl
     * @description
     * # MapCtrl
     * Controller of lurinfacts
     */
    angular.module('lurinfacts')
        .controller('PasswordChangeCtrl', function ($scope, LoginService,NotificationService) {

            $scope.requestCode = function () {
                LoginService.resetPasswordRequest($scope.email).then(function(){
                    NotificationService.success('the email is on it\'s way, don\'t let lurin steal it');
                })
            };
        });
} ());