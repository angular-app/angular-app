describe('notifications', function () {

  var $scope, notifications;
  beforeEach(module('services.notifications'));
  beforeEach(inject(function($injector) {
    $scope = $injector.get('$rootScope');
    notifications = $injector.get('notifications');
  }));

  describe('global notifications crud', function () {

    it('should allow to add, get and remove notifications', function () {
      var not1 = notifications.pushSticky('Watch out!', 'alert');
      var not2 = notifications.pushSticky('Just an info!', 'info');

      expect(notifications.getCurrent().length).toEqual(2);
      expect(notifications.getCurrent()[0]).toBe(not1);

      notifications.remove(not2);
      expect(notifications.getCurrent().length).toEqual(1);
      expect(notifications.getCurrent()[0]).toBe(not1);

      notifications.removeAll();
      expect(notifications.getCurrent().length).toEqual(0);
    });

    it('removeal of a non-existing notification doesnt trigger errors', function () {
      notifications.remove({});
    });
  });

  describe('notifications expiring after route change', function () {

    it('should remove notification after route change', function () {
      var sticky = notifications.pushSticky('Will stick around after route change');
      var currentRoute = notifications.pushForCurrentRoute('Will go away after route change');
      expect(notifications.getCurrent().length).toEqual(2);
      $scope.$emit('$routeChangeSuccess');
      expect(notifications.getCurrent().length).toEqual(1);
      expect(notifications.getCurrent()[0]).toBe(sticky);
    });
  });


  describe('notifications showing on next route change and expiring on a subsequent one', function () {

    it('should advertise a notification after a route change and remove on the subsequent route change', function () {
      notifications.pushSticky('Will stick around after route change');
      notifications.pushForNextRoute('Will not be there till after route change');
      expect(notifications.getCurrent().length).toEqual(1);
      $scope.$emit('$routeChangeSuccess');
      expect(notifications.getCurrent().length).toEqual(2);
      $scope.$emit('$routeChangeSuccess');
      expect(notifications.getCurrent().length).toEqual(1);
    });
  });

  describe('removing a notification instance', function () {

    it('should allow removal of notification instances', function () {
      var sticky = notifications.pushSticky('Will be removed!');
      expect(notifications.getCurrent().length).toEqual(1);
     notifications.getCurrent()[0].$remove();
     expect(notifications.getCurrent().length).toEqual(0);
    });
  });
});