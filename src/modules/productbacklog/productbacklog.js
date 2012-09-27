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

  routeCRUDProvider.defineRoutes($routeProvider, '/productbacklog/:projectId', 'productbacklog', 'ProductBacklog', ['ProductBacklog', '$route'], {
    listItems:{'backlog':getBacklog, 'projectId':getProjectId},
    newItem:{'backlogItem':newBacklogItem, 'projectId':getProjectId},
    editItem:{'backlogItem':getBacklogItem, 'projectId':getProjectId}
  });
}]);

angular.module('productbacklog').controller('ProductBacklogListCtrl', ['$scope', '$location', 'projectId', 'backlog', function($scope, $location, projectId, backlog){
  $scope.backlog = backlog;

  $scope.newBacklogItem = function () {
    $location.path('/productbacklog/'+projectId+'/new');
  };

  $scope.showBacklogItem = function (backlogItemId) {
    $location.path('/productbacklog/'+projectId+'/'+backlogItemId);
  };
}]);

angular.module('productbacklog').controller('ProductBacklogEditCtrl', ['$scope', '$location', 'crudScopeMixIn', 'projectId', 'backlogItem', function($scope, $location, crudScopeMixIn, projectId, backlogItem){

  angular.extend($scope, crudScopeMixIn('item', backlogItem, 'form', function () {
    $location.path('/productbacklog/'+projectId);
  }, function () {
    $scope.updateError = true;
  }));
}]);