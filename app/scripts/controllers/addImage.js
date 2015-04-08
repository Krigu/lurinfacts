'use strict';

/**
 * @ngdoc function
 * @name lurinfacts.controller:MapCtrl
 * @description
 * # MapCtrl
 * Controller of lurinfacts
 */
angular.module('lurinfacts')
  .controller('AddImageCtrl', function($scope,ImageResizeService,ImageLocationService,LocationFinderService) {
    var vm = this;
    vm.title = 'Neues Bild hinzufügen';


    vm.showPosition = function(position) {
      LocationFinderService.getPositionByCoords(position.coords.latitude, position.coords.longitude).then(function(newPoint){
        vm.newPoint = newPoint;
        vm.newPoint.imageTitle = 'Your location';
          vm.newPoint.imageUrl = 'uploadyourphotonow.jpg';
      },function(error){
        console.log('error on getPositionByCoords: ' + error);
      });
    };

    vm.getPositionByAddress = function(){
      LocationFinderService.getPositionByAddress(vm.newPoint.address).then(function(newPoint){
        vm.newPoint = newPoint;
      },function(error){
        console.log('error on getPositionByAddress: ' + error);
      });

    }

    vm.uploadedFileChanged = function(el) {
      var f = el.files[0];
      var reader = new FileReader();
      reader.onload = (function(theFile) {
        console.log('file read');
        return function(e) {
          vm.imageSource = reader.result;
          var promise = ImageResizeService.resize(reader.result,200);
          promise.then(function (img) {
              vm.imageThumb = img;
              console.log('thumb created');
             // $scope.$apply();
          }, function (reason) {
            console.log('Failed: ' + reason);
          });
          //$scope.$apply();
        };
      })(f);
      reader.readAsDataURL(f);
    };

    vm.SavePicture = function(){
      console.log('start saving everything');
        ImageLocationService.saveLocation(vm.newPoint,vm.imageSource,vm.imageThumb).then(function(data){
          console.log('everything saved under: '+data[0]);
        },function(error){
          console.log('error during save: '+error);
        });
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(vm.showPosition);
    } else {
      vm.newPoint = {
        imageTitle: 'Devils Marble, Australia',
        imageUrl: 'start.jpg',
        country: 'Australia',
        address: 'Devils Marble, Australia'
      };
    }
  });
