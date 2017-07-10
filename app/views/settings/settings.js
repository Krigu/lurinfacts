(function () {
    'use strict';
    angular.module('lurinfacts').controller('SettingsCtrl', SettingsCtrl);

    SettingsCtrl.$inject = ['NotificationService'];

    function SettingsCtrl(NotificationService) {

        var $ctrl = this;
        $ctrl.registerPushUrl = 'http://localhost:7070/api/registerPush';
        $ctrl.unregisterPushUrl = 'http://localhost:7070/api/unregisterPush';
        $ctrl.isPushFeatured = ('serviceWorker' in navigator) && ('PushManager' in window);

        $ctrl.disablePush = function () {
            console.log('disable push clicked');
            getCurrentSubscription().then(function (sub) {
                if (sub !== null) {
                    return deleteSubscriptionAtBackEnd(sub).then(function () {
                        NotificationService.success('Push notifications disabled!');
                    });
                } else {
                    NotificationService.success('Push notifications disabled!');
                }
                return Promise.resolve();
            }).error(function(err){
                console.log('Error on Push notifications disable',err);
            });
        };

        $ctrl.enablePush = function () {
            console.log('enable push clicked');
            askPermission()
                .then(function (permissionResult) {
                    if (permissionResult !== 'granted') {
                        NotificationService.error('Nope!');
                        new Error('no permission');
                        return;
                    }
                    return permissionResult;
                })
                .then(subscribeUserToPush)
                .then(function (subscription) {
                    console.log('got subscription', subscription);
                    return subscription;
                })
                .then(sendSubscriptionToBackEnd)
                .then(function () {
                    NotificationService.success('Push notifications enabled!');
                }).catch(function (err) {
                    NotificationService.error('Nope!');
                    console.log('ask lurin about this error:', err);
                });
        };

        function askPermission() {
            return new Promise(function (resolve, reject) {
                var permissionResult = Notification.requestPermission(function (result) {
                    resolve(result);
                });
                if (permissionResult) {
                    permissionResult.then(resolve, reject);
                }
            });
        }

        function getCurrentSubscription() {
            return registerServiceWorker()
                .then(function (registration) {
                    return registration.pushManager.getSubscription();
                });
        }

        function subscribeUserToPush() {
            return registerServiceWorker()
                .then(function (registration) {
                    var subscribeOptions = {
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array(
                            'BM-ZWcNVEPPo8II2W2QCLBccS9jY0_VtKVlRu0vy9jj2vljPgPdQ6tgeVOS9E2OXoJn8Gf5HvySYBX8508rwyBg'
                        )
                    };
                    return registration.pushManager.subscribe(subscribeOptions);
                })
                .then(function (pushSubscription) {
                    console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
                    return pushSubscription;
                });
        }

        function registerServiceWorker() {
            return navigator.serviceWorker.register('sw.js')
                .then(function (registration) {
                    console.log('Service worker successfully registered.');
                    return registration;
                })
                .catch(function (err) {
                    console.error('Unable to register service worker.', err);
                });
        }

        function sendSubscriptionToBackEnd(subscription) {
            return fetch($ctrl.registerPushUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(subscription)
            })
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error('Bad status code from server.');
                    }
                    return response.json();
                })
                .then(function (responseData) {
                    if (!(responseData.data && responseData.data.success)) {
                        throw new Error('Bad response from server.');
                    }
                });
        }

        function deleteSubscriptionAtBackEnd(subscription) {
            return fetch($ctrl.unregisterPushUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(subscription)
            })
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error('Bad status code from server.');
                    }
                    return response.json();
                })
                .then(function (responseData) {
                    if (!(responseData.data && responseData.data.success)) {
                        throw new Error('Bad response from server.');
                    }
                });
        }

        function urlBase64ToUint8Array(base64String) {
            var padding = '='.repeat((4 - base64String.length % 4) % 4);
            var base64 = (base64String + padding)
                .replace(/\-/g, '+')
                .replace(/_/g, '/');

            var rawData = window.atob(base64);
            var outputArray = new Uint8Array(rawData.length);

            for (var i = 0; i < rawData.length; ++i) {
                outputArray[i] = rawData.charCodeAt(i);
            }
            return outputArray;
        }
    }
})();