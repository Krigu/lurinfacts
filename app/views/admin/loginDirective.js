'use strict';

angular.module('lurinfacts').directive('fireBaseLogin', function ($sce, LoginService) {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: './../../views/admin/loginDirective.html',
        link: function (scope) {
            scope.showLogin = false;
            scope.isLoggedIn = LoginService.isUserLoggedIn;
            scope.$watch(LoginService.isUserLoggedIn, function (newVal) {
                console.log('login status changed: user logged in' + newVal);
                scope.isLoggedIn = newVal;
            });
            scope.loginCallback = function (isLoggedInNow) {
                console.log('callbacked isLoggedInNow: ' + isLoggedInNow);
                scope.isLoggedIn = isLoggedInNow;
                scope.$apply();
            };

            scope.login = function () {
                console.log('login for: ' + scope.user);
                LoginService.doUserLogin(scope.user, scope.password, true, scope.loginCallback);
            };

            scope.logout = function () {
                console.log('logout');
                LoginService.logout();
            };
        }
    };
});