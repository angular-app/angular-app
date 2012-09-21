angular.module('dashboard',[], ['$routeProvider', function($routeProvider){
  $routeProvider.when('/dashboard', {templateUrl:'dashboard/partials/dashboard.tpl.html'});
}]);

angular.module('dashboard').controller('DashboardController', ['$scope', function($scope){
}]);