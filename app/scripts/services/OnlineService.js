(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name lurinfactsApp.PictureService
     * @description
     * # PictureService
     * Service in the lurinfactsApp.
     */
    angular.module('lurinfacts').factory('OnlineSerivce', function ($http) {

        var isOnline = function () {
            return $http({
                method: 'GET',
                url: 'index.html?q=OfflineCheck' + new Date()
            }).
                then(function () {
                    console.log('OnlineSerivce I am online');
                    return true;
                }, function () {
                    console.log('OnlineSerivce I am offline');
                    return false;
                });
        };
        return { isOnline: isOnline };
    });
})();