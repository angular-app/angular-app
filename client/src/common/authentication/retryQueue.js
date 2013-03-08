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
    pushRetryFn: function(reason, retryFn) {
      // The reason parameter is optional
      if ( arguments.length === 1) {
        retryFn = reason;
        reason = undefined;
      }

      // The deferred object that will be resolved or rejected by calling retry or cancel
      var deferred = $q.defer();
      var retryItem = {
        reason: reason,
        retry: function() {
          // Wrap the result of the retryFn into a promise if it is not already
          $q.when(retryFn()).then(function(value) {
            // If it was successful then resolve our deferred
            deferred.resolve(value);
          }, function(value) {
            // Othewise reject it
            deferred.reject(value);
          });
        },
        cancel: function() {
          // Give up on retrying and reject our deferred
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
