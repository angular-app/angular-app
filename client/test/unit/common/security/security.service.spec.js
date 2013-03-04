describe('security', function() {

  var $rootScope, $http, $httpBackend, success, error, status, userResponse;
  
  angular.module('test',[]).constant('I18N.MESSAGES', messages = {});
  beforeEach(module('security', 'test', 'security/login/form.tpl.html'));
  beforeEach(inject(function(_$rootScope_, _$httpBackend_, _$http_) {
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
    $http = _$http_;

    success = jasmine.createSpy('success');
    error = jasmine.createSpy('error');

    userResponse = { user: { id: '1234567890', email: 'jo@bloggs.com', firstName: 'Jo', lastName: 'Bloggs'} };

    $httpBackend.when('GET', '/current-user').respond(200, userResponse);
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  var service, currentUser, queue;
  beforeEach(inject(function($injector) {
    service = $injector.get('security');
    currentUser = $injector.get('currentUser');
    queue = $injector.get('securityRetryQueue');
  }));

  describe('showLogin', function() {
    it("should open the dialog", function() {
      service.showLogin();
      $rootScope.$digest();
      expect(angular.element('.login-form').length).toBeGreaterThan(0);
      $httpBackend.flush();
    });
  });

  describe('login', function() {
    it('sends a http request to login the specified user', function() {
      $httpBackend.when('POST', '/login').respond(200, userResponse);
      $httpBackend.expect('POST', '/login');
      service.login('email', 'password');
      $httpBackend.flush();
      expect(currentUser.info()).toBe(userResponse.user);
    });
    it('calls queue.retry on a successful login', function() {
      $httpBackend.when('POST', '/login').respond(200, userResponse);
      spyOn(queue, 'retryAll');
      service.showLogin();
      service.login('email', 'password');
      $httpBackend.flush();
      $rootScope.$digest();
      expect(queue.retryAll).toHaveBeenCalled();
      expect(currentUser.info()).toBe(userResponse.user);
    });
    it('does not call queue.retryAll after a login failure', function() {
      $httpBackend.when('POST', '/login').respond(200, { user: null });
      $httpBackend.flush();
      spyOn(queue, 'retryAll');
      expect(queue.retryAll).not.toHaveBeenCalled();
      service.login('email', 'password');
      $httpBackend.flush();
      expect(queue.retryAll).not.toHaveBeenCalled();
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

  describe('authorization guards', function() {
    var resolved;
    beforeEach(function() {
      resolved = false;
    });
    describe('requestCurrentUser', function() {
      it('makes a GET request to current-user url', function() {
        expect(currentUser.isAuthenticated()).toBe(false);
        $httpBackend.expect('GET', '/current-user');
        service.requestCurrentUser().then(function(data) {
          resolved = true;
          expect(currentUser.isAuthenticated()).toBe(true);
          expect(currentUser.info()).toBe(userResponse.user);
        });
        $httpBackend.flush();
        expect(resolved).toBe(true);
      });
      it('returns the current user immediately if they are already authenticated', function() {
        var userInfo = {};
        currentUser.update(userInfo);
        expect(currentUser.isAuthenticated()).toBe(true);
        service.requestCurrentUser().then(function(data) {
          resolved = true;
          expect(currentUser.info()).toBe(userInfo);
        });
        $httpBackend.flush();
        expect(resolved).toBe(true);
      });
    });

    describe('requireAuthenticatedUser', function() {
      it('makes a GET request to current-user url', function() {
        expect(currentUser.isAuthenticated()).toBe(false);
        $httpBackend.expect('GET', '/current-user');
        service.requireAuthenticatedUser().then(function(data) {
          resolved = true;
          expect(currentUser.isAuthenticated()).toBe(true);
          expect(currentUser.info()).toBe(userResponse.user);
        });
        $httpBackend.flush();
        expect(resolved).toBe(true);
      });
      it('adds a new item to the retry queue if not authenticated', function () {
        var resolved = false;
        userResponse.user = null;
        $httpBackend.expect('GET', '/current-user');
        expect(queue.hasMore()).toBe(false);
        service.requireAuthenticatedUser().then(function() {
          resolved = true;
        });
        $httpBackend.flush();
        expect(currentUser.isAuthenticated()).toBe(false);
        expect(queue.hasMore()).toBe(true);
        expect(queue.retryReason()).toBe('unauthenticated-client');
        expect(resolved).toBe(false);
      });
    });

    describe('requireAdminUser', function() {
      it('makes a returns a resolved promise if we are already an admin', function() {
        $httpBackend.flush();
        var userInfo = {admin: true};
        currentUser.update(userInfo);
        expect(currentUser.isAdmin()).toBe(true);
        service.requireAdminUser().then(function() {
          resolved = true;
        });
        $rootScope.$digest();
        expect(currentUser.info()).toBe(userInfo);
        expect(resolved).toBe(true);
      });
      it('adds a new item to the retry queue if not admin', function() {
        $httpBackend.expect('GET', '/current-user');
        expect(queue.hasMore()).toBe(false);
        service.requireAdminUser().then(function() {
          resolved = true;
        });
        $httpBackend.flush();
        expect(currentUser.isAdmin()).toBe(false);
        expect(queue.hasMore()).toBe(true);
        expect(queue.retryReason()).toBe('unauthorized-client');
        expect(resolved).toBe(false);
      });
    });
  });
});