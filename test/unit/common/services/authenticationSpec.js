describe('services.authentication', function() {

  var $rootScope, $http, $httpBackend, success, error, status;
  var userInfo = { id: '1234567890', email: 'jo@bloggs.com', firstName: 'Jo', lastName: 'Bloggs'};

  beforeEach(module('services.authentication', 'ng'));
  beforeEach(inject(function($injector) {
    $rootScope = $injector.get('$rootScope');
    $httpBackend = $injector.get('$httpBackend');
    $http = $injector.get('$http');
    success = jasmine.createSpy('success');
    error = jasmine.createSpy('error');
    $httpBackend.when('GET', '/current-user').respond(200, { user: userInfo });
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  var mockUpHttpResponse = function(status, data) {
    $httpBackend.when('GET', '/').respond(status, data);
    $http.get('/').then(success, error);
  };

  describe('Normal Responses', function() {
    var testSuccessfulResponse = function(status, data) {
        describe(status + ' HTTP Response', function() {
          it('is not affected', function() {
            mockUpHttpResponse(status, data);
            $httpBackend.flush();
            expect(success).toHaveBeenCalled();
            expect(error).not.toHaveBeenCalled();
          });
        });
      };

    for (status = 200; status < 300; ++status) {
      testSuccessfulResponse(status, 'Success: ' + status);
    }

    var testErrorResponse = function(status, data) {
        describe(status + ' HTTP Response', function() {
          it('is not affected', function() {
            mockUpHttpResponse(status, data);
            $httpBackend.flush();
            expect(success).not.toHaveBeenCalled();
            expect(error).toHaveBeenCalled();
          });
        });
      };

    testErrorResponse(400, 'Bad Request');
    for (status = 402; status < 600; ++status) {
      testErrorResponse(status, 'Error: ' + status);
    }
  });

  describe('AuthenticationRequestRetryQueue', function() {
    var queue;
    beforeEach(inject(function($injector) {
      queue = $injector.get('AuthenticationRequestRetryQueue');
    }));

    it('initially has no items to retry', function() {
      expect(queue.hasMore).toBeDefined();
      expect(queue.hasMore()).toBe(false);
    });

    it('pushing a request returns a promise', function() {
      var promise = queue.pushRequest('request');
      expect(promise.then).toBeDefined();
    });

    it('has more items once one has been pushed', function() {
      queue.pushRequest('request');
      expect(queue.hasMore()).toBe(true);
    });

    it('has no more items once all items have been got', function() {
      queue.pushRequest('request');
      var next = queue.getNext();
      expect(queue.hasMore()).toBe(false);
    });

    it('stores a deferred object with the same promise as is returned from pushRequest', function() {
      var promise = queue.pushRequest('request');
      var next = queue.getNext();
      expect(next.deferred.promise).toBe(promise);
    });

    describe('process', function() {
      it('should not fail if the queue is empty', function(){
        queue.process(function(item) {});
      });
    });
    
  });

  describe('AuthenticationInterceptor', function() {
    var queue, interceptor, promise, wrappedPromise;
    beforeEach(inject(function($injector) {
      queue = $injector.get('AuthenticationRequestRetryQueue');
      interceptor = $injector.get('AuthenticationInterceptor');
      wrappedPromise = {};
      promise = {
        then: jasmine.createSpy('then').andReturn(wrappedPromise)
      };
    }));

    it('accepts and returns a promise', function() {
      var newPromise = interceptor(promise);
      expect(promise.then).toHaveBeenCalled();
      expect(promise.then.mostRecentCall.args[0]).toBe(null);
      expect(newPromise).toBe(wrappedPromise);
    });

    it('does not intercept non-401 error responses', function() {
      var badmockUpHttpResponse = {
        status: 400
      };
      interceptor(promise);
      var errorHandler = promise.then.mostRecentCall.args[1];
      expect(errorHandler(badmockUpHttpResponse)).toBe(promise);
    });

    it('intercepts 401 error responses and adds it to the retry queue', function() {
      var notAuthResponse = {
        status: 401
      };
      interceptor(promise);
      var errorHandler = promise.then.mostRecentCall.args[1];
      var newPromise = errorHandler(notAuthResponse);
      expect(queue.getNext().deferred.promise).toBe(newPromise);
    });
  });

  describe('AuthenticationService', function() {
    var service, queue;
    beforeEach(inject(function($injector) {
      service = $injector.get('AuthenticationService');
      queue = $injector.get('AuthenticationRequestRetryQueue');
    }));

    describe('login', function() {
      it('calls queue.process if the user is authenticated', function() {
        spyOn(queue, 'process');
        spyOn(service, 'requestCurrentUser');
        $httpBackend.expect('POST', '/login');
        $httpBackend.when('POST', '/login').respond(200, {user: userInfo});
        service.login('email', 'password');
        $httpBackend.flush();
        expect(queue.process).toHaveBeenCalled();
        expect(service.requestCurrentUser).not.toHaveBeenCalled();
      });
      it('does not call queue.process if the user is not authenticated', function() {
        spyOn(queue, 'process');
        spyOn(service, 'requestCurrentUser');
        $httpBackend.expect('POST', '/login');
        $httpBackend.when('POST', '/login').respond(200, {user: null});
        service.login('email', 'password');
        $httpBackend.flush();
        expect(queue.process).not.toHaveBeenCalled();
        expect(service.requestCurrentUser).not.toHaveBeenCalled();
      });
    });

    describe('requestCurrentUser', function() {
      it('makes a GET request to current-user url', function() {
        expect(service.currentUser).toBe(null);
        $httpBackend.expect('GET', '/current-user');
        service.requestCurrentUser().then(function(data) {
          expect(service.currentUser).toBe(userInfo);
        });
        $httpBackend.flush();
      });
    });
  });
});