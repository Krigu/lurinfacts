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

            scope.login = function () {
                console.log('login for: ' + scope.user);
                LoginService.doUserLogin(scope.user, scope.password);
            };

            scope.logout = function () {
                console.log('logout');
                LoginService.logout();
            };
        }
    };
});