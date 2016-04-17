angular.module('resources.sprints', ['mongolabResourceHttp']);
angular.module('resources.sprints').factory('Sprints', ['$mongolabResourceHttp', function ($mongolabResourceHttp) {

  var Sprints = $mongolabResourceHttp('sprints');
  Sprints.forProject = function (projectId) {
    return Sprints.query({projectId:projectId});
  };
  return Sprints;
}]);