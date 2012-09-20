angular.module('services.util', []);
angular.module('services.util').factory('HTTPRequestTracker', ['$http', function($http){

  var HTTPRequestTracker = {};
  HTTPRequestTracker.hasPendingRequests = function() {
    return $http.pendingRequests.length > 0;
  };

  return HTTPRequestTracker;
}]);