angular.module('services.productbacklog', ['mongolabResource']);
angular.module('services.productbacklog').factory('ProductBacklog', ['mongolabResource', function (mongolabResource) {
  var ProductBacklog = mongolabResource('productbacklog');

  ProductBacklog.forProject = function (projectId) {
    return ProductBacklog.query({projectId:projectId});
  };

  return ProductBacklog;
}]);
