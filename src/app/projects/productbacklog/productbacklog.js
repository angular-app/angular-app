angular.module('productbacklog', ['services.productbacklog', 'services.crud']);
angular.module('productbacklog').config(['$routeProvider', function($routeProvider){

  var projectId = ['$route', function($route) {
    return $route.current.params.projectId;
  }];

  $routeProvider.when('/projects/:projectId/productbacklog', {
    templateUrl:'projects/productbacklog/productbacklog-list.tpl.html',
    controller:'ProductBacklogListCtrl',
    resolve : {
      projectId: projectId,
      backlog : ['$route', 'ProductBacklog', function($route, ProductBacklog){
        return ProductBacklog.forProject($route.current.params.projectId);
      }]
    }
  });
  $routeProvider.when('/projects/:projectId/productbacklog/new', {
    templateUrl:'projects/productbacklog/productbacklog-edit.tpl.html',
    controller:'ProductBacklogEditCtrl',
    resolve : {
      projectId: projectId,
      backlogItem : ['$route', 'ProductBacklog', function($route, ProductBacklog){
        return new ProductBacklog({projectId:$route.current.params.projectId});
      }]
    }
  });
  $routeProvider.when('/projects/:projectId/productbacklog/:backlogItemId', {
    templateUrl:'projects/productbacklog/productbacklog-edit.tpl.html',
    controller:'ProductBacklogEditCtrl',
    resolve : {
      projectId: projectId,
      backlogItem : ['$route', 'ProductBacklog', function($route, ProductBacklog){
        return ProductBacklog.getById($route.current.params.backlogItemId);
      }]
    }
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