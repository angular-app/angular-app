angular.module('admin-projects', ['resources.projects', 'resources.users', 'services.crud'], ['$routeProvider', function ($routeProvider) {

  var adminUser =  ['AuthenticationService', function(AuthenticationService) {
    return AuthenticationService.requireAdminUser();
  }];

  var getAllUsers = function(Projects, Users, $route){
    return Users.all();
  };

  $routeProvider.when('/admin/projects', {
    templateUrl:'admin/projects/projects-list.tpl.html',
    controller:'ProjectsListCtrl',
    resolve:{
      projects:['Projects', function (Projects) {
        return Projects.all();
      }],
      adminUser: adminUser
    }
  });
  $routeProvider.when('/admin/projects/new', {
    templateUrl:'admin/projects/projects-edit.tpl.html',
    controller:'ProjectsEditCtrl',
    resolve:{
      users: getAllUsers,
      project:['Projects', function (Projects) {
        return new Projects();
      }],
      adminUser: adminUser
    }
  });
  $routeProvider.when('/admin/projects/:projectId', {
    templateUrl:'admin/projects/projects-edit.tpl.html',
    controller:'ProjectsEditCtrl',
    resolve:{
      users: getAllUsers,
      project:['$route', 'Projects', function ($route, Projects) {
        return Projects.getById($route.current.params.projectId);
      }],
      adminUser: adminUser
    }
  });
}]);

angular.module('admin-projects').controller('ProjectsListCtrl', ['$scope', 'crudListMethods', 'projects', function ($scope, crudListMethods, projects) {
  $scope.projects = projects;

  angular.extend($scope, crudListMethods('/admin/projects'));
}]);

angular.module('admin-projects').controller('ProjectsEditCtrl', ['$scope', '$location', 'users', 'project', function ($scope, $location, users, project) {

  $scope.project = project;

  $scope.selTeamMember = undefined;

  $scope.users = users;
  //prepare users lookup, just keep refferences for easier lookup
  $scope.usersLookup = {};
  angular.forEach(users, function(value, key){
    $scope.usersLookup[value.$id()] = value;
  });

  $scope.onSave = function () {
    $location.path('/admin/projects');
  };

  $scope.onError = function () {
    $scope.updateError = true;
  };

  $scope.project.teamMembers = $scope.project.teamMembers || [];

  $scope.productOwnerCandidates = function () {
    return $scope.users.filter(function(user){
      return $scope.usersLookup[user.$id()] && $scope.project.canActAsProductOwner(user.$id());
    });
  };

  $scope.scrumMasterCandidates = function() {
    return $scope.users.filter(function(user){
      return $scope.usersLookup[user.$id()] && $scope.project.canActAsScrumMaster(user.$id());
    });
  };

  $scope.teamMemberCandidates = function() {
    return $scope.users.filter(function(user){
      return $scope.usersLookup[user.$id()] && $scope.project.canActAsDevTeamMember(user.$id()) && !$scope.project.isDevTeamMember(user.$id());
    });
  };

  $scope.addTeamMember = function () {
    if ($scope.selTeamMember){
      $scope.project.teamMembers.push($scope.selTeamMember);
      $scope.selTeamMember = undefined;
    }
  };

  $scope.removeTeamMember = function (teamMember) {
    var idx = $scope.project.teamMembers.indexOf(teamMember);
    if (idx >= 0) {
      $scope.project.teamMembers.splice(idx, 1);
    }
  };
}]);