
'use strict';
(function () {

    angular.module('lurinfacts').directive('modalPopup', function () {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                location: '=location',
                handler: '=handler'
            },
            templateUrl: './../../views/modal/modal.html',
            link: function ($scope) {

                $scope.closeModal = function () {
                    $scope.location = null;
                };
                $scope.nextImage = function () {
                    $scope.location = $scope.handler.nextImage($scope.location);
                };
                $scope.previousImage = function () {
                    $scope.location = $scope.handler.previousImage($scope.location);
                };
            },
            controller: 'ModalController'
        };
    });

    angular.module('lurinfacts').controller('ModalController', ModalController);

    ModalController.$inject = ['$scope', 'ImageLocationService'];
    function ModalController($scope, ImageLocationService) {

        var getDownloadUrl = function (key, fn) {
            ImageLocationService.getDownloadUrl(key).then(function (url) {
                fn(url);
                $scope.$evalAsync();
            }).catch(function (er) {
                console.log('error get getDownloadUrl', er);
            });
        };

        $scope.$watch('location', function (newValue) {
            $scope.location = newValue;
            if (newValue && newValue.imageKey) {
                $scope.location.bgUrl = 'url(' + $scope.location.thumbnail + ') white';

                getDownloadUrl($scope.location.imageKey, function (url) {
                    $scope.location.bgUrl = 'url(' + url + ') white';
                });

                getDownloadUrl($scope.location.previousLocation.imageKey, function (url) {
                    $scope.previousLocationUrl = url;
                });

                getDownloadUrl($scope.location.nextLocation.imageKey, function (url) {
                    $scope.nextLocationUrl = url;
                });
            }
        }.bind(this));
    }
})();