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
        .controller('ManageProposalCtrl', function ($scope, factsFactory, NotificationService) {
            var vm = this;

            vm.proposals = factsFactory.proposalsAsFirebaseArray();

            vm.approveProposal = function (fact) {
                console.log('add proposal to facts:' + fact);
                factsFactory.approveProposal(fact).then(function () {
                    NotificationService.success('proposal added to facts');
                }, function () {
                    NotificationService.error('lurin doesn\'t like this fact, error during save.');
                });

            };

            vm.deleteProposal = function (fact) {
                console.log('delete proposal:' + fact);
                vm.proposals.$remove(fact).then(function () {
                    NotificationService.success('proposal delete');
                }, function () {
                    NotificationService.error('lurin didn\'t let you delete this proposal.');
                });
            };

            vm.deleteAll = function () {
                for (var i = vm.proposals.length - 1; i >= 0; i--) {
                    vm.proposals.$remove(vm.proposals[i]).then(function () {
                        //do nothing if success                           
                    }, function () {
                        NotificationService.error('lurin didn\'t let you delete this proposals.');
                    });
                    NotificationService.success('proposals delete');
                }
            };
        });
}());