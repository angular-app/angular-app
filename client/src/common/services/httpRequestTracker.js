angular.module('services.httpRequestTracker', []);
angular.module('services.httpRequestTracker').factory('httpRequestTracker', ['$http', function($http){

  var httpRequestTracker = {};
  httpRequestTracker.hasPendingRequests = function() {
    return $http.pendingRequests.length > 0;
  };

  return httpRequestTracker;
}]);