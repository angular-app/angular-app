describe('notifications', function () {

  var $scope, notifications;
  beforeEach(module('services.notifications'));
  beforeEach(inject(function ($rootScope, _notifications_) {
    $scope = $rootScope;
    notifications = _notifications_;
  }));

  describe('global notifications crud', function () {

    it('should allow to add, get and clear all notifications', function () {
      var msg1 = {type: 'alert', msg: 'Watch out!'};
      var msg2 = {type: 'info', msg: 'Just an info!'};
      notifications.addFixed(msg1);
      notifications.addFixed(msg2);

      expect(notifications.get().length).toEqual(2);
      expect(notifications.get()[0]).toBe(msg1);

      notifications.clear(msg2);
      expect(notifications.get().length).toEqual(1);
      expect(notifications.get()[0]).toBe(msg1);

      notifications.clearAll();
      expect(notifications.get().length).toEqual(0);
    });
  });

  describe('notifications expiring after route change', function () {

    it('should clear notification after route change', function () {
      var msg = {type: 'info', msg: 'Will go away after route change'};

      notifications.addFixed(msg);
      notifications.addRouteChange(msg);
      expect(notifications.get().length).toEqual(2);
      $scope.$emit('$routeChangeSuccess');
      expect(notifications.get().length).toEqual(1);
    });
  });


  describe('notifications showing on next route change and expiring on a subsequent one', function () {

    it('should advertise a notification after a route change and clear on the subsequent route change', function () {
      var msg = {type: 'info', msg: 'Will go away after route change'};

      notifications.addFixed(msg);
      notifications.addNextRouteChange(msg);
      expect(notifications.get().length).toEqual(1);
      $scope.$emit('$routeChangeSuccess');
      expect(notifications.get().length).toEqual(2);
      $scope.$emit('$routeChangeSuccess');
      expect(notifications.get().length).toEqual(1);
    });
  });

  describe('canceling a notification instance', function () {

    it('should allow cancelation of notification instances', function () {
      var msg = {type:'info', msg:'To be canceled'};

      notifications.addFixed(msg);
      expect(notifications.get().length).toEqual(1);

      notifications.get()[0].$clear();
      expect(notifications.get().length).toEqual(0);
    });
  });
});