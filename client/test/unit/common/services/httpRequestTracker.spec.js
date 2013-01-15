describe('httpRequestTracker', function () {

  var http, httpRequestTracker;
  beforeEach(module('services.httpRequestTracker'));
  beforeEach(inject(function ($injector) {
    httpRequestTracker = $injector.get('httpRequestTracker');
    http = $injector.get('$http');
  }));

  it('should not report pending requests if no requests in progress', function () {
    expect(httpRequestTracker.hasPendingRequests()).toBeFalsy();
  });

  it('should report pending requests if requests are in progress', function () {
    http.pendingRequests.push({});
    expect(httpRequestTracker.hasPendingRequests()).toBeTruthy();
  });
});