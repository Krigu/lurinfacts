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
        .controller('ManageFactsCtrl', function ($scope, factsFactory) {
            var vm = this;
            vm.title = 'Vorhandene Facts';
            vm.newFact = [];
            vm.newFact.insertTime = new Date().getTime();
            vm.facts = factsFactory.factsAsFirebaseArray();

            vm.deleteFact = function (guid) {
                console.log('delete fact:' + guid);
                factsFactory.deleteFact(guid);

            };

            vm.saveFact = function () {
                factsFactory.saveFact(vm.newFact).then(function () {
                    vm.newFact.insertTime = new Date().getTime();
                    vm.newFact.fact = '';
                    vm.newFact.contributor = '';
                });
            };

        });
}());