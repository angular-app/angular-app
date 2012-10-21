angular.module('services.exceptionHandler', ['services.notifications', 'services.localizedMessages'], ['$provide', function($provide) {

  $provide.decorator('$exceptionHandler',  ['$injector', '$delegate', 'localizedMessages', function ($injector, $delegate, localizedMessages) {

    return function (exception, cause) {
      //need to get the notications service from injector due to circular dependencies:
      //Circular dependency: $rootScope <- notifications <- $exceptionHandler
      $delegate(exception, cause);
      $injector.get('notifications').pushForCurrentRoute(localizedMessages.get('error.fatal'), 'error', {
        exception:exception,
        cause:cause
      });
    };
  }])
}]);
