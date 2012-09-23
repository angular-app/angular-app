angular.module('admin-projects', ['services.projects', 'services.users', 'services.crud'], ['$routeProvider', function($routeProvider){
  $routeProvider.when('/admin/projects', {
    templateUrl:'admin/partials/projects-list.tpl.html',
    controller:'AdminProjectsCtrl',
    resolve:{
      projects:['Projects',function (Projects) {
        return Projects.all();
      }]
    }
  });
  $routeProvider.when('/admin/projects/new', {
      templateUrl:'admin/partials/project-edit.tpl.html',
      controller:'AdminProjectEditCtrl',
      resolve:{
        project:['Projects',function (Projects) {
          return new Projects();
        }],
        users:['Users',function (Users) {
          return Users.all();
        }]
      }
    }
  );
  $routeProvider.when('/admin/projects/:projectId', {
    templateUrl:'admin/partials/project-edit.tpl.html',
    controller:'AdminProjectEditCtrl',
    resolve:{
      project:['$route', 'Projects', function ($route, Projects) {
        return Projects.getById($route.current.params.projectId);
      }],
      users:['Users', function (Users) {
        return Users.all();
      }]
    }
  });
}]);

angular.module('admin-projects').controller('AdminProjectsCtrl', ['$scope', '$location', 'projects', function ($scope, $location, projects) {

  $scope.projects = projects;

  $scope.itemView = function (item) {
    $location.path('/admin/projects/' + item.$id());
  };
}]);

angular.module('admin-projects').controller('AdminProjectEditCtrl', ['$scope', '$location', 'CRUDScopeMixIn', 'users', 'project', function ($scope, $location, CRUDScopeMixIn, users, project) {

  $scope.selTeamMember = undefined;

  $scope.users = users;
  //prepare users lookup, just keep refferences for easier lookup
  $scope.usersLookup = {};
  angular.forEach(users, function(value, key){
    $scope.usersLookup[value.$id()] = value;
  });

  angular.extend($scope, new CRUDScopeMixIn('item', project, 'form', function () {
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