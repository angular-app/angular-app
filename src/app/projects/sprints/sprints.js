angular.module('sprints', ['services.sprints', 'services.crud']);
angular.module('sprints').config(['$routeProvider', 'routeCRUDProvider', function($routeProvider, routeCRUDProvider){

  var getProjectId = function(Sprints, $route) {
    return $route.current.params.projectId;
  };

  var getSprints = function (Sprints, $route) {
    return Sprints.forProject($route.current.params.projectId);
  };

  var newSprint = function (Sprints, $route) {
    return new Sprints({projectId:$route.current.params.projectId});
  };

  var getSprint = function (Sprints, $route) {
    return Sprints.getById($route.current.params.itemId);
  };

  routeCRUDProvider.defineRoutes($routeProvider, '/projects/:projectId/sprints', 'projects/sprints', 'Sprints', [], {
    listItems:{'sprints':getSprints, 'projectId':getProjectId},
    newItem:{'sprint':newSprint, 'projectId':getProjectId},
    editItem:{'sprint':getSprint, 'projectId':getProjectId}
  }, {
    editItem:{
      itemId : function(locals){
        return locals.sprint.name;
      }
    }
  });
}]);

angular.module('sprints').controller('SprintsListCtrl', ['$scope', '$location', 'projectId', 'sprints', function($scope, $location, projectId, sprints){
  $scope.sprints = sprints;

  $scope['new'] = function(){
    $location.path('/projects/'+projectId+'/sprints/new');
  };

  $scope.edit = function (id) {
    $location.path('/projects/'+projectId+'/sprints/'+id);
  };
}]);

angular.module('sprints').controller('SprintsEditCtrl', ['$scope', '$location', 'crudMethods', 'projectId', 'sprint', function($scope, $location, crudMethods, projectId, sprint){

  angular.extend($scope, crudMethods('sprint', sprint, 'form', function () {
    $location.path('/projects/'+projectId+'/sprints');
  }, function () {
    $scope.updateError = true;
  }));
}]);