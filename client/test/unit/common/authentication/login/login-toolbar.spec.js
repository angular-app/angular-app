describe('login-toolbar', function() {
  var userInfo = { id: '1234567890', email: 'jo@bloggs.com', firstName: 'Jo', lastName: 'Bloggs'};
  var scope, toolbar;

  beforeEach(module('authentication/login/toolbar.tpl.html', 'authentication'));

  beforeEach(inject(function($httpBackend, $rootScope, $compile) {
    $httpBackend.when('GET', '/current-user').respond(200, { user: userInfo });
    toolbar = $compile('<login-toolbar></login-toolbar')($rootScope);
    $rootScope.$digest();
    scope = toolbar.scope();
    $httpBackend.flush();
    angular.element(document.body).append(toolbar);
  }));

  afterEach(function() {
    toolbar.remove();
  });

  it('should attach stuff to the scope', inject(function ($compile, $rootScope) {
    expect(scope.userInfo).toBeDefined();
    expect(scope.isAuthenticated).toBeDefined();
    expect(scope.login).toBeDefined();
    expect(scope.logout).toBeDefined();
  }));

  it('should display a link with the current user name, when authenticated', function () {
    expect(toolbar.find('a').text()).toBe('Jo Bloggs');
  });

  it('should not display a link with the current user name, when not authenticated', function () {
    expect(toolbar.find('a').is(':visible')).toBe(false);
  });

  it('should display logout when user is authenticated', function() {
    expect(toolbar.find('button:visible').text()).toBe('Log out');
    expect(toolbar.find('button:hidden').text()).toBe('Log in');
  });

  it('should display login when user is not authenticated', inject(function(currentUser) {
    // Logout current user
    currentUser.update(null);
    scope.$digest();

    expect(toolbar.find('button:visible').text()).toBe('Log in');
    expect(toolbar.find('button:hidden').text()).toBe('Log out');
  }));

  it('should call logout when the logout button is clicked', function () {
    spyOn(scope, 'logout');
    toolbar.find('button:visible').click();
    expect(scope.logout).toHaveBeenCalled();
  });

  it('should call login when the login button is clicked', function () {
    spyOn(scope, 'login');
    toolbar.find('button:hidden').click();
    expect(scope.login).toHaveBeenCalled();
  });
});