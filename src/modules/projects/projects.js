angular.module('projects', [], ['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/projects/:projectId', {
    templateUrl:'projects/partials/project.tpl.html',
    controller:'ProjectController',
    resolve:{
      project:['$route', 'Projects', function ($route, Projects) {
        return Projects.getById($route.current.params.projectId);
      }]
    }
  });
}]);

angular.module('projects').controller('ProjectController', ['$scope', '$location', 'project', function ($scope, $location, project) {
  $scope.project = project;

  $scope.manageBacklog = function (projectId) {
    $location.path('/productbacklog/'+projectId);
  };
}]);