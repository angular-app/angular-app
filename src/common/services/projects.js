angular.module('services.projects', ['mongolabResource']);
angular.module('services.projects').factory('Projects', ['mongolabResource', function ($mongolabResource) {

  var Projects = $mongolabResource('projects');

  //TODO: actually this query should be done more on the server side...
  Projects.forUser = function(userId, successcb, errorcb) {
    return Projects.query({}, successcb, errorcb);
  };

  Projects.prototype.isProductOwner = function (userId) {
    return this.productOwner === userId;
  };
  Projects.prototype.canActAsProductOwner = function (userId) {
    return !this.isScrumMaster(userId) && !this.isDevTeamMember(userId);
  };
  Projects.prototype.isScrumMaster = function (userId) {
    return this.scrumMaster === userId;
  };
  Projects.prototype.canActAsScrumMaster = function (userId) {
    return !this.isProductOwner(userId);
  };
  Projects.prototype.isDevTeamMember = function (userId) {
    return this.teamMembers.indexOf(userId) >= 0;
  };
  Projects.prototype.canActAsDevTeamMember = function (userId) {
    return !this.isProductOwner(userId);
  };

  return Projects;
}]);