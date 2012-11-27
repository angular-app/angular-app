describe('admin edit user', function() {

  beforeEach(function() {
    browser().navigateTo('/admin/users/new');
    input('user.email').enter('admin@abc.com');
    input('user.password').enter('changeme');
    element('button.login').click();
  });

  it('enables the save button when the user info is filled in correctly', function() {
    expect(element('button.save:disabled').count()).toBe(1);
    input('user.email').enter('test@app.com');
    input('user.lastName').enter('Test');
    input('user.firstName').enter('App');
    input('user.password').enter('t');
    input('password').enter('t');
    expect(element('button.save:disabled').count()).toBe(0);
  });
});