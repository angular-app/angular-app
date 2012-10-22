angular.module('services.exceptionHandler', ['services.notifications', 'services.localizedMessages']);

angular.module('services.exceptionHandler').factory('exceptionHandlerFactory', ['$injector', 'localizedMessages', function($injector, localizedMessages) {
  return function($delegate) {
    var notifications;
    return function (exception, cause) {
      // Lazy load notifications to get around circular dependency
      //Circular dependency: $rootScope <- notifications <- $exceptionHandler
      var notifications = notifications || $injector.get('notifications');

      // Pass through to original handler
      $delegate(exception, cause);

      // Push a notification error
      notifications.pushForCurrentRoute(localizedMessages.get('error.fatal'), 'error', {
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
