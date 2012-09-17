angular.module('admin-projects', ['services.projects', 'services.users']);

angular.module('admin-projects').controller('AdminProjectsCtrl', ['$scope', '$location', 'projects', function ($scope, $location, projects) {

  $scope.projects = projects;

  $scope.itemView = function (item) {
    $location.path('/admin/projects/' + item._id.$oid);
  };
}]);

angular.module('admin-projects').controller('AdminProjectEditCtrl', ['$scope', '$location', 'users', 'project', function ($scope, $location, users, project) {

  $scope.users = users;
  $scope.item = project;
  $scope.itemCopy = angular.copy($scope.item);

  var editCompleted = function () {
    $location.path('/admin/projects');
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
}])
