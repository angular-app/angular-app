describe('admin-users-list', function () {

  angular.module('mocks', []).value('I18N.MESSAGES', {});
  beforeEach(module('admin-users-edit', 'mocks'));

  beforeEach(module('admin-users-list', 'mocks'));

  describe('UsersListCtrl', function () {

    it('should set up the scope correctly', inject(function ($controller) {
      var locals = {
        $scope: {},
        crudListMethods: jasmine.createSpy('crudListMethods'),
        users: {}
      };
      $controller('UsersListCtrl', locals);

      expect(locals.$scope.users).toBe(locals.users);
      expect(locals.crudListMethods).toHaveBeenCalled();
    }));
  });
});