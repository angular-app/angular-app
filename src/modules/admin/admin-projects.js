angular.module('admin-projects', ['services.projects', 'services.users']);

angular.module('admin-projects').controller('AdminProjectsCtrl', ['$scope', '$location', 'Projects', function ($scope, $location, Projects) {
  $scope.projects = Projects.query();

  $scope.itemView = function (item) {
    $location.path('/admin/projects/' + item._id.$oid);
  };
}]);

angular.module('admin-projects').controller('AdminProjectEditCtrl', ['$scope', '$location', '$routeParams', 'Projects', 'Users', 'Roles', function ($scope, $location, $routeParams, Projects, Users, Roles) {

 $scope.users = Users.query();
 $scope.roles = Roles;

  if ($routeParams.projectId) {
    Projects.getById($routeParams.projectId, function (item) {
      $scope.item = item;
      $scope.itemCopy = angular.copy(item);
    });
  } else {
    $scope.item = new Projects({users:[]});
    $scope.itemCopy = angular.copy($scope.item);
  }

  var editCompleted = function () {
    $location.path('/admin/projects');
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

  $scope.addUserWithRole = function () {
    if (!angular.isArray($scope.item.users)){
      $scope.item.users = [];
    }
    $scope.item.users.push($scope.projectUser);
    $scope.projectUser = {};
  };

  $scope.removeUserWithRole = function (userWithRole) {
    var index = $scope.item.users.indexOf(userWithRole);
    $scope.item.users.splice(index,1);
  };
}]);