angular.module('app', ['signin', 'dashboard', 'projects', 'productbacklog', 'admin', 'services.util', 'directives.crud', 'templates']);

angular.module('app').constant('MONGOLAB_CONFIG', {
//  baseUrl: 'https://api.mongolab.com/api/1/databases/',
  baseUrl: 'http://localhost:3000/databases/',
  dbName: 'ascrum',
  apiKey: '4fb51e55e4b02e56a67b0b66'
});

angular.module('app').config(['$routeProvider', function ($routeProvider) {
  $routeProvider.otherwise({redirectTo:'/signin'});
}]);

angular.module('app').controller('AppCtrl', ['$scope', '$location', 'Security', 'HTTPRequestTracker', function ($scope, $location, Security, HTTPRequestTracker) {
  $scope.location = $location;
  $scope.security = Security;
  $scope.pathElements = [];

  $scope.isNavbarActive = function (navBarPath) {
    return navBarPath === $scope.pathElements[0];
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

  $scope.$on('$routeChangeSuccess', function(event, current){

    var pathElements = $location.path().split('/'), result = [], path = '';
    pathElements.shift();

    var pathParamsLookup = {};
    angular.forEach(current.pathParams, function (value, key) {
      pathParamsLookup[value] = key;
    });

    angular.forEach(pathElements, function (pathElement, key) {
      var name, bcrumbResolvers = current.breadcrumbs || {};
      if (pathParamsLookup[pathElement] && angular.isFunction(bcrumbResolvers[pathParamsLookup[pathElement]])) {
        name = bcrumbResolvers[pathParamsLookup[pathElement]](current.locals);
      }
      path += '/'+pathElement;
      result.push({name: name || pathElement, path: path});
    });

    $scope.pathElements = result;
  });
}]);