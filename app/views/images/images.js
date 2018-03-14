"use strict";

(function() {
  angular
    .module("lurinfacts")
    .controller("ImagesCtrl", [
      "$scope",
      "$routeParams",
      "$location",
      "ImageCacheService",
      ImagesCtrl
    ]);

  function ImagesCtrl($scope, $routeParams, $location, ImageCacheService) {
    $scope.locations = [];
    $scope.selectedLocation = {};

    var init = function() {
      return ImageCacheService.fetchCachedImages(imageLoaded).then(function() {
        console.log("images loaded");
      });
    };

    var imageLoaded = function(x) {
      var alreadyAdded = $scope.locations.filter(function(img) {
        return img.imageKey === x.imageKey;
      });
      if (alreadyAdded && alreadyAdded.length > 0) {
        return;
      }
      $scope.locations.unshift(x);
      if ($routeParams.imageKey === "" + x.imageKey) {
        $scope.selectImage(x);
      }
      $scope.$evalAsync();
    };

    $scope.selectImage = function(location) {
      var idx = getLocationIndex(location.imageKey);
      $scope.selectedLocation = prepareLocation(saveIndex(idx));
    };

    var getLocationIndex = function(imageKey) {
      for (var i = 0; i < $scope.locations.length; i++) {
        if ($scope.locations[i].imageKey === imageKey) {
          return i;
        }
      }
      return 0;
    };

    var prepareLocation = function(idx) {
      var l = $scope.locations[idx];
      $location.search("imageKey=" + l.imageKey);
      l.previousLocation = $scope.locations[saveIndex(idx - 1)];
      l.nextLocation = $scope.locations[saveIndex(idx + 1)];
      return l;
    };

    var saveIndex = function(idx) {
      //handles index overflows and underflows
      idx = idx < 0 ? $scope.locations.length - 1 : idx;
      return idx >= $scope.locations.length ? 0 : idx;
    };

    $scope.handler = {
      nextImage: function(loc) {
        var idx = getLocationIndex(loc.imageKey);
        idx++;
        return prepareLocation(saveIndex(idx));
      },
      previousImage: function(loc) {
        var idx = getLocationIndex(loc.imageKey);
        idx--;
        return prepareLocation(saveIndex(idx));
      }
    };

    init();
  }
})();
