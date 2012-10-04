describe('my app', function() {

  beforeEach(function() {
    browser().navigateTo('/');
  });

  it('should automatically redirect to /signin when location hash/fragment is empty', function() {
    expect(browser().location().path()).toBe("/dashboard");
  });

});