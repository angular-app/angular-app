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

  describe('AuthenticationService', function() {
    var service, currentUser, queue;
    beforeEach(inject(function($injector) {
      service = $injector.get('AuthenticationService');
      currentUser = $injector.get('currentUser');
      queue = $injector.get('AuthenticationRetryQueue');
    }));

    describe('isLoginRequired', function() {

      function mockRetryItem() {
        return jasmine.createSpyObj('retryItem', ['retry', 'cancel']);
      }

      function pushRetryItem() {
        queue.push(mockRetryItem());
        $rootScope.$digest();
      }

      function retryQueue() {
        queue.retry();
        $rootScope.$digest();
      }

      function cancelQueue() {
        queue.cancel();
        $rootScope.$digest();
      }

      afterEach(function() {
        // Flush through the call to requestCurrent, which is not important here
        $httpBackend.flush();
      });

      it('should be true when the current user is null and a request is added to an empty queue.', function() {
        pushRetryItem();
        expect(service.isLoginRequired()).toBe(true);
      });

      it('should be true when the current user is not null and a request is added to an empty queue.', function() {
        currentUser.update({});
        pushRetryItem();
        expect(service.isLoginRequired()).toBe(true);
      });

      it('should be true if a request is added to a non-empty queue.', function() {
        pushRetryItem();
        pushRetryItem();
        expect(service.isLoginRequired()).toBe(true);
      });

      it('should be false if no items have been added to the queue.', function() {
        $rootScope.$digest();
        expect(service.isLoginRequired()).toBe(false);
      });

      it('should be false if the queue has been retried.', function() {
        pushRetryItem();
        pushRetryItem();
        expect(service.isLoginRequired()).toBe(true);
        retryQueue();
        expect(service.isLoginRequired()).toBe(false);
      });

      it('should be false if the queue has been cancelled.', function() {
        pushRetryItem();
        pushRetryItem();
        expect(service.isLoginRequired()).toBe(true);
        cancelQueue();
        expect(service.isLoginRequired()).toBe(false);
      });

      it('should be true if the queue is processed then a new item is added to the queue.', function() {
        pushRetryItem();
        retryQueue();
        pushRetryItem();
        expect(service.isLoginRequired()).toBe(true);
      });
    });

    describe('showLogin', function() {
      it("should make isLoginRequired true", function() {
        service.showLogin();
        $rootScope.$digest();
        expect(service.isLoginRequired()).toBe(true);
        expect(queue.getReason()).toBe('user-request');
        $httpBackend.flush();
      });
    });

    describe('login', function() {
      it('sends a http request to login the specified user', function() {
        $httpBackend.when('POST', '/login').respond(200, {user: userInfo});
        $httpBackend.expect('POST', '/login');
        service.login('email', 'password');
        $httpBackend.flush();
        expect(currentUser.info()).toBe(userInfo);
      });
      it('calls queue.retry on a successful login', function() {
        $httpBackend.when('POST', '/login').respond(200, {user: userInfo});
        spyOn(queue, 'retry');
        service.login('email', 'password');
        $httpBackend.flush();
        expect(queue.retry).toHaveBeenCalled();
        expect(currentUser.info()).toBe(userInfo);
      });
      it('does not call queue.retry after a login failure', function() {
        $httpBackend.when('POST', '/login').respond(200, { user: null });
        $httpBackend.flush();
        spyOn(queue, 'retry');
        expect(queue.retry).not.toHaveBeenCalled();
        service.login('email', 'password');
        $httpBackend.flush();
        expect(queue.retry).not.toHaveBeenCalled();
      });
    });

    describe('logout', function() {
      beforeEach(function() {
        $httpBackend.when('POST', '/logout').respond(200, {});
      });

      it('sends a http post to clear the current logged in user', function() {
        $httpBackend.expect('POST', '/logout');
        service.logout();
        $httpBackend.flush();
      });

      it('redirects to / by default', function() {
        inject(function($location) {
          spyOn($location, 'path');
          service.logout();
          $httpBackend.flush();
          expect($location.path).toHaveBeenCalledWith('/');
        });
      });

      it('redirects to the path specified in the first parameter', function() {
        inject(function($location) {
          spyOn($location, 'path');
          service.logout('/other/path');
          $httpBackend.flush();
          expect($location.path).toHaveBeenCalledWith('/other/path');
        });
      });
    });

    describe('requestCurrentUser', function() {
      it('makes a GET request to current-user url', function() {
        expect(currentUser.isAuthenticated()).toBe(false);
        $httpBackend.expect('GET', '/current-user');
        service.requestCurrentUser().then(function(data) {
          expect(currentUser.isAuthenticated()).toBe(true);
          expect(currentUser.info()).toBe(userInfo);
        });
        $httpBackend.flush();
      });
      it('returns the current user immediately if they are already authenticated', function() {
        var userInfo = {};
        currentUser.update(userInfo);
        expect(currentUser.isAuthenticated()).toBe(true);
        service.requestCurrentUser().then(function(data) {
          expect(currentUser.info()).toBe(userInfo);
        });
        $httpBackend.flush();
      });
    });

    xdescribe('requireAuthenticatedUser', function() {
      it('makes a GET request to authenticated-user url', function() {
        expect(currentUser.isAuthenticated()).toBe(false);
        $httpBackend.expect('GET', '/authenticated-user');
        service.requireAuthenticatedUser().then(function(data) {
          expect(currentUser.isAuthenticated()).toBe(true);
          expect(currentUser.info()).toBe(userInfo);
        });
        $httpBackend.flush();
      });
    });

    describe('requireAdminUser', function() {
      it('makes a returns a resolved promise if we are already an admin', function() {
        var userInfo = {admin: true};
        currentUser.update(userInfo);
        service.requireAdminUser().then(function() {
          // Currently this is not being called within the test!
          expect(currentUser.info()).toBe(userInfo);
        });
        $httpBackend.flush();
      });
    });
  });
});