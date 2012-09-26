angular.module('services.users', ['mongolabResource']);
angular.module('services.users').factory('Users', ['mongolabResource', function (mongoResource) {

  var userResource = mongoResource('users');
  userResource.prototype.getFullName = function () {
    return this.lastName + " " + this.firstName + " (" + this.email + ")";
  };

  return userResource;
}]);
angular.module('services.users').factory('Security', ['Users', function (Users) {

  var securityService = {};
  securityService.authenticate = function (email, password, successcb, errorcb) {
    securityService.signOut();
    Users.query({email:email}, function (result) {
      if (angular.isArray(result) && result.length === 1) {
        securityService.user = result[0];
        successcb(this.user);
      } else {
        errorcb();
      }
    }, function (result) {
      errorcb();
    });
  };

  securityService.signOut = function () {
    securityService.user = undefined;
  };

  securityService.isAuthenticated = function () {
    return angular.isDefined(securityService.user);
  };

  securityService.getUser = function () {
    return securityService.user;
  };

  return securityService;
}]);