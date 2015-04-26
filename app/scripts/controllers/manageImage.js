'use strict';

/**
 * @ngdoc function
 * @name lurinfacts.controller:MapCtrl
 * @description
 * # MapCtrl
 * Controller of lurinfacts
 */
angular.module('lurinfacts')
    .controller('ManageImageCtrl', function ($scope, ImageLocationService) {
        var vm = this;
        vm.title = 'Vorhandene Bilder';

        //vm.locations = [{title:"test"},{title:"test2"}];

        vm.locations = ImageLocationService.locationsAsFirebaseArray();

        vm.deleteImage = function (guid) {

            console.log('delete image:' + guid);

            ImageLocationService.deleteLocation(guid);

        };

    });