angular.module('services.authentication.interceptor', ['services.authentication.retry-queue']);

// This http interceptor listens for authentication failures
angular.module('services.authentication.interceptor').factory('AuthenticationInterceptor', ['$rootScope', '$injector', '$q', 'AuthenticationRetryQueue', function($rootScope, $injector, $q, queue) {
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
}]);

// We have to add the interceptor to the queue as a string because the interceptor depends upon service instances that are not available in the config block.
angular.module('services.authentication.interceptor').config(['$httpProvider', function($httpProvider) {
  $httpProvider.responseInterceptors.push('AuthenticationInterceptor');
}]);