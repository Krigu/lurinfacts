'use strict';

/**
 * @ngdoc function
 * @name lurinfacts.controller:MapCtrl
 * @description
 * # MapCtrl
 * Controller of lurinfacts
 */
angular.module('lurinfacts')
    .controller('ManageImageCtrl', function ($scope, ImageLocationService, NotificationService) {
        var vm = this;
        vm.locations = ImageLocationService.locationsAsFirebaseArray();
        vm.deleteImage = function (metaData, imageKey) {
            if (!window.confirm('do you really want to delete this beautiful image?')) {
                return;
            }
            console.log('delete metadata:' + metaData + ' with imageKey: ' + imageKey);
            ImageLocationService.deleteLocation(metaData, imageKey).then(function () {
                NotificationService.success('image delete');
            }, function () {
                NotificationService.error('lurin hijacked the image, it can\'t be deleted');
            });

        };

        vm.getInsertTime = function (ticks) {
            return new Date(ticks) + '';
        };

    });