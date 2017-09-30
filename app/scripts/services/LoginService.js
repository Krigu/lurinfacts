(function () {
    'use strict';

    angular.module('lurinfacts').factory('LoginService', function () {
        var UserIsLoggedIn = false;
        var auth = firebase.auth();

        auth.onAuthStateChanged(function (authData) {
            if (authData) {
                UserIsLoggedIn = true;
                console.log('User ' + authData.email + ' is logged in .');
            } else {
                console.log('User is logged out');
                UserIsLoggedIn = false;
            }
        });

        var isUserLoggedIn = function () {
            return UserIsLoggedIn;
        };

        var doUserLogin = function (email, password) {
            return auth.signInWithEmailAndPassword(email, password)
                .then(function () {
                    return true;
                })
                .catch(function (error) {
                    console.log('Login Failed!', error);
                    UserIsLoggedIn = false;
                    return false;
                });
        };

        var resetPasswordRequest = function (email) {
            return auth.sendPasswordResetEmail(email)
                .catch(function (error) {
                    console.log('sendPasswordResetEmail Failed!', error);
                    UserIsLoggedIn = false;
                });
        };

        var logout = function () {
            firebase.auth().signOut();
            UserIsLoggedIn = false;
        };

        return {
            doUserLogin: doUserLogin,
            logout: logout,
            isUserLoggedIn: isUserLoggedIn,
            resetPasswordRequest: resetPasswordRequest
        };
    });
}());