angular.module('services.notifications', []).factory('notifications', function ($rootScope) {

  var notifications = {
    'GLOBAL' : [],
    'ROUTE' : [],
    'NEXT_ROUTE' : []
  };
  var notificationsService = {};

  $rootScope.$on('$routeChangeSuccess', function () {
    notifications.ROUTE.length = 0;

    notifications.ROUTE = angular.copy(notifications.NEXT_ROUTE);
    notifications.NEXT_ROUTE.length = 0;
  });

  notificationsService.all = function(){
    return [].concat(notifications.GLOBAL).concat(notifications.ROUTE);
  };

  notificationsService.remove = function(notification){
    angular.forEach(notifications, function (notificationsByType) {
      var idx = notificationsByType.indexOf(notification);
      if (idx>-1){
        notificationsByType.splice(idx,1);
      }
    });
  };

  notificationsService.removeAll = function(){
    angular.forEach(notifications, function (notificationsByType) {
      notificationsByType.length = 0;
    });
  };

  notificationsService.pushGlobal = function(notification) {
    notifications.GLOBAL.push(notification);
  };

  notificationsService.pushRouteChange = function(notification) {
    notifications.ROUTE.push(notification);
  };

  notificationsService.pushNextRouteChange = function(notification) {
    notifications.NEXT_ROUTE.push(notification);
  };

  return notificationsService;
});