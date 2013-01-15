describe('notifications', function () {

  var $scope, notifications;
  beforeEach(module('services.notifications'));
  beforeEach(inject(function($injector) {
    $scope = $injector.get('$rootScope');
    notifications = $injector.get('notifications');
  }));

  describe('global notifications crud', function () {

    it('should allow to add, get and remove notifications', function () {
      var not1 = notifications.pushSticky({msg:'Watch out!'});
      var not2 = notifications.pushSticky({msg:'Just an info!'});
      expect(notifications.getCurrent().length).toBe(2);

      notifications.remove(not2);
      expect(notifications.getCurrent().length).toEqual(1);
      expect(notifications.getCurrent()[0]).toBe(not1);

      notifications.removeAll();
      expect(notifications.getCurrent().length).toEqual(0);
    });

    it('removal of a non-existing notification doesnt trigger errors', function () {
      notifications.remove({});
    });

    it('should reject notifications that are not objects', function () {
      expect(function(){
        notifications.pushSticky("not an object");
      }).toThrow(new Error("Only object can be added to the notification service"));
    });
  });

  describe('notifications expiring after route change', function () {

    it('should remove notification after route change', function () {
      var sticky = notifications.pushSticky({msg:'Will stick around after route change'});
      var currentRoute = notifications.pushForCurrentRoute({msg:'Will go away after route change'});
      expect(notifications.getCurrent().length).toEqual(2);
      $scope.$emit('$routeChangeSuccess');
      expect(notifications.getCurrent().length).toEqual(1);
      expect(notifications.getCurrent()[0]).toBe(sticky);
    });
  });


  describe('notifications showing on next route change and expiring on a subsequent one', function () {

    it('should advertise a notification after a route change and remove on the subsequent route change', function () {
      notifications.pushSticky({msg:'Will stick around after route change'});
      notifications.pushForNextRoute({msg:'Will not be there till after route change'});
      expect(notifications.getCurrent().length).toEqual(1);
      $scope.$emit('$routeChangeSuccess');
      expect(notifications.getCurrent().length).toEqual(2);
      $scope.$emit('$routeChangeSuccess');
      expect(notifications.getCurrent().length).toEqual(1);
    });
  });
});