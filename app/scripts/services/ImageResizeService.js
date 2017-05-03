'use strict';

angular.module('lurinfacts').factory('ImageResizeService', function ($q) {

    var resizeImage = function (src, size) {
      // perform some asynchronous operation, resolve or reject the promise when appropriate.
      return $q(function (resolve, reject) {
        var img = new Image();
        img.onload = function () {
          var resized = resizeLoadedImage(img, size);
          resolve(resized);
        };
        img.onerror = function (e) {
          reject(e);
        };
        img.src = src;
      });
    };

    var resizeLoadedImage = function (image, size) {
      var mainCanvas = document.createElement('canvas');
      //portrait or landscape image?
      mainCanvas.width = image.width < image.height ?  768 : 1024;
      mainCanvas.height = image.width > image.height ?  768 : 1024;
      var ctx = mainCanvas.getContext('2d');
      ctx.drawImage(image, 0, 0, mainCanvas.width, mainCanvas.height);
      //size = parseInt($('#size').get(0).value, 10);
      while (mainCanvas.width > size) {
        mainCanvas = halfSize(mainCanvas);
      }
      return mainCanvas.toDataURL('image/jpeg');
    };

    var reresizeImage = function (src) {
      // perform some asynchronous operation, resolve or reject the promise when appropriate.
      return $q(function (resolve, reject) {
        var img = new Image();
        img.onload = function () {
          var resized = reresizeLoadedImage(img);
          resolve(resized);
        };
        img.onerror = function (e) {
          reject(e);
        };
        img.src = src;
      });
    };

    var reresizeLoadedImage = function (image) {
      var mainCanvas = document.createElement('canvas');
      //portrait or landscape image?
      mainCanvas.width = image.height;
      mainCanvas.height = image.width;
      var ctx = mainCanvas.getContext('2d');
      ctx.drawImage(image, 0, 0, mainCanvas.width, mainCanvas.height);
      //size = parseInt($('#size').get(0).value, 10);
      return mainCanvas.toDataURL('image/jpeg');
    };
    /*
     * Draw initial canvas on new canvas and half it's size
     */
    var halfSize = function (i) {
      var canvas = document.createElement('canvas');
      canvas.width = i.width / 2;
      canvas.height = i.height / 2;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(i, 0, 0, canvas.width, canvas.height);
      return canvas;
    };

    return {
      resize: resizeImage,
      reresizeImage : reresizeImage
    };

  }
)
;
