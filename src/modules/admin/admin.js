angular.module('admin', ['admin-projects', 'admin-users'], ['$routeProvider', function($routeProvider){
  $routeProvider.when('/admin', {templateUrl:'admin/partials/admin.tpl.html'});
}]);
