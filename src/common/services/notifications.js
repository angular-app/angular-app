angular.module('services.notifications', []).factory('notifications', function ($rootScope) {

  var notifications = {
    'GLOBAL' : [],
    'ROUTE' : [],
    'NEXT_ROUTE' : []
  };
  var notificationsService = {};

  var clearMixIn = function(notification) {
    //TODO: do it better, without creating new function instances each time...
    notification.$clear = function() {
      notificationsService.clear(this);
    };
    return notification;
  };

  $rootScope.$on('$routeChangeSuccess', function () {
    notifications.ROUTE.length = 0;

    notifications.ROUTE = angular.copy(notifications.NEXT_ROUTE);
    notifications.NEXT_ROUTE.length = 0;
  });

  notificationsService.get = function(){
    return [].concat(notifications.GLOBAL).concat(notifications.ROUTE);
  };

  notificationsService.clear = function(notification){
    angular.forEach(notifications, function (notificationsByType) {
      var idx = notificationsByType.indexOf(notification);
      if (idx>-1){
        notificationsByType.splice(idx,1);
      }
    });
  };

  notificationsService.clearAll = function(){
    angular.forEach(notifications, function (notificationsByType) {
      notificationsByType.length = 0;
    });
  };

  notificationsService.addFixed = function(notification) {
    notifications.GLOBAL.push(clearMixIn(notification));
  };

  notificationsService.addRouteChange = function(notification) {
    notifications.ROUTE.push(clearMixIn(notification));
  };

  notificationsService.addNextRouteChange = function(notification) {
    notifications.NEXT_ROUTE.push(clearMixIn(notification));
  };

  return notificationsService;
});