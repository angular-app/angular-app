angular.module('tasks', ['services.tasks', 'services.crud']);
angular.module('tasks').config(['$routeProvider', 'routeCRUDProvider', function($routeProvider, routeCRUDProvider){

  var getProjectId = function(Tasks, $route) {
    return $route.current.params.projectId;
  };

  var getSprintId = function(Tasks, $route) {
    return $route.current.params.sprintId;
  };

  var getTasks = function (Tasks, $route) {
    return Tasks.forSprint($route.current.params.sprintId);
  };

  var newTask = function (Tasks, $route) {
    return new Tasks({sprintId:$route.current.params.sprintId});
  };

  var getTask = function (Tasks, $route) {
    return Tasks.getById($route.current.params.itemId);
  };

  routeCRUDProvider.defineRoutes($routeProvider, '/projects/:projectId/sprints', 'projects/sprints', 'Sprints', [], {
    listItems:{sprints:getTasks, projectId:getProjectId, sprintId:getSprintId},
    newItem:{sprint:newTask, projectId:getProjectId, sprintId:getSprintId},
    editItem:{sprint:getTask, projectId:getProjectId, sprintId:getSprintId}
  }, {
    editItem:{
      itemId : function(locals){
        return locals.task.name;
      }
    }
  });
}]);

angular.module('tasks').controller('SprintsListCtrl', ['$scope', '$location', 'projectId', 'sprintId', 'tasks',function($scope, $location, projectId, sprintId, tasks){
  $scope.sprints = sprints;

  $scope['new'] = function(){
    $location.path('/projects/'+projectId+'/sprints/new');
  };

  $scope.edit = function (id) {
    $location.path('/projects/'+projectId+'/sprints/'+id);
  };
}]);

angular.module('tasks').controller('SprintsEditCtrl', ['$scope', '$location', 'crudMethods', 'projectId', 'sprintId', 'task', function($scope, $location, crudMethods, projectId, sprint, task){

  angular.extend($scope, crudMethods('sprint', sprint, 'form', function () {
    $location.path('/projects/'+projectId+'/sprints');
  }, function () {
    $scope.updateError = true;
  }));
}]);