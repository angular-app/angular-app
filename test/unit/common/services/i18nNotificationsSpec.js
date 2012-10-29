describe('i18nNotifications', function () {

  var i18nNotifications, notifications, localizedMessages;
  beforeEach(module('services.i18nNotifications'));
  beforeEach(inject(function (_i18nNotifications_, _notifications_, _localizedMessages_) {
    i18nNotifications = _i18nNotifications_;
    notifications = _notifications_;
    localizedMessages = _localizedMessages_;
  }));

});