describe('securityInterceptor', function() {
  var queue, interceptor, $q, promise, wrappedPromise;

  beforeEach(module('security.interceptor'));

  beforeEach(inject(function($injector) {
    queue = $injector.get('securityRetryQueue');
    interceptor = $injector.get('securityInterceptor');
    $q = $injector.get('$q');
  }));

  it('does not intercept non-401 error responses', function() {
    var httpResponse = {
      status: 400
    };
    expect(interceptor.responseError(httpResponse)).toEqual($q.reject(httpResponse));
  });

  it('intercepts 401 error responses and adds it to the retry queue', function() {
    var notAuthResponse = {
      status: 401
    };
    interceptor.responseError(notAuthResponse);
    expect(queue.hasMore()).toBe(true);
    expect(queue.retryReason()).toBe('unauthorized-server');
  });
});
