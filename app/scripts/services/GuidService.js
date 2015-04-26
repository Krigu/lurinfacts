(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name lurinfactsApp.PictureService
     * @description
     * # PictureService
     * Service in the lurinfactsApp.
     */
    angular.module('lurinfacts').factory('GuidService', function () {

        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // jshint ignore:line
        };

        var newGuid = function () {
            return (S4() + S4() + '-' + S4() + '-4' + S4().substr(0, 3) + '-' + S4() + '-' + S4() + S4() + S4()).toLowerCase();
        };

        return {
            newGuid: newGuid
        };
    });
}());