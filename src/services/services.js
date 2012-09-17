angular.module('services.users', ['mongolabResource']);
angular.module('services.users').factory('Users', ['$mongolabResource', function ($mongolabResource) {

  var userResource = $mongolabResource('users');
  userResource.prototype.getFullName = function () {
    return this.lastName + " " + this.firstName + " (" + this.login + ")";
  };

  return userResource;
}]);
angular.module('services.users').factory('Security', ['Users', function (Users) {

  var securityService = {};
  securityService.authenticate = function (login, password, successcb, errorcb) {
    securityService.signOut();
    Users.query({login:login}, function (result) {
      if (angular.isArray(result) && result.length === 1) {
        console.log(result[0]);
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

angular.module('services.projects', ['mongolabResource']);
angular.module('services.projects').factory('Projects', ['$mongolabResource', function ($mongolabResource) {
  return $mongolabResource('projects');
}]);