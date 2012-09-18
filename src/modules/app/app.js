angular.module('app', ['signin', 'dashboard', 'admin', 'services.util', 'templates']);

angular.module('app').constant('API_KEY', '4fb51e55e4b02e56a67b0b66');
angular.module('app').constant('DB_NAME', 'ascrum');

angular.module('app').config(['$routeProvider', function ($routeProvider) {

  $routeProvider.when('/signin', {templateUrl:'signin/partials/form.tpl.html', controller:'SignInCtrl'});

  $routeProvider.when('/dashboard', {templateUrl:'dashboard/partials/dashboard.tpl.html', controller:'DashboardController'});

  $routeProvider.when('/admin', {templateUrl:'admin/partials/admin.tpl.html', controller:'AdminCtrl'});

  $routeProvider.when('/admin/projects', {
    templateUrl:'admin/partials/projects-list.tpl.html',
    controller:'AdminProjectsCtrl',
    resolve:{
      projects:['Projects',function (Projects) {
        return Projects.all();
      }]
    }
  });
  $routeProvider.when('/admin/projects/new', {
      templateUrl:'admin/partials/project-edit.tpl.html',
      controller:'AdminProjectEditCtrl',
      resolve:{
        project:['Projects',function (Projects) {
          return new Projects();
        }],
        users:['Users',function (Users) {
          return Users.all();
        }]
      }
    }
  );
  $routeProvider.when('/admin/projects/:projectId', {
    templateUrl:'admin/partials/project-edit.tpl.html',
    controller:'AdminProjectEditCtrl',
    resolve:{
      project:['$route', 'Projects', function ($route, Projects) {
        return Projects.getById($route.current.params.projectId);
      }],
      users:['Users', function (Users) {
        return Users.all();
      }]
    }
  });

  $routeProvider.when('/admin/users', {
    templateUrl:'admin/partials/users-list.tpl.html',
    controller:'AdminUsersCtrl',
    resolve:{
      users:['Users', function (Users) {
        return Users.all();
      }]
    }
  });
  $routeProvider.when('/admin/users/new', {
    templateUrl:'admin/partials/user-edit.tpl.html',
    controller:'AdminUserEditCtrl',
    resolve:{
      user:['Users', function (Users) {
        return new Users();
      }]
    }
  });
  $routeProvider.when('/admin/users/:userId', {
    templateUrl:'admin/partials/user-edit.tpl.html',
    controller:'AdminUserEditCtrl',
    resolve:{
      user:['$route', 'Users', function ($route, Users) {
        return Users.getById($route.current.params.userId);
      }]
    }
  });

  $routeProvider.otherwise({redirectTo:'/signin'});
}]);

angular.module('app').controller('AppCtrl', ['$scope', '$location', 'Security', 'HTTPRequestTracker', function ($scope, $location, Security, HTTPRequestTracker) {
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

  $scope.hasPendingRequests = function () {
    return HTTPRequestTracker.hasPendingRequests();
  };
}]);