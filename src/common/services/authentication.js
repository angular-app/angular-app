// Based loosely around work by Witold Szczerba - https://github.com/witoldsz/angular-http-auth
angular.module('services.authentication', []);

// The AuthenticationService is the public API for this module.  Application developers should only need to use this service and not any of the others here.
// The general idea is that you watch isLoginRequired for a change to true.  This happens when a http request returns 401 unauthorized. When this happens you need to show your login dialog box.
// When the user has successfully logged in you call loginConfirmed to retry any queued requests.
angular.module('services.authentication').factory('AuthenticationService', ['$rootScope', '$http', 'AuthenticationRequestRetryQueue', function($rootScope, $http, queue) {

  function retryRequest (next) {
    $http(next.request).then(function(response) {
      next.deferred.resolve(response);
    });
  }

  var service = {
    // Directives or controllers should watch this to see if a login form should be displayed
    isLoginRequired: function() {
      var hasMore = queue.hasMore();
      if ( hasMore ) {
        service.currentUser = null;
      }
      return hasMore;
    },

    // The info about the current authenticated user after a login
    currentUser: null,

    // Login to the back end - on success will trigger
    login: function(email, password) {
      var request = $http.post('/login', {email: email, password: password});
      request.success(function(response) {
        service.retryRequests();
        service.requestCurrentUser();
      });
      return request;
    },

    // Retry the requests once the user has successfully logged in
    retryRequests: function() {
      while(queue.hasMore()) {
        retryRequest(queue.getNext());
      }
    },

    // Ask the backend to see if a users is already authenticated - this may be from a previous session.
    // The app should probably do this at start up
    requestCurrentUser: function() {
      return $http.get('/current-user').success(function(response) {
        service.currentUser = response;
      });
    }
  };

  return service;
}]);

angular.module('services.authentication').factory('AuthenticationRequestRetryQueue', ['$q', function($q) {
  var retryQueue = [];
  return {
    pushRequest: function(request) {
      loginRequired = true;
      var deferred = $q.defer();
      retryQueue.push({ request: request, deferred: deferred});
      return deferred.promise;
    },
    hasMore: function() {
      return retryQueue.length > 0;
    },
    getNext: function() {
      return retryQueue.shift();
    }
  };
}]);

angular.module('services.authentication').factory('AuthenticationInterceptor', ['AuthenticationRequestRetryQueue', function(queue) {
  return function(promise) {
    return promise.then(null, function(response) {
      if (response.status === 401) {
        return queue.pushRequest(response.config);
      }
      return promise;
    });
  };
}]);

angular.module('services.authentication').config(['$httpProvider', function($httpProvider) {
  $httpProvider.responseInterceptors.push('AuthenticationInterceptor');
}]);