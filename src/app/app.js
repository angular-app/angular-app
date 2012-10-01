angular.module('app', ['signin', 'dashboard', 'projects', 'admin', 'services.util', 'directives.crud', 'templates']);

angular.module('app').constant('MONGOLAB_CONFIG', {
//  baseUrl: 'https://api.mongolab.com/api/1/databases/',
  baseUrl: 'http://localhost:3000/databases/',
  dbName: 'ascrum'
});

angular.module('app').config(['$routeProvider', function ($routeProvider) {
  $routeProvider.otherwise({redirectTo:'/signin'});
}]);

angular.module('app').controller('AppCtrl', ['$scope', '$location', '$route', 'AuthenticationService', 'HTTPRequestTracker', function ($scope, $location, $route, AuthenticationService, HTTPRequestTracker) {
  $scope.location = $location;
  $scope.authService = AuthenticationService;

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