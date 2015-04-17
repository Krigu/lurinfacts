'use strict';

angular.module('lurinfacts').factory('ImageLocationService', function ($q, $firebaseArray) {
  var firebaseRef = 'https://burning-inferno-892.firebaseio.com/';

  var saveLocation = function (metaData, image, thumbnail) {
    var uuid = guid();

    return $q.all([
      saveMetadata(uuid, metaData, thumbnail),
      saveImage(uuid, image)
      //saveThumbnail(uuid, thumbnail)
    ]);
  };

  var guid = function () {
    return (S4() + S4() + '-' + S4() + '-4' + S4().substr(0, 3) + '-' + S4() + '-' + S4() + S4() + S4()).toLowerCase();
  };

  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // jshint ignore:line
  };

  var saveMetadata = function (guid, metadata, thumbnail) {
    var d = $q.defer();
    metadata.guid = guid;
    metadata.thumbnail = thumbnail;
    var firebaseMetaData = new Firebase(firebaseRef + 'imageLocation/' + guid);
    firebaseMetaData.set(metadata, function () {
      console.log('metadata uploaded under hash:' + guid);
      d.resolve(guid);
    });
    return d.promise;
  };

  var saveImage = function (guid, image) {
    var d = $q.defer();
    var firebasePicture = new Firebase(firebaseRef + 'image/' + guid + '/filePayload');
    firebasePicture.set(image, function () {
      console.log('image uploaded under hash:' + guid);
      d.resolve(guid);
    });
    return d.promise;
  };

  var locationsAsFirebaseArray = function () {
    // Get a reference to our posts
    var ref = new Firebase(firebaseRef + 'imageLocation/');
    return $firebaseArray(ref);
  };


  return {
    saveLocation: saveLocation,
    locationsAsFirebaseArray: locationsAsFirebaseArray
  };
});
