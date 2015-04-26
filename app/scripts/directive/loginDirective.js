'use strict';

angular.module('lurinfacts').directive('fireBaseLogin', function ($sce, LoginService) {
    return {
        restrict: 'EA',
        replace: true,
        template: '<div><div ng-hide="isLoggedIn">User:<input type="text" ng-model="user" /> ' +
            'Password: <input type="password" ng-model="password" />' +
            '<input type="button" class="btn" value="OK" data-ng-click="login()"></div><div ng-show="isLoggedIn"><input class="btn" type="button" data-ng-click="logout()" value="Logout" /></div></div>',
        link: function (scope) {
            scope.isLoggedIn = LoginService.isUserLoggedIn();
            scope.$watch(LoginService.isUserLoggedIn, function (newVal) {
                console.log('login status changed: user logged in' + newVal);
                scope.isLoggedIn = newVal;
            });

            scope.login = function () {
                console.log('login for: ' + scope.user);
                LoginService.doUserLogin(scope.user, scope.password, true);
            };
            scope.logout = function () {
                console.log('logout');
                LoginService.logout();
            };
        }
    };
});