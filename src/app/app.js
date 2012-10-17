angular.module('app', ['login', 'projectsinfo', 'dashboard', 'projects', 'admin', 'services.breadcrumbs', 'services.httpRequestTracker', 'directives.crud', 'templates']);

angular.module('app').constant('MONGOLAB_CONFIG', {
  baseUrl: 'http://localhost:3000/databases/',
  dbName: 'ascrum'
});

angular.module('app').config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider.otherwise({redirectTo:'/projectsinfo'});
}]);

angular.module('app').controller('AppCtrl', [function() {}]);

angular.module('app').controller('HeaderCtrl', ['$scope', '$location', '$route', 'currentUser', 'breadcrumbs', 'httpRequestTracker', function ($scope, $location, $route, currentUser, breadcrumbs, httpRequestTracker) {
  $scope.location = $location;
  $scope.currentUser = currentUser;
  $scope.breadcrumbs = breadcrumbs;

  $scope.home = function () {
    if ($scope.currentUser.isAuthenticated()) {
      $location.path('/dashboard');
    } else {
      $location.path('/projectsinfo');
    }
  };

  $scope.isNavbarActive = function (navBarPath) {
    return navBarPath === breadcrumbs.getFirst().name;
  };

  $scope.hasPendingRequests = function () {
    return httpRequestTracker.hasPendingRequests();
  };

  $scope.$on('$routeChangeStart', function(event, next, current){
    $scope.routeChangeError = undefined;
  });

  $scope.$on('$routeChangeError', function(event, current, previous, rejection){
    //TODO: this is too MongoLab specific, itroduce error resolution service
    $scope.routeChangeError = 'Route change error: '+rejection.code;
  });
}]);
