describe("currentUser", function() {
  beforeEach(module('services.authentication.current-user'));

  it("should be unauthenticated to begin with", function() {
    inject(function(currentUser) {
      expect(currentUser.isAuthenticated()).toBe(false);
      expect(currentUser.isAdmin()).toBe(false);
      expect(currentUser.info()).toBe(null);
    });
  });
  it("should be authenticated if we update with user info", function() {
    inject(function(currentUser) {
      var userInfo = {};
      currentUser.update(userInfo);
      expect(currentUser.isAuthenticated()).toBe(true);
      expect(currentUser.isAdmin()).toBe(false);
      expect(currentUser.info()).toBe(userInfo);
    });
  });
  it("should be admin if we update with admin user info", function() {
    inject(function(currentUser) {
      var userInfo = { admin: true };
      currentUser.update(userInfo);
      expect(currentUser.isAuthenticated()).toBe(true);
      expect(currentUser.isAdmin()).toBe(true);
      expect(currentUser.info()).toBe(userInfo);
    });
  });

  it("should not be authenticated or admin if we clear the user", function() {
    inject(function(currentUser) {
      var userInfo = { admin: true };
      currentUser.update(userInfo);
      expect(currentUser.isAuthenticated()).toBe(true);
      expect(currentUser.isAdmin()).toBe(true);
      expect(currentUser.info()).toBe(userInfo);

      currentUser.clear();
      expect(currentUser.isAuthenticated()).toBe(false);
      expect(currentUser.isAdmin()).toBe(false);
      expect(currentUser.info()).toBe(null);
    });
  });
});

