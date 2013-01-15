describe('exception handler', function () {

  var $exceptionHandler, notifications;
  beforeEach(function () {
    angular.module('test', ['services.exceptionHandler'], function($exceptionHandlerProvider){
      $exceptionHandlerProvider.mode('log');
    }).constant('I18N.MESSAGES', {'error.fatal':'Oh, snap!'});
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

  it('should not go into infinite loop in case of problems with exception handler', function () {
    spyOn(notifications, 'pushForCurrentRoute').andThrow('issue with notifications');
    //the syntax to test for exceptions is a bit odd...
    //http://stackoverflow.com/questions/4144686/how-to-write-a-test-which-expects-an-error-to-be-thrown
    expect(function(){
      $exceptionHandler(new Error('root cause'));
    }).toThrow('issue with notifications');
  });

  it('should call through to the delegate', function() {
    inject(function(exceptionHandlerFactory) {
      var error = new Error('Something went wrong...');
      var cause = 'Some obscure problem...';

      var delegate = jasmine.createSpy('delegate');
      var exceptionHandler = exceptionHandlerFactory(delegate);
      exceptionHandler(error, cause);
      expect(delegate).toHaveBeenCalledWith(error, cause);
    });
  });
});