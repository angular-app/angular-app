myAppDev = angular.module('myAppDev', ['app', 'ngMockE2E']);

myAppDev.run(function($httpBackend) {
  // Mock up logged in admin user
  $httpBackend.whenGET('/current-user').respond({user: { email: 'admin@abc.com', admin: true }});
});

describe('admin edit user', function() {

  beforeEach(function() {
    browser().navigateTo('/admin/users/new');
  });

  it('enables the save button when the user info is filled in correctly', function() {
    pause();
    expect(element('button.save:disabled').count()).toBe(1);
    input('user.email').enter('test@app.com');
    input('user.lastName').enter('Test');
    input('user.firstName').enter('App');
    input('user.password').enter('t');
    input('password').enter('t');
    expect(element('button.save:disabled').count()).toBe(0);
  });
});