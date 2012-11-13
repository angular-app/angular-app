angular.module('admin-users', ['admin-users-edit', 'services.crud'])

.config(['crudRouteProvider', function (crudRouteProvider) {

  var adminUser =  ['AuthenticationService', function(AuthenticationService) {
    return AuthenticationService.requireAdminUser();
  }];

  crudRouteProvider.routesFor('Users', 'admin')
    .whenList({
      users: ['Users', function(Users) { return Users.all(); }],
      currentUser: adminUser
    })
    .whenNew({
      user: ['Users', function(Users) { return new Users(); }],
      currentUser: adminUser
    })
    .whenEdit({
      user:['$route', 'Users', function ($route, Users) {
        return Users.getById($route.current.params.userId);
      }],
      currentUser: adminUser
    });
}])

.controller('UsersListCtrl', ['$scope', 'crudListMethods', 'users', function ($scope, crudListMethods, users) {
  $scope.users = users;

  angular.extend($scope, crudListMethods('/admin/users'));
}]);