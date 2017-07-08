(function () {
    'use strict';
    angular.module('lurinfacts')
        .controller('MenuCtrl', ['$scope', 'LoginService', function ($scope, LoginService) {
            var vm = this;
            vm.name = 'MenuCtrl';
            vm.isLoggedIn = false;

            $scope.$watch(LoginService.isUserLoggedIn, function (newVal) {
                console.log('menu: login status changed : user logged in: ' + newVal);
                vm.isLoggedIn = newVal;
            });
        }]);
}());