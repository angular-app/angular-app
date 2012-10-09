angular.module('app', ['login', 'dashboard', 'projects', 'admin', 'services.util', 'directives.crud', 'templates']);

angular.module('app').constant('MONGOLAB_CONFIG', {
  baseUrl: 'http://localhost:3000/databases/',
  dbName: 'ascrum'
});

angular.module('app').config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider.otherwise({redirectTo:'/dashboard'});
}]);

angular.module('app').controller('AppCtrl', [function() {}]);

angular.module('app').controller('HeaderCtrl', ['$scope', '$location', '$route', 'currentUser', 'HTTPRequestTracker', function ($scope, $location, $route, currentUser, HTTPRequestTracker) {
  $scope.location = $location;
  $scope.currentUser = currentUser;
  
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

  $scope.$on('$routeChangeError', function(event, current, previous, rejection){
    //TODO: this is too MongoLab specific, itroduce error resolution service
    $scope.routeChangeError = 'Route change error: '+rejection.code;
  });

  $scope.$on('$routeChangeStart', function(event, next, current){
    $scope.routeChangeError = undefined;
  });
}]);
