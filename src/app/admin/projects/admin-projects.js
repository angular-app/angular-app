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