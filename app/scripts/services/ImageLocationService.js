'use strict';

angular.module('lurinfacts').factory('ImageLocationService', function ($q, $firebaseArray, GuidService) {
    var firebaseRef = 'https://burning-inferno-892.firebaseio.com/';
    var firebaseRef_imageMetaData = firebaseRef + 'imageMetaData/';
    var firebaseRef_image = firebaseRef + 'image/';
    var saveLocation = function (metaData, image, thumbnail) {
        var uuid = GuidService.newGuid();
        return $q.all([
      saveMetadata(uuid, metaData, thumbnail),
      saveImage(uuid, image)
      //saveThumbnail(uuid, thumbnail)
    ]);
    };


    var saveMetadata = function (guid, metadata, thumbnail) {
        var d = $q.defer();
        metadata.guid = guid;
        metadata.thumbnail = thumbnail;
        var firebaseMetaData = new Firebase(firebaseRef_imageMetaData + guid);
        firebaseMetaData.set(metadata, function () {
            console.log('metadata uploaded under hash:' + guid);
            d.resolve(guid);
        });
        return d.promise;
    };

    var deleteMetadata = function (guid) {
        var d = $q.defer();
        var firebaseMetaData = new Firebase(firebaseRef_imageMetaData + guid);
        firebaseMetaData.remove(function () {
            console.log('image delete with hash:' + guid);
            d.resolve(guid);
        });
        return d.promise;
    };

    var deleteImage = function (guid) {
        var d = $q.defer();
        var firebasePicture = new Firebase(firebaseRef_image + guid);
        firebasePicture.remove(function () {
            console.log('metadata delete with hash:' + guid);
            d.resolve(guid);
        });
        return d.promise;
    };

    var saveImage = function (guid, image) {
        var d = $q.defer();
        var firebasePicture = new Firebase(firebaseRef_image + guid);
        firebasePicture.set(image, function () {
            console.log('image uploaded under hash:' + guid);
            d.resolve(guid);
        });
        return d.promise;
    };

    var locationsAsFirebaseArray = function () {
        // Get a reference to our posts
        var ref = new Firebase(firebaseRef_imageMetaData);
        return $firebaseArray(ref);
    };

    var deleteLocation = function (uuid) {
        return $q.all([
      deleteMetadata(uuid),
      deleteImage(uuid)
      //saveThumbnail(uuid, thumbnail)
    ]);
    };

    return {
        saveLocation: saveLocation,
        deleteLocation: deleteLocation,
        locationsAsFirebaseArray: locationsAsFirebaseArray
    };
});