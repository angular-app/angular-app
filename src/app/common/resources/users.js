angular.module('services.users', ['mongolabResource']);
angular.module('services.users').factory('Users', ['mongolabResource', function (mongoResource) {

  var userResource = mongoResource('users');
  userResource.prototype.getFullName = function () {
    return this.lastName + " " + this.firstName + " (" + this.email + ")";
  };

  return userResource;
}]);
