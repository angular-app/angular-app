angular.module('app', ['signin', 'dashboard', 'admin']);

angular.module('app').constant('API_KEY', '4fb51e55e4b02e56a67b0b66');
angular.module('app').constant('DB_NAME', 'ascrum');

angular.module('app').config(['$routeProvider', function ($routeProvider) {

  $routeProvider.when('/signin', {templateUrl:'signin/form.tpl.html', controller:'SignInCtrl'});

  $routeProvider.when('/dashboard', {templateUrl:'dashboard/dashboard.tpl.html', controller:'DashboardController'});

  $routeProvider.when('/admin', {templateUrl:'admin/admin.tpl.html', controller:'AdminCtrl'});

  $routeProvider.when('/admin/projects', {
    templateUrl:'admin/projects-list.tpl.html',
    controller:'AdminProjectsCtrl',
    resolve:{
      projects:function (Projects) {
        return Projects.all();
      }}
  });
  $routeProvider.when('/admin/projects/new', {
      templateUrl:'admin/project-edit.tpl.html',
      controller:'AdminProjectEditCtrl',
      resolve:{
        project:function (Projects) {
          return new Projects();
        },
        users:function (Users) {
          return Users.all();
        }
      }}
  );
  $routeProvider.when('/admin/projects/:projectId', {
    templateUrl:'admin/project-edit.tpl.html',
    controller:'AdminProjectEditCtrl',
    resolve:{
      project:function ($route, Projects) {
        return Projects.getById($route.current.params.projectId);
      },
      users:function (Users) {
        return Users.all();
      }
    }
  });

  $routeProvider.when('/admin/users', {
    templateUrl:'admin/users-list.tpl.html',
    controller:'AdminUsersCtrl',
    resolve:{users:function (Users) {
      return Users.all();
    }}
  });
  $routeProvider.when('/admin/users/new', {
    templateUrl:'admin/user-edit.tpl.html',
    controller:'AdminUserEditCtrl',
    resolve:{
      user:function (Users) {
        return new Users();
      }
    }
  });
  $routeProvider.when('/admin/users/:userId', {
    templateUrl:'admin/user-edit.tpl.html',
    controller:'AdminUserEditCtrl',
    resolve:{
      user:function ($route, Users) {
        return Users.getById($route.current.params.userId);
      }
    }
  });

  $routeProvider.otherwise({redirectTo:'/signin'});
}]);

angular.module('app').controller('AppCtrl', ['$scope', '$location', 'Security', function ($scope, $location, Security) {
  $scope.location = $location;
  $scope.security = Security;

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
}]);