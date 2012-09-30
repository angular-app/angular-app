angular.module('sprints', ['services.sprints', 'services.crud']);
angular.module('sprints').config(['$routeProvider', 'routeCRUDProvider', function($routeProvider, routeCRUDProvider){

  var getProjectId = function(Sprints, ProductBacklog, $route) {
    return $route.current.params.projectId;
  };

  var getSprints = function (Sprints, ProductBacklog, $route) {
    return Sprints.forProject($route.current.params.projectId);
  };

  var newSprint = function (Sprints, ProductBacklog, $route) {
    return new Sprints({projectId:$route.current.params.projectId});
  };

  var getSprint = function (Sprints, ProductBacklog, $route) {
    return Sprints.getById($route.current.params.itemId);
  };

  var getBacklog = function (Sprints, ProductBacklog, $route) {
    return ProductBacklog.forProject($route.current.params.projectId);
  };

  routeCRUDProvider.defineRoutes($routeProvider, '/projects/:projectId/sprints', 'projects/sprints', 'Sprints', ['ProductBacklog'], {
    listItems:{sprints:getSprints, projectId:getProjectId},
    newItem:{sprint:newSprint, projectId:getProjectId, productBacklog:getBacklog},
    editItem:{sprint:getSprint, projectId:getProjectId, productBacklog:getBacklog}
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

angular.module('sprints').controller('SprintsEditCtrl', ['$scope', '$location', 'crudMethods', 'projectId', 'sprint', 'productBacklog', function($scope, $location, crudMethods, projectId, sprint, productBacklog){

  $scope.productBacklog = productBacklog;
  angular.extend($scope, crudMethods('sprint', sprint, 'form', function () {
    $location.path('/projects/'+projectId+'/sprints');
  }, function () {
    $scope.updateError = true;
  }));
}]);