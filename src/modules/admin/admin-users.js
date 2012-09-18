angular.module('admin-users', ['services.users']);

angular.module('admin-users').controller('AdminUsersCtrl', ['$scope', '$location', 'users', function ($scope, $location, users) {
  $scope.users = users;

  $scope.itemView = function (item) {
    $location.path('/admin/users/' + item.$id());
  };
}]);

angular.module('admin-users').controller('AdminUserEditCtrl', ['$scope', '$location', 'user', function ($scope, $location, user) {

  $scope.item = user;
  $scope.itemCopy = angular.copy($scope.item);

  var editCompleted = function () {
    $location.path('/admin/users');
  };

  $scope.save = function () {
    $scope.item.$saveOrUpdate(editCompleted, editCompleted);
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
      $scope.item.$remove(editCompleted);
    } else {
      editCompleted();
    }
  };
}]);