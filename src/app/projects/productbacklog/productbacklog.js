angular.module('productbacklog', ['resources.productbacklog', 'services.crud']);
angular.module('productbacklog').config(['crudRouteProvider', function(crudRouteProvider){

  var projectId = ['$route', function($route) {
    return $route.current.params.projectId;
  }];

  crudRouteProvider.routesFor('ProductBacklog', 'projects', 'projects/:projectId')

  .whenList({
    projectId: projectId,
    backlog : ['$route', 'ProductBacklog', function($route, ProductBacklog){
      return ProductBacklog.forProject($route.current.params.projectId);
    }]
  })

  .whenNew({
    projectId: projectId,
    backlogItem : ['$route', 'ProductBacklog', function($route, ProductBacklog){
      return new ProductBacklog({projectId:$route.current.params.projectId});
    }]
  })

  .whenEdit({
    projectId: projectId,
    backlogItem : ['$route', 'ProductBacklog', function($route, ProductBacklog){
      return ProductBacklog.getById($route.current.params.itemId);
    }]
  });
}]);

angular.module('productbacklog').controller('ProductBacklogListCtrl', ['$scope', 'crudListMethods', 'projectId', 'backlog', function($scope, crudListMethods, projectId, backlog){
  $scope.backlog = backlog;

  angular.extend($scope, crudListMethods('/projects/'+projectId+'/productbacklog'));
}]);

angular.module('productbacklog').controller('ProductBacklogEditCtrl', ['$scope', '$location', 'crudEditMethods', 'projectId', 'backlogItem', function($scope, $location, crudEditMethods, projectId, backlogItem){

  angular.extend($scope, crudEditMethods('item', backlogItem, 'form', function () {
    $location.path('/projects/'+projectId+'/productbacklog');
  }, function () {
    $scope.updateError = true;
  }));
}]);