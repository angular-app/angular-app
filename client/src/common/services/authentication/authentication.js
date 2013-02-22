// Based loosely around work by Witold Szczerba - https://github.com/witoldsz/angular-http-auth
angular.module('services.authentication', ['services.authentication.currentUser', 'services.authentication.interceptor', 'services.authentication.retryQueue'])

// The authentication is the public API for this module.  Application developers should only need to use this service and not any of the others here.
.factory('authentication', ['$http', '$location', '$q', 'authenticationRetryQueue', 'currentUser', function($http, $location, $q, queue, currentUser) {

  // TODO: We need a way to refresh the page to clear any data that has been loaded when the user logs out
  //  a simple way would be to redirect to the root of the application but this feels a bit inflexible.
  function redirect(url) {
    url = url || '/';
    $location.path(url);
  }

  // Helper to update the currentUser service with a new user
  function updateCurrentUser(user) {
    currentUser.update(user);
    if ( !!user ) {
      queue.retry();
    }
  }

  var service = {
    // Returns true if a login is required, perhaps because of a failed database request
    // You can bind templates to the value returned to show a login form
    isLoginRequired: function() {
      return queue.hasMore();
    },

    // Get the first reason for needing a login
    getLoginReason: function() {
      return queue.getReason();
    },

    // Create a authentication queue item to trigger the login form to be shown
    showLogin: function() {
      // Push a no-op onto the queue to create a manual login
      queue.push({ retry: function() {}, cancel: function() {}, reason: 'user-request' });
    },

    // Attempt to authenticate a user by the given email and password
    login: function(email, password) {
      var request = $http.post('/login', {email: email, password: password});
      return request.then(function(response) {
        updateCurrentUser(response.data.user);
        return currentUser.isAuthenticated();
      });
    },

    // Clear the queue of authentication requests to cancel login and hide the login form
    cancelLogin: function(redirectTo) {
      queue.cancel();
      redirect(redirectTo);
    },

    // Logout the current user
    logout: function(redirectTo) {
      $http.post('/logout').then(function() {
        currentUser.clear();
        redirect(redirectTo);
      });
    },

    // Ask the backend to see if a user is already authenticated - this may be from a previous session.
    requestCurrentUser: function() {
      if ( currentUser.isAuthenticated() ) {
        return $q.when(currentUser);
      } else {
        return $http.get('/current-user').then(function(response) {
          updateCurrentUser(response.data.user);
          return currentUser;
        });
      }
    },

    // Require that there is an authenticated user
    // (use this in a route resolve to prevent non-authenticated users from entering that route)
    requireAuthenticatedUser: function() {
      var promise = service.requestCurrentUser().then(function(currentUser) {
        if ( !currentUser.isAuthenticated() ) {
          return queue.pushPromiseFn(service.requireAuthenticatedUser, 'unauthenticated-client');
        }
      });
      return promise;
    },

    // Require that there is an administrator logged in
    // (use this in a route resolve to prevent non-administrators from entering that route)
    requireAdminUser: function() {
      var promise = service.requestCurrentUser().then(function(currentUser) {
        if ( !currentUser.isAdmin() ) {
          return queue.pushPromiseFn(service.requireAdminUser, 'unauthorized-client');
        }
      });
      return promise;
    }
  };

  // Get the current user when the service is instantiated
  // (in case they are still logged in from a previous session)
  service.requestCurrentUser();

  return service;
}]);