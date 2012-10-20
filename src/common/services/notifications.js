angular.module('services.notifications', []);

angular.module('services.notifications').factory('notifications', function ($rootScope) {

  // A factory to create a notification list object that manages its own notifications
  var createNotificationList = function() {
    var list = [];

    var notificationList = {
      // Create a new notification with a string message and optional type (defaults to 'info').
      // The options can be used to attach custom fields to the notification
      // The notification will contain a remove method that can be used to remove itself from the list
      createNotification: function(message, type, options) {
        var notification = {
          message: message,
          type: type || 'info',
          remove: function() {
            notificationList.remove(notification);
          }
        };
        return angular.extend(notification, options);
      },

      // Remove a notification from this list that is matched by the matchNotificationFn function.
      remove: function(matchNotificationFn) {
        angular.forEach(list, function(notification, index) {
          if ( matchNotificationFn(notification) ) {
            list.splice(index, 1);
          }
        });
      },

      // Remove all the notifications from this list
      removeAll: function() {
        list.length = 0;
      },

      // Push a notification to the end of this list
      push: function(notification) {
        list.push(notification);
      },

      // Access the notifications in this list
      getAll: function() {
        return list;
      }
    };

    return notificationList;
  };


  var notificationLists = {};
  var includeInCurrent = [];
  var notificationsService = {
    // Returns a concatenated array of all the notifications from all the lists in the service
    all: function() {
      var notifications = [];
      angular.forEach(notificationLists, function(list) {
        notifications = notifications.concat(list.getAll());
      });
      return notifications;
    },

    current: function() {
      var notifications = [];
      angular.forEach(includeInCurrent, function(listName) {
        notifications = notifications.concat(notificationLists[listName].getAll());
      });
      return notifications;
    },

    // Remove a notification from the lists of the service, matching it either by the object itself or by the message string
    remove: function(messageOrNotification) {
      var matchFn;
      if ( angular.isString(messageOrNotification) ) {
        matchFn = function(notification) { return notification.message === messageOrNotification; };
      } else {
        matchFn = function(notification) { return notification === messageOrNotification; };
      }
      angular.forEach(notificationLists, function(list) {
        list.remove(matchFn);
      });
    },

    // Remove all the messages from all the lists in the service
    removeAll: function(){
      angular.forEach(notificationLists, function (list) {
        list.removeAll();
      });
    },

    // Push a notification to the specified list
    pushNotification: function(list, message, type, options) {
      list = notificationLists[list];
      if ( angular.isDefined(list) ) {
        var notification = list.createNotification(message, type, options);
        list.push(notification);
        return notification;
      } else {
        throw new Error('"' + list + '"" is not a valid notification list.');
      }
    }

    // addNotificationListToService (see below) will create a method on the service to push notifications to the list
    // For example, addNotificationListToService('CurrentRoute') will create notificationsService.pushCurrentRouteNotification(message, type, options)

  };

  function pushFunctionName(listName) {
    return 'push'+listName+'Notification';
  }

  // Add and configure a new list in the notification service.
  function addNotificationListToService(name) {
    notificationLists[name] = createNotificationList(name);
    notificationsService[pushFunctionName(name)] = function(message, type, options) { return notificationsService.pushNotification(name, message, type, options); };
  }

  function moveNotificationList(oldListName, newListName) {
    notificationsService[pushFunctionName(newListName)] = notificationsService[pushFunctionName(oldListName)];
    notificationLists[newListName] = notificationLists[oldListName];
    delete notificationsService['push'+oldListName+'Notification'];
    delete notificationLists[oldListName];
  }

  addNotificationListToService('Sticky');
  addNotificationListToService('CurrentRoute');
  addNotificationListToService('NextRoute');

  includeInCurrent.push('Sticky');
  includeInCurrent.push('CurrentRoute');

  // Rewire the CurrentRoute and NextRoute notification lists when the route changes
  $rootScope.$on('$routeChangeSuccess', function () {
    moveNotificationList('NextRoute', 'CurrentRoute');
    addNotificationListToService('NextRoute');
  });

  return notificationsService;
});