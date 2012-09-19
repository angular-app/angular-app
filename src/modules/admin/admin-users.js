angular.module('admin-users', ['services.users']);

angular.module('admin-users').controller('AdminUsersCtrl', ['$scope', '$location', 'users', function ($scope, $location, users) {
  $scope.users = users;

  $scope.itemView = function (item) {
    $location.path('/admin/users/' + item.$id());
  };
}]);

angular.module('admin-users').controller('AdminUserEditCtrl', ['$scope', '$location', 'CRUDScopeMixIn', 'user', function ($scope, $location, CRUDScopeMixIn, user) {

  angular.extend($scope, new CRUDScopeMixIn('item', user, function () {
    $location.path('/admin/users');
  }));

}]);