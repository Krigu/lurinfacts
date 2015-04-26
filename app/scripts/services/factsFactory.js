(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name lurinfactsApp.PictureService
     * @description
     * # PictureService
     * Service in the lurinfactsApp.
     */
    angular.module('lurinfacts').factory('factsFactory', function ($http, $q, $firebaseArray, GuidService) {
        var firebaseRef = 'https://burning-inferno-892.firebaseio.com/facts/';

        var getFacts = function () {
            return $http({
                url: '/facts.json',
                method: 'GET'
            });
        };

        var saveFact = function (fact) {
            var d = $q.defer();
            fact.guid = GuidService.newGuid();
            var firebaseMetaData = new Firebase(firebaseRef + fact.guid);
            firebaseMetaData.set(fact, function () {
                console.log('fact uploaded under guid:' + fact.guid);
                d.resolve(fact.guid);
            });
            return d.promise;
        };

        var factsAsFirebaseArray = function () {
            // Get a reference to our posts
            var ref = new Firebase(firebaseRef);
            return $firebaseArray(ref);
        };


        var deleteFact = function (guid) {
            var d = $q.defer();
            var firebaseFact = new Firebase(firebaseRef + guid);
            firebaseFact.remove(function () {
                console.log('fact delete with guid:' + guid);
                d.resolve(guid);
            });
            return d.promise;
        };

        return {
            getFacts: getFacts,
            saveFact: saveFact,
            deleteFact: deleteFact,
            factsAsFirebaseArray: factsAsFirebaseArray

        };

    });
}());