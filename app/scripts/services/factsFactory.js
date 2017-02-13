(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name lurinfactsApp.PictureService
     * @description
     * # PictureService
     * Service in the lurinfactsApp.
     */
    angular.module('lurinfacts').factory('factsFactory', function ($http, $q, $firebaseArray) {
        var fb = firebase.database().ref();
        var firebaseFacts = fb.child('facts');
        var firebaseProposal = fb.child('factsProposal');
        var firebaseArrayProposal = $firebaseArray(firebaseProposal);
        var firebaseArrayFacts = $firebaseArray(firebaseFacts);

        var getFacts = function () {
            return $http({
                url: '/facts.json',
                method: 'GET'
            });
        };

        var saveFact = function (fact) {
            var d = $q.defer();
            var factsRef = firebaseFacts.push();
            factsRef.set(fact, function (error) {
                if (error) {
                    d.reject(error);
                } else {
                    console.log('fact uploaded under key:' + factsRef.key);
                    d.resolve(fact.key);
                }
            });
            return d.promise;
        };
        var approveProposal = function (proposal) {
            var fact = {
                insertTime: proposal.insertTime,
                contributor: proposal.contributor,
                fact: proposal.fact
            };
            var d = $q.defer();
            this.saveFact(fact).then(function (error) {
                if (error) {
                    d.reject(error);
                } else {
                    proposalsAsFirebaseArray().$remove(proposal).then(function () {
                        d.resolve(fact.key);
                    }, function (error) {
                        d.reject(error);
                    });
                }
            }, function (error) {
                d.reject(error);
            });
            return d.promise;
        };

        var factsAsFirebaseArray = function () {
            // Get a reference to our posts
            return firebaseArrayFacts;
        };

        var latestFacts = function (amount) {
            return firebaseFacts.orderByChild('insertTime').limitToLast(amount);
        };

        var proposalsAsFirebaseArray = function () {
            // Get a reference to our posts
            return firebaseArrayProposal;
        };

        var saveProposal = function (fact) {
            var d = $q.defer();
            var proposalRef = firebaseProposal.push();
            proposalRef.set(fact, function (error) {
                if (error) {
                    d.reject(error);
                } else {
                    console.log('fact proposal uploaded under key:' + proposalRef.key);
                    d.resolve(fact.key);
                }
            });
            return d.promise;
        };

        var deleteProposal = function (key) {
            var d = $q.defer();
            proposalsAsFirebaseArray().$remove(key).then(function (error) {
                if (error) {
                    d.reject(error);
                } else {
                    d.resolve(key);
                    console.log('proposal delete with key:' + key);
                }
            });
            return d.promise;
        };

        var deleteFact = function (key) {
            var d = $q.defer();
            factsAsFirebaseArray().$remove(key).then(function (error) {
                if (error) {
                    d.reject(error);
                } else {
                    d.resolve(key);
                    console.log('fact delete with key:' + key);
                }
            });
            return d.promise;
        };

        return {
            saveProposal: saveProposal,
            latestFacts: latestFacts, 
            approveProposal: approveProposal,
            getFacts: getFacts,
            saveFact: saveFact,
            deleteFact: deleteFact,
            deleteProposal: deleteProposal,
            factsAsFirebaseArray: factsAsFirebaseArray,
            proposalsAsFirebaseArray: proposalsAsFirebaseArray
        };

    });
}());