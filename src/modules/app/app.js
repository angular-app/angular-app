angular.module('app', ['signin', 'dashboard', 'admin', 'services.util', 'templates']);

angular.module('app').constant('API_KEY', '4fb51e55e4b02e56a67b0b66');
angular.module('app').constant('DB_NAME', 'ascrum');

angular.module('app').config(['$routeProvider', function ($routeProvider) {
  $routeProvider.otherwise({redirectTo:'/signin'});
}]);

angular.module('app').controller('AppCtrl', ['$scope', '$location', 'Security', 'HTTPRequestTracker', function ($scope, $location, Security, HTTPRequestTracker) {
  $scope.location = $location;
  $scope.security = Security;

  $scope.isNavbarActive = function (navBarPath) {
    return navBarPath === $scope.pathElements[0];
  };

  $scope.$watch('location.path()', function (newValue) {
    var pathElements = newValue.split('/');
    pathElements.shift();
    $scope.pathElements = pathElements;
  });

  $scope.breadcrumbPath = function (index) {
    return '/' + ($scope.pathElements.slice(0, index + 1)).join('/');
  };

  $scope.hasPendingRequests = function () {
    return HTTPRequestTracker.hasPendingRequests();
  };
}]);