(function () {
    'use strict';
    angular.module('lurinfacts')
        .controller('MenuCtrl', ['$scope', 'LoginService', function ($scope, LoginService) {
            var vm = this;
            vm.name = 'MenuCtrl';
            vm.isLoggedIn = false;
            vm.isOnline = navigator.onLine;

            $scope.$watch(function () { return navigator.onLine; },
                function (newValue) {
                    vm.isOnline = newValue;
                    console.log('is onLine '+newValue);
                });

            $scope.$watch(LoginService.isUserLoggedIn, function (newVal) {
                console.log('menu: login status changed : user logged in: ' + newVal);
                vm.isLoggedIn = newVal;
            });
        }]);
}());