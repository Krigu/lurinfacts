"use strict";
(function() {
  angular.module("lurinfacts").directive("modalPopupFact", function() {
    return {
      restrict: "EA",
      replace: true,
      scope: {
        fact: "="
      },
      templateUrl: "./../../views/modal/modal-fact.html",
      link: function($scope) {
        $scope.closeModal = function() {
          $scope.fact = null;
        };
      },
      controller: "ModalFactsController"
    };
  });

  angular.module("lurinfacts").controller("ModalFactsController", ModalFactsController);

  ModalFactsController.$inject = ["$scope"];
  function ModalFactsController($scope) {
    $scope.$watch("fact", function(newValue) {
      $scope.fact = newValue;
    });
  }
})();
