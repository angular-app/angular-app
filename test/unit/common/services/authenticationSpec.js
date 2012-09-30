describe('services.authentication', function() {

  var $rootScope, $http, $httpBackend, success, error, status;

  beforeEach(module('services.authentication', 'ng'));
  beforeEach(inject(function($injector) {
    $rootScope = $injector.get('$rootScope');
    $httpBackend = $injector.get('$httpBackend');
    $http = $injector.get('$http');
    success = jasmine.createSpy('success');
    error = jasmine.createSpy('error');
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
    var service;
    beforeEach(inject(function($injector) {
      service = $injector.get('AuthenticationService');
    }));

    describe('isLoginRequired', function() {
      it('should not require login before any responses have been received', function() {
        expect(service.isLoginRequired()).toBe(false);
        mockUpHttpResponse(401, 'Not Authorized');
        expect(service.isLoginRequired()).toBe(false);
        $httpBackend.flush();
      });

      it('should not require login after non-401 responses have been received', function() {
        mockUpHttpResponse(400, 'Bad Request');
        $httpBackend.flush();
        mockUpHttpResponse(200, 'Success');
        $httpBackend.flush();
        expect(service.isLoginRequired()).toBe(false);
      });

      it('should require login after a 401 response has been received', function() {
        mockUpHttpResponse(401, 'Not Authorized');
        $httpBackend.flush();
        expect(service.isLoginRequired()).toBe(true);
      });

      it('should require login after multiple 401 responses have been received', function() {
        mockUpHttpResponse(401, 'Not Authorized');
        $httpBackend.flush();
        mockUpHttpResponse(200, 'Success');
        mockUpHttpResponse(400, 'Bad Request');
        mockUpHttpResponse(401, 'Not Authorized');
        $httpBackend.flush();
        expect(service.isLoginRequired()).toBe(true);
      });
    });

    describe('retryRequests', function() {
      it('should not require login immediately after requests have been retried', function() {
        mockUpHttpResponse(401, 'Not Authorized');
        $httpBackend.flush();
        expect(service.isLoginRequired()).toBe(true);
        service.retryRequests();
        expect(service.isLoginRequired()).toBe(false);
        $httpBackend.flush();
      });

      it('should not require login after requests are no longer failing with 401 and requests have been retried', function() {
        var mock = $httpBackend.when('GET', '/');
    
        // Send a GET and respond with 401 No Authorized
        mock.respond(401, "Not Authorized");
        $http.get('/').then(success, error);
        $httpBackend.flush();
        expect(service.isLoginRequired()).toBe(true);

        // Now clear the 401, confirm log-in and flush the retry responses
        mock.respond(200, "Success");
        service.retryRequests();
        $httpBackend.flush();
        expect(service.isLoginRequired()).toBe(false, 'Queue should now be empty');
      });
    }); 
    
    describe('login', function() {
      it('calls retryRequests if the http request is succesful', function() {
        spyOn(service, 'retryRequests');
        $httpBackend.expect('POST', '/login');
        $httpBackend.when('POST', '/login').respond(200, 'User Info');
        service.login('email', 'password');
        $httpBackend.flush();
      });
    });
  });
});