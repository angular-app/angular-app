angular.module('admin-projects', ['services.projects', 'services.users', 'services.crud'], ['routeCRUDProvider', function (routeCRUDProvider) {

  var getAllUsers = function(Projects, Users, $route){
    return Users.all();
  };

  routeCRUDProvider.defineRoutes('/admin/projects', 'admin/projects', 'Projects', ['Users'], {
    listItems:{'projects': function(Projects){
      return Projects.all();
    }},
    newItem:{'project':function (Projects) {
      return new Projects();
    }, users: getAllUsers},
    editItem:{'project':function (Projects, Users, $route) {
      return Projects.getById($route.current.params.itemId);
    }, users: getAllUsers}
  });
}]);

angular.module('admin-projects').controller('ProjectsListCtrl', ['$scope', 'crudListMethods', 'projects', function ($scope, crudListMethods, projects) {
  $scope.projects = projects;

  angular.extend($scope, crudListMethods('/admin/projects'));
}]);

angular.module('admin-projects').controller('ProjectsEditCtrl', ['$scope', '$location', 'crudEditMethods', 'users', 'project', function ($scope, $location, crudEditMethods, users, project) {

  $scope.selTeamMember = undefined;

  $scope.users = users;
  //prepare users lookup, just keep refferences for easier lookup
  $scope.usersLookup = {};
  angular.forEach(users, function(value, key){
    $scope.usersLookup[value.$id()] = value;
  });

  angular.extend($scope, crudEditMethods('item', project, 'form', function () {
    $location.path('/admin/projects');
  }, function () {
    $scope.updateError = true;
  }));

  $scope.item.teamMembers = $scope.item.teamMembers || [];

  $scope.productOwnerCandidates = function () {
    return $scope.users.filter(function(user){
      return $scope.usersLookup[user.$id()] && $scope.item.canActAsProductOwner(user.$id());
    });
  };

  $scope.scrumMasterCandidates = function() {
    return $scope.users.filter(function(user){
      return $scope.usersLookup[user.$id()] && $scope.item.canActAsScrumMaster(user.$id());
    });
  };

  $scope.teamMemberCandidates = function() {
    return $scope.users.filter(function(user){
      return $scope.usersLookup[user.$id()] && $scope.item.canActAsDevTeamMember(user.$id()) && !$scope.item.isDevTeamMember(user.$id());
    });
  };

  $scope.addTeamMember = function () {
    if ($scope.selTeamMember){
      $scope.item.teamMembers.push($scope.selTeamMember);
      $scope.selTeamMember = undefined;
    }
  };

  $scope.removeTeamMember = function (teamMember) {
    var idx = $scope.item.teamMembers.indexOf(teamMember);
    if (idx >= 0) {
      $scope.item.teamMembers.splice(idx, 1);
    }
  };
}]);