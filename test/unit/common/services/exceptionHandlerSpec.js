describe('exception handler', function () {

  var $exceptionHandler, notifications;
  beforeEach(function () {
    angular.module('test', ['services.exceptionHandler']).constant('I18N.MESSAGES', {'error.fatal':'Oh, snap!'});
    module('test');
  });
  beforeEach(inject(function (_$exceptionHandler_, _notifications_) {
    $exceptionHandler = _$exceptionHandler_;
    notifications = _notifications_;
  }));

  it('should use a localized message and push it to a notification service', function () {

    var error = new Error('Something went wrong...');
    var cause = 'Some obscure problem...';

    $exceptionHandler(error, cause);
    var currentNotifications = notifications.getCurrent(), errorNotification;
    expect(currentNotifications.length).toEqual(1);

    errorNotification = currentNotifications[0];
    expect(errorNotification.type).toEqual("error");
    expect(errorNotification.message).toEqual("Oh, snap!");
    expect(errorNotification.exception).toEqual(error);
    expect(errorNotification.cause).toEqual(cause);
  });
});