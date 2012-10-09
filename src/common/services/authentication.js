// Based loosely around work by Witold Szczerba - https://github.com/witoldsz/angular-http-auth
angular.module('services.authentication', []);

// The current user.  You can watch this for changes due to logging in and out
angular.module('services.authentication').factory('currentUser', function() {
  var userInfo = null;
  var currentUser = {
    update: function(info) { userInfo = info; },
    info: function() { return userInfo; },
    isAuthenticated: function(){ return !!userInfo; },
    isAdmin: function() { return !!(userInfo && userInfo.admin); }
  };
  return currentUser;
});

// The AuthenticationService is the public API for this module.  Application developers should only need to use this service and not any of the others here.
// The general idea is that you watch isLoginRequired for a change to true.  This happens when a http request returns 401 unauthorized. When this happens you need to show your login dialog box.
// When the user has successfully logged in you call loginConfirmed to retry any queued requests.
angular.module('services.authentication').factory('AuthenticationService', ['$rootScope', '$http', '$location', 'AuthenticationRequestRetryQueue', 'currentUser', function($rootScope, $http, $location, queue, currentUser) {

  function retryRequest(next) {
    $http(next.request.config).then(function(response) {
      next.deferred.resolve(response);
    });
  }

  // TODO: We need a way to refresh the page to clear any data that has been loaded when the user logs out
  //  a simple way would be to redirect to the root of the application but this feels a bit inflexible.
  function redirect(url) {
    url = url || '/';
    $location.path(url);
  }

  var service = {
    // Login to the back end - on success will trigger
    login: function(email, password) {
      var request = $http.post('/login', {email: email, password: password});
      return request.then(function(response) {
        var user = response.data.user;
        currentUser.update(user);
        if ( user !== null ) {
          queue.process(retryRequest);
        }
        return user;
      });
    },

    showLogin: function(reason) {
      reason = reason || 'login';
      $rootScope.$broadcast('AuthenticationService.' + reason);
    },

    logout: function(redirectTo) {
      $http.post('/logout').then(function() {
        currentUser.update(null);
        redirect();
      });
    },

    // Ask the backend to see if a users is already authenticated - this may be from a previous session.
    // The app should probably do this at start up
    requestCurrentUser: function() {
      return $http.get('/current-user').then(function(response) {
        currentUser.update(response.data.user);
        return response;
      });
    },

    cancelLogin: function(redirectTo) {
      queue.clear();
      redirect();
    }
  };

  // Watch the retry queue and raise an event if the queue goes from no items to some items
  $rootScope.$watch(function() { return queue.hasMore(); }, function(value, oldValue, other) {
    if ( value ) {
      if ( currentUser.isAuthenticated() ) {
        // If a user is already logged in then they must not have the required permissions
        service.showLogin('unauthorized');
      } else {
        service.showLogin('unauthenticated');
      }
    }
  });

  // Get the current user when the controller is instantiated - this could be put in the main app controller so that it is only called once??
  service.requestCurrentUser();

  return service;
}]);


// The main reason for this service is to decouple the AuthenticationService and the AuthenticationInterceptor.
// Otherwise you get circular dependencies based around $http:
//  - AuthenticationService -> $http -> AuthenticationInterceptor -> AuthenticationService
// In this case we have:
//  - AuthenticationService -> [AuthenticationRequestRetryQueue, $http]
//  - $http -> AuthenticationInterceptor -> AuthenticationRequestRetryQueue
angular.module('services.authentication').factory('AuthenticationRequestRetryQueue', ['$q', function($q) {
  var retryQueue = [];
  var service = {
    pushRequest: function(request) {
      var deferred = $q.defer();
      retryQueue.push({ request: request, deferred: deferred});
      return deferred.promise;
    },
    hasMore: function() {
      return retryQueue.length > 0;
    },
    getNext: function() {
      return retryQueue.shift();
    },
    clear: function() {
      retryQueue = [];
    },
    process: function(processFn) {
      while(service.hasMore()) {
        processFn(service.getNext());
      }
    }
  };
  return service;
}]);

// Simply intercept the request and add it to the retry queue if it is unauthorized
angular.module('services.authentication').factory('AuthenticationInterceptor', ['AuthenticationRequestRetryQueue', function(queue) {
  return function(promise) {
    return promise.then(null, function(response) {
      if (response.status === 401) {
        promise = queue.pushRequest(response);
      }
      return promise;
    });
  };
}]);

// We have to add the interceptor to the queue as a string because the interceptor depends upon service instances that are not available in the config block.
angular.module('services.authentication').config(['$httpProvider', function($httpProvider) {
  $httpProvider.responseInterceptors.push('AuthenticationInterceptor');
}]);