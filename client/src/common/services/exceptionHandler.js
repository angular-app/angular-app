angular.module('services.exceptionHandler', ['services.i18nNotifications']);

angular.module('services.exceptionHandler').factory('exceptionHandlerFactory', ['$injector', function($injector) {
  return function($delegate) {

    return function (exception, cause) {
      // Lazy load notifications to get around circular dependency
      //Circular dependency: $rootScope <- notifications <- i18nNotifications <- $exceptionHandler
      var i18nNotifications = $injector.get('i18nNotifications');

      // Pass through to original handler
      $delegate(exception, cause);

      // Push a notification error
      i18nNotifications.pushForCurrentRoute('error.fatal', 'error', {}, {
        exception:exception,
        cause:cause
      });
    };
  };
}]);

angular.module('services.exceptionHandler').config(['$provide', function($provide) {
  $provide.decorator('$exceptionHandler', ['$delegate', 'exceptionHandlerFactory', function ($delegate, exceptionHandlerFactory) {
    return exceptionHandlerFactory($delegate);
  }]);
}]);
