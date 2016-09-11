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
        .controller('FactsCtrl', ['$scope', 'factsFactory', 'NotificationService', function ($scope, $factsFactory, NotificationService) {

            $scope.name = 'FactsCtrl';

            $scope.facts = {};

            $scope.update = function (fact) {
                fact.insertTime = new Date().getTime();
                $factsFactory.saveProposal(fact).then(function () {
                    $scope.fact = {};
                    $scope.factsForm.$setPristine();
                    NotificationService.success('fact added, lurin will decide if it\'s worth it');
                }, function () {
                    NotificationService.error('lurin doesn\'t like this fact, error during save.');
                });
            };

            $scope.isInvalid = function () {
                return $scope.factsForm.$dirty && $scope.factsForm.$invalid;
            };
            $scope.facts = $factsFactory.factsAsFirebaseArray();
    }]);
})();