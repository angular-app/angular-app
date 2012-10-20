describe('notifications', function () {

  var $scope, notifications;
  beforeEach(module('services.notifications'));
  beforeEach(inject(function ($rootScope, _notifications_) {
    $scope = $rootScope;
    notifications = _notifications_;
  }));

  describe('global notifications crud', function () {

    it('should allow to add, get and remove all notifications', function () {
      var msg1 = {type: 'alert', msg: 'Watch out!'};
      var msg2 = {type: 'info', msg: 'Just an info!'};
      notifications.pushGlobal(msg1);
      notifications.pushGlobal(msg2);

      expect(notifications.all().length).toEqual(2);
      expect(notifications.all()[0]).toBe(msg1);

      notifications.remove(msg2);
      expect(notifications.all().length).toEqual(1);
      expect(notifications.all()[0]).toBe(msg1);

      notifications.removeAll();
      expect(notifications.all().length).toEqual(0);
    });
  });

  describe('notifications expiring after route change', function () {

    it('should remove notification after route change', function () {
      var msg = {type: 'info', msg: 'Will go away after route change'};

      notifications.pushGlobal(msg);
      notifications.pushRouteChange(msg);
      expect(notifications.all().length).toEqual(2);
      $scope.$emit('$routeChangeSuccess');
      expect(notifications.all().length).toEqual(1);
    });
  });


  describe('notifications showing on next route change and expiring on a subsequent one', function () {

    it('should advertise a notification after a route change and remove on the subsequent route change', function () {
      var msg = {type: 'info', msg: 'Will go away after route change'};

      notifications.pushGlobal(msg);
      notifications.pushNextRouteChange(msg);
      expect(notifications.all().length).toEqual(1);
      $scope.$emit('$routeChangeSuccess');
      expect(notifications.all().length).toEqual(2);
      $scope.$emit('$routeChangeSuccess');
      expect(notifications.all().length).toEqual(1);
    });
  });
});