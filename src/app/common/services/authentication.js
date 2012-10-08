// Based loosely around work by Witold Szczerba - https://github.com/witoldsz/angular-http-auth
angular.module('services.authentication', []);

// The AuthenticationService is the public API for this module.  Application developers should only need to use this service and not any of the others here.
// The general idea is that you watch isLoginRequired for a change to true.  This happens when a http request returns 401 unauthorized. When this happens you need to show your login dialog box.
// When the user has successfully logged in you call loginConfirmed to retry any queued requests.
angular.module('services.authentication').factory('AuthenticationService', ['$http', '$location', 'AuthenticationRequestRetryQueue', function($http, $location, queue) {

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
    // The info about the current authenticated user after a login
    currentUser: null,

    // Login to the back end - on success will trigger
    login: function(email, password) {
      var request = $http.post('/login', {email: email, password: password});
      return request.then(function(response) {
        var user = response.data.user;
        if ( user !== null ) {
          service.currentUser = user;
          queue.process(retryRequest);
        }
        return user;
      });
    },

    logout: function(redirectTo) {
      $http.post('/logout').then(function() {
        service.currentUser = null;
        redirect();
      });
    },

    // Ask the backend to see if a users is already authenticated - this may be from a previous session.
    // The app should probably do this at start up
    requestCurrentUser: function() {
      return $http.get('/current-user').then(function(response) {
        service.currentUser = response.data.user;
        return response;
      });
    },

    cancelLogin: function(redirectTo) {
      queue.clear();
      redirect();
    }
  };

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
angular.module('services.authentication').factory('AuthenticationRequestRetryQueue', ['$rootScope', '$q', function($rootScope, $q) {
  var retryQueue = [];
  var service = {
    pushRequest: function(request) {
      var deferred = $q.defer();
      retryQueue.push({ request: request, deferred: deferred});
      $rootScope.$broadcast('AuthenticationService.unauthorized', request);
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