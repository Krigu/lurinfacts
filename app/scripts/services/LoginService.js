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
            auth.signInWithEmailAndPassword(email, password)
                .catch(function (error) {
                    console.log('Login Failed!', error);
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
            isUserLoggedIn: isUserLoggedIn
        };
    });
} ());