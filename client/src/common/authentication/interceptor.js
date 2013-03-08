angular.module('authentication.interceptor', ['authentication.retryQueue'])

// This http interceptor listens for authentication failures
.factory('authenticationInterceptor', ['$injector', 'authenticationRetryQueue', function($injector, queue) {
  return function(promise) {
    // Intercept failed requests
    return promise.then(null, function(originalResponse) {
      if(originalResponse.status === 401) {
        // The request bounced because it was not authorized - add a new request to the retry queue
        promise = queue.pushRetryFn('unauthorized-server', function retryRequest() {
          // We must use $injector to get the $http service to prevent circular dependency
          return $injector.get('$http')(originalResponse.config);
        });
      }
      return promise;
    });
  };
}])

// We have to add the interceptor to the queue as a string because the interceptor depends upon service instances that are not available in the config block.
.config(['$httpProvider', function($httpProvider) {
  $httpProvider.responseInterceptors.push('authenticationInterceptor');
}]);