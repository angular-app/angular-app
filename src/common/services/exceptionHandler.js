angular.module('services.exceptionHandler', ['services.notifications', 'services.localizedMessages']);
angular.module('services.exceptionHandler').factory('$exceptionHandler', ['$injector', 'localizedMessages', function ($injector, localizedMessages) {

  return function (exception, cause) {
    //need to get the notications service from injector due to circular dependencies:
    //Circular dependency: $rootScope <- notifications <- $exceptionHandler
    $injector.get('notifications').pushForCurrentRoute(localizedMessages.get('error.fatal'), 'error', {
      exception:exception,
      cause:cause
    });
  };
}]);