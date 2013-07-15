angular.module('projects', ['resources.projects', 'productbacklog', 'sprints', 'security.authorization'])

.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
  $routeProvider.when('/projects', {
    templateUrl:'projects/projects-list.tpl.html',
    controller:'ProjectsViewCtrl',
    resolve:{
      projects:['Projects', function (Projects) {
        //TODO: fetch only for the current user
        return Projects.all();
      }],
      authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
    }
  });
}])

.controller('ProjectsViewCtrl', ['$scope', '$location', 'projects', function ($scope, $location, projects) {
  $scope.projects = projects;

  $scope.viewProject = function (projectId) {
    $location.path('/projects/'+projectId);
  };

  $scope.manageBacklog = function (projectId) {
    $location.path('/projects/'+projectId+'/productbacklog');
  };

  $scope.manageSprints = function (projectId) {
    $location.path('/projects/'+projectId+'/sprints');
  };
}]);
