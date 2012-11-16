describe('i18nNotifications', function () {

  var i18nNotifications, notifications, localizedMessages;
  beforeEach(function () {
    angular.module('test', ['services.i18nNotifications']).value('I18N.MESSAGES', {});
  });
  beforeEach(module('test'));
  beforeEach(inject(function (_i18nNotifications_, _notifications_, _localizedMessages_) {
    i18nNotifications = _i18nNotifications_;
    notifications = _notifications_;
    localizedMessages = _localizedMessages_;
  }));

  describe('creating new notification based on localized messages', function () {

    it('should add a new sticky notification based on a localized message and its type', function () {
      var notifications;
      i18nNotifications.pushSticky('i18n.key', 'success');

      notifications = i18nNotifications.getCurrent();
      expect(notifications.length).toEqual(1);
      expect(notifications[0].message).toEqual('?i18n.key?');
      expect(notifications[0].type).toEqual('success');
    });
  });

  describe('proxy getCurrent and remove methods', function () {

    it('should proxy getCurent method', function () {
      spyOn(notifications, 'getCurrent');
      i18nNotifications.getCurrent();
      expect(notifications.getCurrent).toHaveBeenCalled();
    });

    it('should proxy remove method', function () {
      var notification = {};
      spyOn(notifications, 'remove');
      i18nNotifications.remove(notification);
      expect(notifications.remove).toHaveBeenCalledWith(notification);
    });
  });

});