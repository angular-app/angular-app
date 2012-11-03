angular.module('tasks', ['resources.tasks', 'services.crud']);
angular.module('tasks').config(['$routeProvider', function ($routeProvider) {

  var sprintBacklogItems = ['Sprints', 'ProductBacklog', '$route', function (Sprints, ProductBacklog, $route) {
    var sprintPromise = Sprints.getById($route.current.params.sprintId);
    return sprintPromise.then(function (sprint) {
      return ProductBacklog.getByIds(sprint.sprintBacklog);
    });
  }];

  var teamMembers = ['Projects', 'Users', '$route', function (Projects, Users, $route) {
    var projectPromise = Projects.getById($route.current.params.projectId);
    return projectPromise.then(function(project){
      return Users.getByIds(project.teamMembers);
    });
  }];

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
      sprintBacklogItems:sprintBacklogItems,
      teamMembers:teamMembers
    }
  });

  $routeProvider.when('/projects/:projectId/sprints/:sprintId/tasks/:taskId', {
    templateUrl:'projects/sprints/tasks/tasks-edit.tpl.html',
    controller:'TasksEditCtrl',
    resolve:{
      task:['Tasks', '$route', function (Tasks, $route) {
        return Tasks.getById($route.current.params.taskId);
      }],
      sprintBacklogItems:sprintBacklogItems,
      teamMembers:teamMembers
    }
  });
}]);

angular.module('tasks').controller('TasksListCtrl', ['$scope', 'crudListMethods', '$route', 'tasks', function ($scope, crudListMethods, $route, tasks) {
  $scope.tasks = tasks;

  var projectId = $route.current.params.projectId;
  var sprintId = $route.current.params.sprintId;
  angular.extend($scope, crudListMethods('/projects/' + projectId + '/sprints/' + sprintId + '/tasks'));
}]);

angular.module('tasks').controller('TasksEditCtrl', ['$scope', '$location', '$route', 'crudEditMethods', 'Tasks', 'sprintBacklogItems', 'teamMembers', 'task', function ($scope, $location, $route, crudEditMethods, Tasks, sprintBacklogItems, teamMembers, task) {
  $scope.task = task;
  $scope.statesEnum = Tasks.statesEnum;
  $scope.sprintBacklogItems = sprintBacklogItems;
  $scope.teamMembers = teamMembers;

  angular.extend($scope, crudEditMethods('task', task, 'form', function () {
    $location.path('/admin/users');
  }, function() {
    $scope.updateError = true;
  }));
}]);