angular.module('services.authentication.current-user', []);
// The current user.  You can watch this for changes due to logging in and out
angular.module('services.authentication.current-user').factory('currentUser', function() {
  var userInfo = null;
  var currentUser = {
    update: function(info) { userInfo = info; },
    clear: function() { userInfo = null; },
    info: function() { return userInfo; },
    isAuthenticated: function(){ return !!userInfo; },
    isAdmin: function() { return !!(userInfo && userInfo.admin); }
  };
  return currentUser;
});

