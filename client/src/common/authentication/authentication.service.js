// Based loosely around work by Witold Szczerba - https://github.com/witoldsz/angular-http-auth
angular.module('authentication.service', [
  'authentication.currentUser', 'authentication.retryQueue', 'authentication.login', 'ui.bootstrap.dialog'
])

// The authentication is the public API for this module.  Application developers should only need to use this service and not any of the others here.
.factory('authentication',
          ['$rootScope', '$http', '$location', '$q', 'authenticationRetryQueue', 'currentUser', '$dialog',
  function( $rootScope,   $http,   $location,   $q,   queue,                      currentUser,   $dialog) {

  var loginDialog = null;
  function openLoginDialog() {
    if ( !loginDialog ) {
      loginDialog = $dialog.dialog();
      loginDialog.open('authentication/login/form.tpl.html', 'LoginFormController').then(function(success) {
        if ( !success ) {
          queue.cancelAll();
          redirect(redirectTo);
        }
      });
    }
  }
  function closeLoginDialog() {
    if (loginDialog) {
      loginDialog.close(true);
      loginDialog = null;
    }
  }

  // We need a way to refresh the page to clear any data that has been loaded when the user logs out
  //  a simple way is to redirect to the root of the application but this could be made more sophisticated
  function redirect(url) {
    url = url || '/';
    $location.path(url);
  }

  queue.onItemAdded = function() {
    if ( queue.hasMore() ) {
      service.showLogin();
    }
  };

  var service = {

    //////////////////////////////////////////////////////////////////////////////////////////
    // The following methods provide information you can bind to in the UI

    // Get the first reason for needing a login
    getLoginReason: function() {
      return queue.retryReason();
    },


    //////////////////////////////////////////////////////////////////////////////////////////
    // The following methods provide handlers for actions that could be triggered in the UI

    // Show the modal login dialog
    showLogin: function(redirectTo) {
      openLoginDialog();
    },

    // Attempt to authenticate a user by the given email and password
    login: function(email, password) {
      var request = $http.post('/login', {email: email, password: password});
      return request.then(function(response) {
        currentUser.update(response.data.user);
        if ( currentUser.isAuthenticated() ) {
          closeLoginDialog();
          queue.retryAll();
        }
      });
    },

    cancelLogin: function(redirectTo) {
      closeLoginDialog();
      redirect(redirectTo);
    },

    // Logout the current user
    logout: function(redirectTo) {
      $http.post('/logout').then(function() {
        currentUser.clear();
        redirect(redirectTo);
      });
    },


    //////////////////////////////////////////////////////////////////////////////////////////
    // The following methods support AngularJS routes.
    // You can add them as resolves to routes to require authorization levels before allowing
    // a route change to complete

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
    },

    // Ask the backend to see if a user is already authenticated - this may be from a previous session.
    requestCurrentUser: function() {
      if ( currentUser.isAuthenticated() ) {
        return $q.when(currentUser);
      } else {
        return $http.get('/current-user').then(function(response) {
          currentUser.update(response.data.user);
          return currentUser;
        });
      }
    }
  };

  // Get the current user when the service is instantiated
  // (in case they are still logged in from a previous session)
  service.requestCurrentUser();

  return service;
}]);