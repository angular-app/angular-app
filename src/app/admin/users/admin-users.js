angular.module('admin-users', ['admin-users-edit', 'services.crud'], ['$routeProvider', function ($routeProvider) {

  var adminUser =  ['AuthenticationService', function(AuthenticationService) {
    return AuthenticationService.requireAdminUser();
  }];

  $routeProvider.when('/admin/users', {
    templateUrl:'admin/users/users-list.tpl.html',
    controller:'UsersListCtrl',
    resolve:{
      users:['Users', function (Users) {
        return Users.all();
      }],
      currentUser: adminUser
    }
  });
  $routeProvider.when('/admin/users/new', {
    templateUrl:'admin/users/users-edit.tpl.html',
    controller:'UsersEditCtrl',
    resolve:{
      user:['Users', function (Users) {
        return new Users();
      }],
      currentUser: adminUser
    }
  });
  $routeProvider.when('/admin/users/:userId', {
    templateUrl:'admin/users/users-edit.tpl.html',
    controller:'UsersEditCtrl',
    resolve:{
      user:['$route', 'Users', function ($route, Users) {
        return Users.getById($route.current.params.userId);
      }],
      currentUser: adminUser
    }
  });
}]);

angular.module('admin-users').controller('UsersListCtrl', ['$scope', 'crudListMethods', 'users', function ($scope, crudListMethods, users) {
  $scope.users = users;

  angular.extend($scope, crudListMethods('/admin/users'));
}]);