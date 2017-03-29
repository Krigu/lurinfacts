(function () {
    'use strict';
    angular.module('lurinfacts')
        .controller('MenuCtrl', ['$scope', 'LoginService','OnlineSerivce', function ($scope, LoginService, OnlineSerivce) {
            var vm = this;
            vm.name = 'MenuCtrl';
            vm.isLoggedIn = false;

            OnlineSerivce.isOnline().then(function (isOnline) {
                vm.isOnline = isOnline;
            });

            $scope.$watch(LoginService.isUserLoggedIn, function (newVal) {
                console.log('menu: login status changed : user logged in: ' + newVal);
                vm.isLoggedIn = newVal;
            });
        }]);
}());