angular.module('authentication.interceptor', ['authentication.retryQueue'])

// This http interceptor listens for authentication failures
.factory('authenticationInterceptor', ['$rootScope', '$injector', '$q', 'authenticationRetryQueue', function($rootScope, $injector, $q, queue) {
  var $http; // To be lazy initialized to prevent circular dependency
  return function(promise) {
    $http = $http || $injector.get('$http');
    
    // Intercept failed requests
    return promise.then(null, function(originalResponse) {
      if(originalResponse.status === 401) {
        // The request bounced because it was not authorized - add a new request to the retry queue
        promise = queue.pushPromiseFn(function() { return $http(originalResponse.config); }, 'unauthorized-server');
      }
      return promise;
    });
  };
}])

// We have to add the interceptor to the queue as a string because the interceptor depends upon service instances that are not available in the config block.
.config(['$httpProvider', function($httpProvider) {
  $httpProvider.responseInterceptors.push('authenticationInterceptor');
}]);