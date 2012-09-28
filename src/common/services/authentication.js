// Based loosely around work by Witold Szczerba - https://github.com/witoldsz/angular-http-auth
angular.module('services.authentication', []);

angular.module('services.authentication').factory('AuthenticationFailedRetryQueue', ['$q', function($q) {
  var retryQueue = [];
  return {
    pushItem: function(response) {
      loginRequired = true;
      var deferred = $q.defer();
      retryQueue.push({ request: response.config, deferred: deferred});
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

angular.module('services.authentication').factory('AuthenticationService', ['$http', '$rootScope', 'AuthenticationFailedRetryQueue', function($http, queue) {

  function retryRequest (next) {
    $http(next.request).then(function(response) {
      next.deferred.resolve(response);
    });
  }

  return {
    // Directives or controllers should watch this to see if a login form should be displayed
    isLoginRequired: function() {
      return queue.hasMore();
    },
    // Once the user has logged in the directive or controller should call this to empty retry the requests
    loginConfirmed: function() {
      while(queue.hasMore()) {
        retryRequest(queue.getNext());
      }
    }
  };
}]);

angular.module('services.authentication').factory('AuthenticationIntercepter', ['AuthenticationFailedRetryQueue', function(queue) {
  return function(promise) {
    return promise.then(null, function(response) {
      if (response.status === 401) {
        return queue.pushItem(response);
      }
      return response;
    });
  };
}]);

angular.module('services.authentication').config(['$httpProvider', function($httpProvider) {
  $httpProvider.responseInterceptors.push('AuthenticationIntercepter');
}]);