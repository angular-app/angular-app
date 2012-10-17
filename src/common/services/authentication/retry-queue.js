angular.module('services.authentication.retry-queue', []);
// This is a generic retry queue for authentication failures.  Each item is expected to expose two functions: retry and cancel.
angular.module('services.authentication.retry-queue').factory('AuthenticationRetryQueue', ['$q', function($q) {
  var retryQueue = [];
  var service = {
    push: function(retryItem) {
      retryQueue.push(retryItem);
    },
    pushPromiseFn: function(promiseFn) {
      var deferred = $q.defer();
      var retryItem = {
        retry: function() {
          promiseFn().then(function(value) {
            deferred.resolve(value);
          });
        },
        cancel: function() {
          deferred.reject();
        }
      };
      service.push(retryItem);
      return deferred.promise;
    },
    hasMore: function() {
      return retryQueue.length > 0;
    },
    getReason: function() {
      if ( service.hasMore() ) {
        return retryQueue[0].reason;
      }
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
