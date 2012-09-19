angular.module('admin-projects', ['services.projects', 'services.users', 'services.util']);

angular.module('admin-projects').controller('AdminProjectsCtrl', ['$scope', '$location', 'projects', function ($scope, $location, projects) {

  $scope.projects = projects;

  $scope.itemView = function (item) {
    $location.path('/admin/projects/' + item.$id());
  };
}]);

angular.module('admin-projects').controller('AdminProjectEditCtrl', ['$scope', '$location', 'CRUDScopeMixIn', 'users', 'project', function ($scope, $location, CRUDScopeMixIn, users, project) {

  var editCompleted = function () {
    $location.path('/admin/projects');
  };

  $scope.selTeamMember = undefined;

  $scope.users = users;
  //prepare users lookup, just keep refferences for easier lookup
  $scope.usersLookup = {};
  angular.forEach(users, function(value, key){
    $scope.usersLookup[value.$id()] = value;
  });

  angular.extend($scope, new CRUDScopeMixIn('item', project, function () {
    $location.path('/admin/projects');
  }));

  $scope.item.teamMembers = $scope.item.teamMembers || [];

  $scope.addTeamMember = function () {
    $scope.item.teamMembers.push($scope.selTeamMember);
    $scope.selTeamMember = undefined;
  };

  $scope.removeTeamMember = function (teamMember) {
    var idx = $scope.item.teamMembers.indexOf(teamMember);
    $scope.item.teamMembers.splice(idx, 1);
  };
}]);
