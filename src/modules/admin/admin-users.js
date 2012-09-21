angular.module('admin-users', ['services.crud'], ['$routeProvider', function($routeProvider){
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
}]);

angular.module('admin-users').controller('AdminUsersCtrl', ['$scope', '$location', 'users', function ($scope, $location, users) {
  $scope.users = users;

  $scope.itemView = function (item) {
    $location.path('/admin/users/' + item.$id());
  };
}]);

angular.module('admin-users').controller('AdminUserEditCtrl', ['$scope', '$location', 'CRUDScopeMixIn', 'user', function ($scope, $location, CRUDScopeMixIn, user) {

  angular.extend($scope, new CRUDScopeMixIn('item', user, 'form', function () {
    $location.path('/admin/users');
  }));

}]);