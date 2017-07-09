(function () {
    'use strict';
    angular.module('lurinfacts').controller('SettingsCtrl', SettingsCtrl);

    SettingsCtrl.$inject = ['NotificationService'];

    function SettingsCtrl(NotificationService) {
        var $ctrl = this;

        $ctrl.disablePush = function () {
            console.log('disable push clicked',NotificationService);
        };
    }
})();