"use strict";
(function() {
  angular.module("lurinfacts").directive("modalPopupImage", function() {
    return {
      restrict: "EA",
      replace: true,
      scope: {
        location: "=location",
        handler: "=handler"
      },
      templateUrl: "./../../views/modal/modal-image.html",
      link: function($scope) {
        $scope.closeModal = function() {
          $scope.location = null;
        };
        $scope.nextImage = function() {
          $scope.location = $scope.handler.nextImage($scope.location);
        };
        $scope.previousImage = function() {
          $scope.location = $scope.handler.previousImage($scope.location);
        };
      },
      controller: "ModalImageController"
    };
  });

  angular.module("lurinfacts").controller("ModalImageController", ModalImageController);

  ModalImageController.$inject = ["$scope", "ImageLocationService"];
  function ModalImageController($scope, ImageLocationService) {
    var getDownloadUrl = function(key, fn) {
      ImageLocationService.getDownloadUrl(key)
        .then(function(url) {
          fn(url);
          $scope.$evalAsync();
        })
        .catch(function(er) {
          console.log("error get getDownloadUrl", er);
        });
    };

    $scope.$watch(
      "location",
      function(newValue) {
        $scope.location = newValue;
        if (newValue && newValue.imageKey) {
          $scope.location.bgUrl = "url(" + $scope.location.thumbnail + ") white";
          $scope.mainImageLoading = 0;
          //prevent flickering
          setTimeout(function() {
            if ($scope.mainImageLoading === 0) {
              $scope.mainImageLoading = 1;
            }
          }, 10);
          getDownloadUrl($scope.location.imageKey, function(url) {
            var img = new Image();
            img.onload = function() {
              $scope.location.bgUrl = "url(" + url + ") white";
              $scope.mainImageLoading = -1;
              $scope.$evalAsync();
            };
            img.src = url;
          });

          if ($scope.location.previousLocation) {
            getDownloadUrl($scope.location.previousLocation.imageKey, function(url) {
              $scope.previousLocationUrl = url;
            });
          }
          if ($scope.location.nextLocation) {
            getDownloadUrl($scope.location.nextLocation.imageKey, function(url) {
              $scope.nextLocationUrl = url;
            });
          }
        }
      }.bind(this)
    );
  }
})();
