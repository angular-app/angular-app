// Based loosely around work by Witold Szczerba - https://github.com/witoldsz/angular-http-auth
angular.module('services.authentication', ['services.authentication.current-user', 'services.authentication.interceptor', 'services.authentication.retry-queue']);

// The AuthenticationService is the public API for this module.  Application developers should only need to use this service and not any of the others here.
angular.module('services.authentication').factory('AuthenticationService', ['$rootScope', '$http', '$location', '$q', 'AuthenticationRetryQueue', 'currentUser', function($rootScope, $http, $location, $q, queue, currentUser) {

  // TODO: We need a way to refresh the page to clear any data that has been loaded when the user logs out
  //  a simple way would be to redirect to the root of the application but this feels a bit inflexible.
  function redirect(url) {
    url = url || '/';
    $location.path(url);
  }

  function cancel(redirectTo) {
    queue.cancel();
    redirect(redirectTo);
  }

  function updateCurrentUser(user) {
    currentUser.update(user);
    if ( !!user ) {
      console.log('login confirmed');
      $rootScope.$broadcast('AuthenticationService.loginConfirmed');
      queue.retry();
    }
  }

  var service = {
    loginRequired: function(reason) {
      reason = reason || 'login';
      $rootScope.$broadcast('AuthenticationService.loginRequired', reason, cancel);
    },

    login: function(email, password) {
      var request = $http.post('/login', {email: email, password: password});
      return request.then(function(response) {
        updateCurrentUser(response.data.user);
        return currentUser.isAuthenticated();
      });
    },

    logout: function(redirectTo) {
      $http.post('/logout').then(function() {
        currentUser.clear();
        redirect(redirectTo);
      });
    },

    // Ask the backend to see if a users is already authenticated - this may be from a previous session.
    // The app should probably do this at start up
    requestCurrentUser: function() {
      return $http.get('/current-user').then(function(response) {
        updateCurrentUser(response.data.user);
        return response;
      });
    },

    requireAuthenticatedUser: function() {
      var deferred = $q.defer();
      if ( currentUser.isAuthenticated() ) {
        // if we are already authenticated then simply resolve!
        deferred.resolve(currentUser);
      } else {
        // we are not an admin right now.  Add a new item to the retry queue
        var retryItem = {
          deferred: deferred,
          retry: function() {
            service.requireAuthenticatedUser().then(function(currentUser) {
              deferred.resolve(currentUser);
            });
          },
          cancel: function() {
            deferred.reject();
          }
        };
        queue.push(retryItem);
      }
      return deferred.promise;
    },

    requireAdminUser: function() {
      var deferred = $q.defer();
      if ( currentUser.isAdmin() ) {
        // if we are admin already then simply resolve!
        deferred.resolve(currentUser);
      } else {
        // we are not an admin right now.  Add a new item to the retry queue
        var retryItem = {
          deferred: deferred,
          retry: function() {
            service.requireAdminUser().then(function(currentUser) {
              deferred.resolve(currentUser);
            });
          },
          cancel: function() {
            deferred.reject();
          }
        };
        queue.push(retryItem);
      }
      return deferred.promise;
    }
  };

  // Watch the retry queue and raise an event if the queue goes from no items to some items
  $rootScope.$watch(function() { return queue.hasMore(); }, function(value) {
    if ( value ) {
      if ( currentUser.isAuthenticated() ) {
        // If a user is already logged in then they must not have the required permissions
        service.loginRequired('unauthorized');
      } else {
        service.loginRequired('unauthenticated');
      }
    }
  });

  // Get the current user when the service is instantiated
  service.requestCurrentUser();

  return service;
}]);

