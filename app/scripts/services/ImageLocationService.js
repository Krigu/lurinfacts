'use strict';

angular.module('lurinfacts').factory('ImageLocationService', function ($q, $firebaseArray) {
    var ref = firebase.database().ref();
    var firebaseMetaData = ref.child('imageMetaData');
    var firebaseImage = ref.child('image');
    var locationRef = $firebaseArray(firebaseMetaData);

    var latestLocation = function(amount){
            return firebaseMetaData.limitToLast(amount);
    };

    var saveMetadata = function (metaData) {
        var d = $q.defer();
        var firebaseMetaDataRef = firebaseMetaData.push();
        firebaseMetaDataRef.set(metaData, function (error) {
            if (error) {
                d.reject(error);
            } else {
                console.log('metadata uploaded under hash:' + firebaseMetaDataRef.key);
                d.resolve(firebaseMetaDataRef.key);
            }
        });
        return d.promise;
    };

    var deleteMetadata = function (metaData) {
        var d = $q.defer();
        locationRef.$remove(metaData).then(function () {
            d.resolve();
        }, function (error) {
            d.reject(error);
        });
        return d;
    };

    var deleteImage = function (key) {
        var d = $q.defer();
        var firebasePicture = firebaseImage.child(key);
        firebasePicture.remove(function (error) {
            if (error) {
                d.reject(error);
            } else {
                console.log('image delete with key:' + key);
                d.resolve(key);
            }
        });
        return d.promise;
    };

    var saveImage = function (image) {
        var d = $q.defer();
        var firebasePicture = firebaseImage.push();
        firebasePicture.set(image, function (error) {
            if (error) {
                d.reject(error);
            } else {
                console.log('image uploaded under key:' + firebasePicture.key);
                d.resolve(firebasePicture.key);
            }
        });
        return d.promise;
    };

    var locationsAsFirebaseArray = function () {
        return locationRef;
    };

    var locationsAsArray = function () {
        return firebaseMetaData;
    };

    var deleteLocation = function (metaData, imageKey) {
        return $q.all([deleteMetadata(metaData), deleteImage(imageKey)]);
    };

    var saveLocation = function (metaData, image, thumbnail) {
        var d = $q.defer();
        saveImage(image)
            .then(function (imageKey) {
                metaData.imageKey = imageKey;
                metaData.thumbnail = thumbnail;
                saveMetadata(metaData).then(function (key) {
                    d.resolve(key);
                }, function (error) {
                    d.reject(error);
                });
            }, function (error) {
                d.reject(error);
            });
        return d.promise;
    };

    return {
        saveLocation: saveLocation,
        deleteLocation: deleteLocation,
        locationsAsFirebaseArray: locationsAsFirebaseArray,
        locationsAsArray: locationsAsArray,
        latestLocation : latestLocation
    };
});