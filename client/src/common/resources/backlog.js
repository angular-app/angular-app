angular.module('resources.productbacklog', ['mongolabResourceHttp']);
angular.module('resources.productbacklog').factory('ProductBacklog', ['$mongolabResourceHttp', function ($mongolabResourceHttp) {
  var ProductBacklog = $mongolabResourceHttp('productbacklog');

  ProductBacklog.forProject = function (projectId) {
    return ProductBacklog.query({projectId:projectId});
  };

  return ProductBacklog;
}]);
