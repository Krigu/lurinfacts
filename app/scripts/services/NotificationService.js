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

        var warn = function (warn, options) {
            options = options || {};
            options.type = 'warn';
            ngNotify.set(warn, options);
        };

        if (Notification && Notification.permission == "default"){
            window.setTimeout(function askForPermission() {
                ngNotify.set('<a href="/#settings">Don\' miss the lastest news of Lurin! Register for web push notifications in the settings menu</a>', {
                    html: true,
                    type: 'info',
                    duration: 10 * 1000
                });
            }, 5000);

        }
        return {
            error: error,
            success: success,
            warn: warn
        };
    });
}());