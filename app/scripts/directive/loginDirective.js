/**
 * Created by Käser on 08/04/2015.
 */
'use strict';

angular.module('lurinfacts').directive('fireBaseLogin', function($sce,LoginService) {
  return {
    restrict: 'EA',
    scope: { code:'=', isactiv: '=' },
    replace: true,
    template: '<div ng-hide="isLoggedIn">User:<input type="text" ng-model="user" /> ' +
    'Password: <input type="text" ng-model="password" />' +
    '<input type="button" value="OK" data-ng-click="login()"></div>',
    link: function (scope) {

      scope.$watch(function () {  return LoginService.UserIsLoggedIn }, function (newVal) {
        scope.isLoggedIn = newVal;
      });

      scope.login = function(){
          console.log("login for: "+scope.user);
          LoginService.doUserLogin(scope.user,scope.password,true);
      };
    }
  };
});
