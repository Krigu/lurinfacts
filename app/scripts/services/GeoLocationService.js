'use strict';

angular.module('lurinfacts').factory('GeoLocationService', function ($http, $q) {

    var getPositionByCoords = function (lat, lng) {

        var geoUrl = 'http://maps.google.com/maps/api/geocode/json?latlng=' + lat + ',' + lng;
        return geoCodeService(geoUrl);
    };

    var getPositionByAddress = function (address) {

        var geoUrl = 'http://maps.google.com/maps/api/geocode/json?address=' + address;
        return geoCodeService(geoUrl);
    };
    var geoCodeService = function (geoUrl) {

        return $q(function (resolve, reject) {

            $http({
                method: 'GET',
                url: geoUrl
            }).
            success(function (data) {
                console.log(data);
                if (data.results.length > 0) {
                    var res0 = data.results[0];
                    var newPoint = {};
                    newPoint.lng = res0.geometry.location.lng;
                    newPoint.lat = res0.geometry.location.lat;
                    //newPoint.title = res0.formatted_address;
                    newPoint.address = res0.formatted_address;
                    newPoint.country = res0.address_components[res0.address_components.length - 2].long_name;
                    resolve(newPoint);
                }
                // this callback will be called asynchronously
                // when the response is available
            }).
            error(function (data) {
                console.log(data);
                reject(data);
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        });
    };


    return {
        getPositionByCoords: getPositionByCoords,
        getPositionByAddress: getPositionByAddress
    };

});