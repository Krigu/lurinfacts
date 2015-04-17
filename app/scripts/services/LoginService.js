/**
 * Created by Käser on 07/04/2015.
 */
angular.module('lurinfacts').factory('LoginService', function () {
  var UserIsLoggedIn = false;
  var firebaseRef = 'https://burning-inferno-892.firebaseio.com/';
  var ref = new Firebase(firebaseRef);
  var authData = ref.getAuth();
if (authData) {
  console.log("User " + authData.uid + " is logged in with " + authData.provider);
} else {
  console.log("User is logged out");
}
    /*
  new FirebaseAuthClient(ref, function (error, user) {
    if (error) {
      alert(error);
      return;
    }
    UserIsLoggedIn = !!user;
  });
  var isUserLoggedIn = function(){
    return UserIsLoggedIn;
  };
*/
   var isUserLoggedIn = function () {
    return UserIsLoggedIn;
   }
    
    var doUserLogin = function (email, password,iAmLazy) {
    ref.authWithPassword({
      email    :email,
      password : password,
      remember : iAmLazy
    }, function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
        UserIsLoggedIn = false;
      } else {
        console.log("Authenticated successfully with payload:", authData);
        UserIsLoggedIn = true;
      }
    });
  };
  return {doUserLogin: doUserLogin, UserIsLoggedIn: isUserLoggedIn};
});
