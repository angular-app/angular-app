angular.module('dashboard',['services.projects'], ['$routeProvider', function($routeProvider){
  $routeProvider.when('/dashboard', {
    templateUrl:'dashboard/dashboard.tpl.html',
    controller:'DashboardCtrl'
  });
}]);

angular.module('dashboard').controller('DashboardCtrl', ['$scope', function($scope){
}]);