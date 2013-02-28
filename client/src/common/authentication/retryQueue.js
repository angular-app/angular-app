angular.module('authentication.retryQueue', [])

// This is a generic retry queue for authentication failures.  Each item is expected to expose two functions: retry and cancel.
.factory('authenticationRetryQueue', ['$q', function($q) {
  var retryQueue = [];
  var service = {
    // The authentication service puts its own handler in here!
    onItemAdded: angular.noop,
    
    hasMore: function() {
      return retryQueue.length > 0;
    },
    push: function(retryItem) {
      retryQueue.push(retryItem);
      service.onItemAdded();
    },
    pushPromiseFn: function(promiseFn, reason) {
      var deferred = $q.defer();
      var retryItem = {
        reason: reason,
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
    retryReason: function() {
      return service.hasMore() && retryQueue[0].reason;
    },
    cancelAll: function() {
      while(service.hasMore()) {
        retryQueue.shift().cancel();
      }
    },
    retryAll: function() {
      while(service.hasMore()) {
        retryQueue.shift().retry();
      }
    }
  };
  return service;
}]);
