angular.module('admin-projects', ['services.projects', 'services.users']);

angular.module('admin-projects').controller('AdminProjectsCtrl', ['$scope', '$location', 'projects', function ($scope, $location, projects) {

  $scope.projects = projects;

  $scope.itemView = function (item) {
    $location.path('/admin/projects/' + item._id.$oid);
  };
}]);

angular.module('admin-projects').controller('AdminProjectEditCtrl', ['$scope', '$location', 'users', 'project', function ($scope, $location, users, project) {

  $scope.selTeamMember = undefined;

  $scope.users = users;
  //prepare users lookup, just keep refferences for easier lookup
  $scope.usersLookup = {};
  angular.forEach(users, function(value, key){
    $scope.usersLookup[value.$id()] = value;
  });

  $scope.item = project;
  $scope.item.teamMembers = $scope.item.teamMembers || [];
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

  $scope.addTeamMember = function () {
    $scope.item.teamMembers.push($scope.selTeamMember);
    $scope.selTeamMember = undefined;
  };

  $scope.removeTeamMember = function (teamMember) {
    var idx = $scope.item.teamMembers.indexOf(teamMember);
    $scope.item.teamMembers.splice(idx, 1);
  };
}]);
