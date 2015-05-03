(function () {
    'use strict';

    angular.module('lurinfacts').factory('NotificationService', function (ngNotify) {

        ngNotify.config({
            theme: 'pure',
            position: 'bottom',
            duration: 3000,
            sticky: false
        });

        var error = function (error) {
            ngNotify.set(error, 'error');
        };

        var success = function (success) {
            ngNotify.set(success, 'success');
        };

        var warn = function (warn) {
            ngNotify.set(warn, 'warn');
        };

        return {
            error: error,
            success: success,
            warn: warn
        };
    });
}());