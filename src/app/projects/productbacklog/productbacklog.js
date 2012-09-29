angular.module('productbacklog', ['services.productbacklog', 'services.crud']);
angular.module('productbacklog').config(['$routeProvider', 'routeCRUDProvider', function($routeProvider, routeCRUDProvider){

  var getProjectId = function(ProductBacklog, $route) {
    return $route.current.params.projectId;
  };

  var getBacklog = function (ProductBacklog, $route) {
    return ProductBacklog.forProject($route.current.params.projectId);
  };

  var newBacklogItem = function (ProductBacklog, $route) {
    return new ProductBacklog({projectId:$route.current.params.projectId});
  };

  var getBacklogItem = function (ProductBacklog, $route) {
    return ProductBacklog.getById($route.current.params.itemId);
  };

  routeCRUDProvider.defineRoutes($routeProvider, '/projects/:projectId/productbacklog', 'projects/productbacklog', 'ProductBacklog', [], {
    listItems:{'backlog':getBacklog, 'projectId':getProjectId},
    newItem:{'backlogItem':newBacklogItem, 'projectId':getProjectId},
    editItem:{'backlogItem':getBacklogItem, 'projectId':getProjectId}
  }, {
    editItem:{
      itemId:function (locals) {
        return locals.backlogItem.name;
      }
    }
  });
}]);

angular.module('productbacklog').controller('ProductBacklogListCtrl', ['$scope', '$location', 'projectId', 'backlog', function($scope, $location, projectId, backlog){
  $scope.backlog = backlog;

  $scope.newBacklogItem = function () {
    $location.path('/projects/'+projectId+'/productbacklog/new');
  };

  $scope.showBacklogItem = function (backlogItemId) {
    $location.path('/projects/'+projectId+'/productbacklog/'+backlogItemId);
  };
}]);

angular.module('productbacklog').controller('ProductBacklogEditCtrl', ['$scope', '$location', 'crudMethods', 'projectId', 'backlogItem', function($scope, $location, crudMethods, projectId, backlogItem){

  angular.extend($scope, crudMethods('item', backlogItem, 'form', function () {
    $location.path('/projects/'+projectId+'/productbacklog');
  }, function () {
    $scope.updateError = true;
  }));
}]);