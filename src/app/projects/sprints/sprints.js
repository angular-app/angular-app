angular.module('sprints', ['resources.sprints', 'services.crud', 'tasks']);
angular.module('sprints').config(['$routeProvider', function($routeProvider){

  var projectId = ['$route', function($route) {
    return $route.current.params.projectId;
  }];

  var productBacklog = ['$route', 'ProductBacklog', function ($route, ProductBacklog) {
    return ProductBacklog.forProject($route.current.params.projectId);
  }];

  $routeProvider.when('/projects/:projectId/sprints', {
    templateUrl : 'projects/sprints/sprints-list.tpl.html',
    controller: 'SprintsListCtrl',
    resolve: {
      projectId: projectId,
      sprints: ['$route', 'Sprints', function($route, Sprints){
        return Sprints.forProject($route.current.params.projectId);
      }]
    }
  });
  $routeProvider.when('/projects/:projectId/sprints/new', {
    templateUrl : 'projects/sprints/sprints-edit.tpl.html',
    controller: 'SprintsEditCtrl',
    resolve: {
      projectId: projectId,
      sprint: ['$route', 'Sprints', function($route, Sprints){
        return new Sprints({projectId:$route.current.params.projectId});
      }],
      productBacklog : productBacklog
    }
  });
  $routeProvider.when('/projects/:projectId/sprints/:sprintId', {
    templateUrl : 'projects/sprints/sprints-edit.tpl.html',
    controller: 'SprintsEditCtrl',
    resolve: {
      projectId: projectId,
      sprint: ['$route', 'Sprints', function($route, Sprints){
        return Sprints.getById($route.current.params.sprintId);
      }],
      productBacklog : productBacklog
    }
  });
}]);

angular.module('sprints').controller('SprintsListCtrl', ['$scope', '$location', 'crudListMethods', 'projectId', 'sprints', function($scope, $location, crudListMethods, projectId, sprints){
  $scope.sprints = sprints;

  angular.extend($scope, crudListMethods('/projects/'+projectId+'/sprints'));

  $scope.tasks = function (sprint) {
    $location.path('/projects/'+projectId+'/sprints/'+sprint.$id()+'/tasks');
  };
}]);

angular.module('sprints').controller('SprintsEditCtrl', ['$scope', '$location', 'crudEditMethods', 'projectId', 'sprint', 'productBacklog', function($scope, $location, crudEditMethods, projectId, sprint, productBacklog){

  $scope.productBacklog = productBacklog;
  angular.extend($scope, crudEditMethods('sprint', sprint, 'form', function () {
    $location.path('/projects/'+projectId+'/sprints');
  }, function () {
    $scope.updateError = true;
  }));
  $scope.sprint.sprintBacklog = $scope.sprint.sprintBacklog || [];

  $scope.productBacklogLookup = {};
  angular.forEach($scope.productBacklog, function (productBacklogItem) {
    $scope.productBacklogLookup[productBacklogItem.$id()] = productBacklogItem;
  });

  $scope.viewProductBacklogItem = function (productBacklogItemId) {
    $location.path('/projects/'+projectId+'/productbacklog/'+productBacklogItemId);
  };

  $scope.addBacklogItem = function (backlogItem) {
    $scope.sprint.sprintBacklog.push(backlogItem.$id());
  };

  $scope.removeBacklogItem = function (backlogItemId) {
    $scope.sprint.sprintBacklog.splice($scope.sprint.sprintBacklog.indexOf(backlogItemId),1);
  };

  $scope.estimationInTotal = function () {
    var totalEstimation = 0;
    angular.forEach(sprint.sprintBacklog, function (backlogItemId) {
      totalEstimation += $scope.productBacklogLookup[backlogItemId].estimation;
    });
    return totalEstimation;
  };

  $scope.notSelected = function (productBacklogItem) {
    return $scope.sprint.sprintBacklog.indexOf(productBacklogItem.$id())===-1;
  };
}]);