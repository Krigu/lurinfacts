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
        var fireBase = new Firebase('https://burning-inferno-892.firebaseio.com/');
        var firebaseFacts = fireBase.child('facts');
        var firebaseProposal = fireBase.child('factsProposal');

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
                    console.log('fact uploaded under key:' + factsRef.key());
                    d.resolve(fact.key);
                }
            });
            return d.promise;
        };

        var factsAsFirebaseArray = function () {
            // Get a reference to our posts
            return $firebaseArray(firebaseFacts);
        };


        var saveProposal = function (fact) {
            var d = $q.defer();
            var proposalRef = firebaseProposal.push();
            proposalRef.set(fact, function (error) {
                if (error) {
                    d.reject(error);
                } else {
                    console.log('fact proposal uploaded under key:' + proposalRef.key());
                    d.resolve(fact.key);
                }
            });
            return d.promise;
        };

        var deleteFact = function (key) {
            var d = $q.defer();
            factsAsFirebaseArray.$remove(key).then(function (error) {
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
            getFacts: getFacts,
            saveFact: saveFact,
            deleteFact: deleteFact,
            factsAsFirebaseArray: factsAsFirebaseArray

        };

    });
}());