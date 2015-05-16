(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name lurinfacts.controller:MapCtrl
     * @description
     * # MapCtrl
     * Controller of lurinfacts
     */
    angular.module('lurinfacts')
        .controller('ManageFactsCtrl', function ($scope, factsFactory, NotificationService) {
            var vm = this;
            vm.title = 'Vorhandene Facts';
            vm.newFact = [];
            vm.newFact.insertTime = new Date().getTime();
            vm.facts = factsFactory.factsAsFirebaseArray();

            vm.deleteFact = function (fact) {
                console.log('delete fact:' + fact);
                vm.facts.$remove(fact).then(function () {
                    NotificationService.success('fact delete');
                }, function () {
                    NotificationService.error('lurin didn\'t let you delete this fact.');
                });

            };

            vm.saveFact = function () {
                factsFactory.saveFact(vm.newFact).then(function () {
                    vm.newFact.insertTime = new Date().getTime();
                    vm.newFact.fact = '';
                    vm.newFact.contributor = '';
                    NotificationService.success('fact added');
                }, function () {
                    NotificationService.error('lurin doesn\'t like this fact, error during save.');
                });
            };

        });
}());