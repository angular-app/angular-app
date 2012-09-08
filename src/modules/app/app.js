angular.module('app', ['signin', 'dashboard']);

angular.module('app').config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/signin', {templateUrl:'signin.form.tpl.html', controller:'SignInController'});
  $routeProvider.when('/dashboard', {templateUrl:'dashboard.tpl.html', controller:'DashboardController'});
  $routeProvider.otherwise({redirectTo:'/signin'});
}]);

angular.module('app').controller('AppController', ['$scope', '$location', function ($scope, $location) {
  $scope.location = $location;
}]);
