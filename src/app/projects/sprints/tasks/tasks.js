angular.module('tasks', ['services.tasks', 'services.crud']);
angular.module('tasks').config(['$routeProvider', 'routeCRUDProvider', function ($routeProvider, routeCRUDProvider) {

  $routeProvider.when('/projects/:projectId/sprints/:sprintId/tasks', {
    templateUrl:'projects/sprints/tasks/tasks-list.tpl.html',
    controller:'TasksListCtrl',
    resolve:{
      tasks:['Tasks', '$route', function (Tasks, $route) {
        return Tasks.forSprint($route.current.params.sprintId);
      }]
    }
  });

  $routeProvider.when('/projects/:projectId/sprints/:sprintId/tasks/new', {
    templateUrl:'projects/sprints/tasks/tasks-edit.tpl.html',
    controller:'TasksEditCtrl',
    resolve:{
      task:['Tasks', '$route', function (Tasks, $route) {
        return new Tasks({
          projectId:$route.current.params.projectId,
          sprintId:$route.current.params.sprintId,
          state:Tasks.statesEnum[0]
        });
      }],
      sprintBacklogItems:['Sprints', 'ProductBacklog', '$route', function (Sprints, ProductBacklog, $route) {
        var sprintPromise = Sprints.getById($route.current.params.sprintId);
        return sprintPromise.then(function (sprint) {
          return ProductBacklog.getByIds(sprint.sprintBacklog);
        });
      }],
      teamMembers:['Projects', 'Users', '$route', function (Projects, Users, $route) {
        var projectPromise = Projects.getById($route.current.params.projectId);
        return projectPromise.then(function(project){
           return Users.getByIds(project.teamMembers);
        });
      }]
    }
  });
}]);

angular.module('tasks').controller('TasksListCtrl', ['$scope', '$location', '$route', 'tasks', function ($scope, $location, $route, tasks) {
  $scope.tasks = tasks;

  $scope['new'] = function () {
    var projectId = $route.current.params.projectId;
    var sprintId = $route.current.params.sprintId;
    $location.path('/projects/' + projectId + '/sprints/' + sprintId + '/tasks/new');
  };
}]);

angular.module('tasks').controller('TasksEditCtrl', ['$scope', '$location', '$route', 'crudMethods', 'Tasks', 'sprintBacklogItems', 'teamMembers', 'task', function ($scope, $location, $route, crudMethods, Tasks, sprintBacklogItems, teamMembers, task) {
  $scope.task = task;
  $scope.statesEnum = Tasks.statesEnum;
  $scope.sprintBacklogItems = sprintBacklogItems;
  $scope.teamMembers = teamMembers;

  angular.extend($scope, crudMethods('task', task, 'form', function () {
    $location.path('/admin/users');
  }, function() {
    $scope.updateError = true;
  }));
}]);