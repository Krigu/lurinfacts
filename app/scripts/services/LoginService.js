(function () {
    'use strict';

    angular.module('lurinfacts').factory('LoginService', function () {
        var UserIsLoggedIn = false;
        var firebaseRef = 'https://burning-inferno-892.firebaseio.com/';
        var ref = new Firebase(firebaseRef);
        var authData = ref.getAuth();
        if (authData) {
            UserIsLoggedIn = true;
            console.log('User ' + authData.uid + ' is logged in with ' + authData.provider);
        } else {
            console.log('User is logged out');
            UserIsLoggedIn = false;
        }

        var isUserLoggedIn = function () {
            return UserIsLoggedIn;
        };

        var doUserLogin = function (email, password, iAmLazy, callback) {
            ref.authWithPassword({
                email: email,
                password: password,
                remember: iAmLazy
            }, function (error, authData) {
                if (error) {
                    console.log('Login Failed!', error);
                    UserIsLoggedIn = false;
                } else {
                    console.log('Authenticated successfully with payload:', authData);
                    UserIsLoggedIn = true;
                }
                if (callback) {
                    callback(UserIsLoggedIn);
                }
            });
        };

        var logout = function () {
            ref.unauth();
            UserIsLoggedIn = false;
        };

        return {
            doUserLogin: doUserLogin,
            logout: logout,
            isUserLoggedIn: isUserLoggedIn
        };
    });
}());