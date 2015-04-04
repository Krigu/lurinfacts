'use strict';

/**
 * @ngdoc function
 * @name lurinfacts.controller:FactsCtrl
 * @description
 * # FactsCtrl
 * Controller of lurinfacts
 */
(function () {
  angular.module('lurinfacts')
    .controller('FactsCtrl', ['$scope', 'factsFactory', function ($scope, $factsFactory) {

      $scope.name = 'FactsCtrl';

      $scope.facts = {};

      $scope.update = function (fact) {
        $scope.facts.push(angular.copy(fact));

        $scope.factsForm.$setPristine();

        $scope.fact = {};
      };

      $scope.isInvalid = function () {
        return $scope.factsForm.$dirty && $scope.factsForm.$invalid;
      }

      $factsFactory.getFacts().success(function (data) {
        $scope.facts = data;
      });

    }]);
})();
