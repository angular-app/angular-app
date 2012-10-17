angular.module('services.authentication.retry-queue', []);
// This is a generic retry queue for authentication failures.  Each item is expected to expose two functions: retry and cancel.
angular.module('services.authentication.retry-queue').factory('AuthenticationRetryQueue', ['$rootScope', function($rootScope) {
  var retryQueue = [];
  var service = {
    push: function(retryItem) {
      retryQueue.push(retryItem);
    },
    hasMore: function() {
      return retryQueue.length > 0;
    },
    getNext: function() {
      return retryQueue.shift();
    },
    cancel: function() {
      while(service.hasMore()) {
        service.getNext().cancel();
      }
    },
    retry: function() {
      while(service.hasMore()) {
        service.getNext().retry();
      }
    }
  };
  return service;
}]);
