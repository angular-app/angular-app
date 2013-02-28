describe('authentication', function() {

  var $rootScope, $http, $httpBackend, success, error, status;
  var userInfo = { id: '1234567890', email: 'jo@bloggs.com', firstName: 'Jo', lastName: 'Bloggs'};

  angular.module('test',[]).constant('I18N.MESSAGES', messages = {});
  beforeEach(module('authentication', 'test', 'authentication/login/form.tpl.html'));
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

  var service, currentUser, queue;
  beforeEach(inject(function($injector) {
    service = $injector.get('authentication');
    currentUser = $injector.get('currentUser');
    queue = $injector.get('authenticationRetryQueue');
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
      $httpBackend.when('POST', '/login').respond(200, {user: userInfo});
      $httpBackend.expect('POST', '/login');
      service.login('email', 'password');
      $httpBackend.flush();
      expect(currentUser.info()).toBe(userInfo);
    });
    it('calls queue.retry on a successful login', function() {
      $httpBackend.when('POST', '/login').respond(200, {user: userInfo});
      spyOn(queue, 'retryAll');
      service.login('email', 'password');
      $httpBackend.flush();
      expect(queue.retryAll).toHaveBeenCalled();
      expect(currentUser.info()).toBe(userInfo);
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

  describe('requireAuthenticatedUser', function() {
    it('makes a GET request to authenticated-user url', function() {
      expect(currentUser.isAuthenticated()).toBe(false);
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