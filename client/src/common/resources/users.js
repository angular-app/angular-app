angular.module('resources.users', ['mongolabResourceHttp']);
angular.module('resources.users').factory('Users', ['$mongolabResourceHttp', function ($mongolabResourceHttp) {

  var userResource = $mongolabResourceHttp('users');
  userResource.prototype.getFullName = function () {
    return this.lastName + " " + this.firstName + " (" + this.email + ")";
  };

  return userResource;
}]);
