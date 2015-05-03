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
        vm.title = 'Vorhandene Bilder';

        //vm.locations = [{title:"test"},{title:"test2"}];

        vm.locations = ImageLocationService.locationsAsFirebaseArray();

        vm.deleteImage = function (guid) {

            console.log('delete image:' + guid);

            ImageLocationService.deleteLocation(guid).then(function () {
                NotificationService.success('image delete');
            }, function () {
                NotificationService.error('lurin hijacked the image, it can\'t be deleted');
            });

        };

    });