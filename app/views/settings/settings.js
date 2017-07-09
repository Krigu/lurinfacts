(function () {
    'use strict';
    angular.module('lurinfacts').controller('SettingsCtrl', SettingsCtrl);

    SettingsCtrl.$inject = ['NotificationService'];

    function SettingsCtrl(NotificationService) {
        var $ctrl = this;

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

        function sendSubscriptionToBackEnd(subscription) {
            return fetch('http://localhost:7070/api/registerPush', {
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

        $ctrl.disablePush = function () {
            console.log('disable push clicked');
        };

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

        function askPermission() {
            return new Promise(function (resolve, reject) {
                const permissionResult = Notification.requestPermission(function (result) {
                    resolve(result);
                });

                if (permissionResult) {
                    permissionResult.then(resolve, reject);
                }
            });
        }

        function subscribeUserToPush() {
            return registerServiceWorker()
                .then(function (registration) {
                    const subscribeOptions = {
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

        function urlBase64ToUint8Array(base64String) {
            const padding = '='.repeat((4 - base64String.length % 4) % 4);
            const base64 = (base64String + padding)
                .replace(/\-/g, '+')
                .replace(/_/g, '/');

            const rawData = window.atob(base64);
            const outputArray = new Uint8Array(rawData.length);

            for (let i = 0; i < rawData.length; ++i) {
                outputArray[i] = rawData.charCodeAt(i);
            }
            return outputArray;
        }
    }

})();