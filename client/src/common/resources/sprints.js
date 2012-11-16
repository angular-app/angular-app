angular.module('resources.sprints', ['mongolabResource']);
angular.module('resources.sprints').factory('Sprints', ['mongolabResource', function (mongolabResource) {

  var Sprints = mongolabResource('sprints');
  Sprints.forProject = function (projectId) {
    return Sprints.query({projectId:projectId});
  };
  return Sprints;
}]);