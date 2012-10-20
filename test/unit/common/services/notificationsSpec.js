describe('notifications', function () {

  var $scope, notifications;
  beforeEach(module('services.notifications'));
  beforeEach(inject(function($injector) {
    $scope = $injector.get('$rootScope');
    notifications = $injector.get('notifications');
  }));

  describe('global notifications crud', function () {

    it('should allow to add, get and remove notifications', function () {
      var not1 = notifications.pushStickyNotification('Watch out!', 'alert');
      var not2 = notifications.pushStickyNotification('Just an info!', 'info');

      expect(notifications.current().length).toEqual(2);
      expect(notifications.current()[0]).toBe(not1);

      notifications.remove(not2);
      expect(notifications.current().length).toEqual(1);
      expect(notifications.current()[0]).toBe(not1);

      notifications.removeAll();
      expect(notifications.current().length).toEqual(0);
    });
  });

  describe('notifications expiring after route change', function () {

    it('should remove notification after route change', function () {
      var sticky = notifications.pushStickyNotification('Will stick around after route change');
      var currentRoute = notifications.pushCurrentRouteNotification('Will go away after route change');
      expect(notifications.current().length).toEqual(2);
      $scope.$emit('$routeChangeSuccess');
      expect(notifications.current().length).toEqual(1);
      expect(notifications.current()[0]).toBe(sticky);
    });
  });


  describe('notifications showing on next route change and expiring on a subsequent one', function () {

    it('should advertise a notification after a route change and remove on the subsequent route change', function () {
      notifications.pushStickyNotification('Will stick around after route change');
      notifications.pushNextRouteNotification('Will not be there till after route change');
      expect(notifications.current().length).toEqual(1);
      $scope.$emit('$routeChangeSuccess');
      expect(notifications.current().length).toEqual(2);
      $scope.$emit('$routeChangeSuccess');
      expect(notifications.current().length).toEqual(1);
    });
  });
});