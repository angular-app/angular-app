angular.module('admin-users', ['services.users']);

angular.module('admin-users').controller('AdminUsersCtrl', ['$scope', '$location', 'Users', function ($scope, $location, Users) {
  $scope.users = Users.query();

  $scope.itemView = function (item) {
    $location.path('/admin/users/' + item._id.$oid);
  };
}]);

angular.module('admin-users').controller('AdminUserEditCtrl', ['$scope', '$location', '$routeParams', 'Users', function ($scope, $location, $routeParams, Users) {

  if ($routeParams.userId) {
    Users.getById($routeParams.userId, function (item) {
      $scope.item = item;
      $scope.itemCopy = angular.copy(item);
    });
  } else {
    $scope.item = new Users();
    $scope.itemCopy = angular.copy($scope.item);
  }

  var editCompleted = function () {
    $location.path('/admin/users');
  };

  $scope.save = function () {
    $scope.item.saveOrUpdate(editCompleted, editCompleted);
  };

  $scope.canSave = function () {
    return $scope.form.$valid && !angular.equals($scope.item, $scope.itemCopy);
  };

  $scope.revertChanges = function () {
    $scope.item = angular.copy($scope.itemCopy);
  };

  $scope.canRevert = function () {
    return !angular.equals($scope.item, $scope.itemCopy);
  };

  $scope.remove = function () {
    if ($scope.item._id) {
      $scope.item.remove(editCompleted);
    } else {
      editCompleted();
    }
  };
}]);