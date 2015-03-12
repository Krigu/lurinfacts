'use strict';

/**
 * @ngdoc function
 * @name lurinfacts.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of lurinfacts
 */
angular.module('lurinfacts')
  .controller('MainCtrl', function($scope) {
    $scope.tasks = [
      'view',
      'controller',
      'route',
      'directive',
      'filter',
      'service',
      'factory',
      'constant'
    ];
  });
