angular.module('app', ['ngResource', 'signin', 'dashboard', 'admin']);

angular.module('app').constant('API_KEY', '4fb51e55e4b02e56a67b0b66');
angular.module('app').constant('DB_NAME', 'ascrum');

angular.module('app').config(['$routeProvider', function ($routeProvider) {

  $routeProvider.when('/signin', {templateUrl:'signin/form.tpl.html', controller:'SignInCtrl'});

  $routeProvider.when('/dashboard', {templateUrl:'dashboard/dashboard.tpl.html', controller:'DashboardController'});

  $routeProvider.when('/admin', {templateUrl:'admin/admin.tpl.html', controller:'AdminCtrl'});
  $routeProvider.when('/admin/projects', {templateUrl:'admin/projects-list.tpl.html', controller:'AdminProjectsCtrl'});
  $routeProvider.when('/admin/projects/new', {templateUrl:'admin/project-edit.tpl.html', controller:'AdminProjectEditCtrl'});
  $routeProvider.when('/admin/projects/:projectId', {templateUrl:'admin/project-edit.tpl.html', controller:'AdminProjectEditCtrl'});

  $routeProvider.when('/admin/users', {templateUrl:'admin/users-list.tpl.html', controller:'AdminUsersCtrl'});
  $routeProvider.when('/admin/users/new', {templateUrl:'admin/user-edit.tpl.html', controller:'AdminUserEditCtrl'});
  $routeProvider.when('/admin/users/:userId', {templateUrl:'admin/user-edit.tpl.html', controller:'AdminUserEditCtrl'});

  $routeProvider.otherwise({redirectTo:'/signin'});
}]);

angular.module('app').controller('AppCtrl', ['$scope', '$location', function ($scope, $location) {
  $scope.location = $location;

  $scope.isNavbarActive = function (navBarPath) {
    return navBarPath === $scope.pathElements[0];
  };

  $scope.$watch('location.path()', function (newValue, oldValue) {
    var pathElements = newValue.split('/');
    pathElements.shift();
    $scope.pathElements = pathElements;
  });

  $scope.breadcrumbPath = function (index) {
    return '/' + ($scope.pathElements.slice(0, index + 1)).join('/');
  };
}]);
