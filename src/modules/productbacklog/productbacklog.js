angular.module('productbacklog', ['services.productbacklog', 'services.crud'], ['$routeProvider', function($routeProvider){
  $routeProvider.when('/productbacklog/:projectId', {
    templateUrl:'productbacklog/partials/productbacklog-list.tpl.html',
    controller:'ProductBacklogCtrl',
    resolve:{
      backlog:['ProductBacklog', '$route', function (ProductBacklog, $route) {
        return ProductBacklog.forProject($route.current.params.projectId);
      }],
      projectId:['$route', function($route){
        return $route.current.params.projectId;
      }]
    }
  });

  $routeProvider.when('/productbacklog/:projectId/new', {
    templateUrl:'productbacklog/partials/productbacklog-edit.tpl.html',
    controller:'ProductBacklogEditCtrl',
    resolve:{
      backlogItem:['ProductBacklog', '$route', function (ProductBacklog, $route) {
        return new ProductBacklog({
          projectId:$route.current.params.projectId
        });
      }],
      projectId:['$route', function ($route) {
        return $route.current.params.projectId;
      }]
    }
  });

  $routeProvider.when('/productbacklog/:projectId/:backlogItemId', {
    templateUrl:'productbacklog/partials/productbacklog-edit.tpl.html',
    controller:'ProductBacklogEditCtrl',
    resolve:{
      backlogItem:['ProductBacklog', '$route', function (ProductBacklog, $route) {
        return ProductBacklog.getById($route.current.params.backlogItemId);
      }],
      projectId:['$route', function($route){
        return $route.current.params.projectId;
      }]
    }
  });
}]);

angular.module('productbacklog').controller('ProductBacklogCtrl', ['$scope', '$location', 'projectId', 'backlog', function($scope, $location, projectId, backlog){
  $scope.backlog = backlog;

  $scope.newBacklogItem = function () {
    $location.path('/productbacklog/'+projectId+'/new');
  };

  $scope.showBacklogItem = function (backlogItemId) {
    $location.path('/productbacklog/'+projectId+'/'+backlogItemId);
  };
}]);

angular.module('productbacklog').controller('ProductBacklogEditCtrl', ['$scope', '$location', 'CRUDScopeMixIn', 'projectId', 'backlogItem', function($scope, $location, CRUDScopeMixIn, projectId, backlogItem){

  angular.extend($scope, new CRUDScopeMixIn('item', backlogItem, 'form', function () {
    $location.path('/productbacklog/'+projectId);
  }, function () {
    $scope.updateError = true;
  }));
}]);