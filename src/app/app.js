angular.module('app', ['login', 'dashboard', 'projects', 'admin', 'services.util', 'directives.crud', 'templates']);

angular.module('app').constant('MONGOLAB_CONFIG', {
  baseUrl: 'http://localhost:3000/databases/',
  dbName: 'ascrum'
});

angular.module('app').config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider.otherwise({redirectTo:'/dashboard'});
}]);

angular.module('app').controller('AppCtrl', ['$scope', '$location', '$route', 'AuthenticationService', 'HTTPRequestTracker', function ($scope, $location, $route, AuthenticationService, HTTPRequestTracker) {
  $scope.location = $location;
  $scope.authService = AuthenticationService;

  $scope.isNavbarActive = function (navBarPath) {
    if ($scope.breadcrumbs && $scope.breadcrumbs[0]) {
      return navBarPath === $scope.breadcrumbs[0].name;
    }
    return false;
  };

  $scope.hasPendingRequests = function () {
    return HTTPRequestTracker.hasPendingRequests();
  };

  $scope.$on('$routeChangeStart', function(event, next, current){
    $scope.routeChangeError = undefined;
  });

  //we want to update breadcrumbs only when a route is actually changed
  //as $location.path() will get updated imediatelly (even if route change fails!)
  $scope.$on('$routeChangeSuccess', function(event, current){

    var pathElements = $location.path().split('/'), result = [], i;
    var breadcrumbPath = function (index) {
      return '/' + (pathElements.slice(0, index + 1)).join('/');
    };

    pathElements.shift();
    for (i=0; i<pathElements.length; i++) {
      result.push({name: pathElements[i], path: breadcrumbPath(i)});
    }

    $scope.breadcrumbs = result;
  });

  $scope.$on('$routeChangeError', function(event, current, previous, rejection){
    //TODO: this is too MongoLab specific, itroduce error resolution service
    $scope.routeChangeError = 'Route change error: '+rejection.code;
  });

}]);