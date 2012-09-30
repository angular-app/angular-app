angular.module('services.tasks', ['mongolabResource']);
angular.module('services.tasks').factory('Tasks', ['mongolabResource', function (mongolabResource) {

  var Tasks = mongolabResource('tasks');

  Tasks.forSprint = function (sprintId) {
    return Tasks.query({sprintId:sprintId});
  };

  Tasks.forUser = function (userId) {
    return Tasks.query({userId:userId});
  };

  return Tasks;
}]);