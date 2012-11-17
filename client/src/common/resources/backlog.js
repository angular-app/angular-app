angular.module('resources.productbacklog', ['mongolabResource']);
angular.module('resources.productbacklog').factory('ProductBacklog', ['mongolabResource', function (mongolabResource) {
  var ProductBacklog = mongolabResource('productbacklog');

  ProductBacklog.forProject = function (projectId) {
    return ProductBacklog.query({projectId:projectId});
  };

  return ProductBacklog;
}]);
