describe('admin-users-list', function() {

  angular.module('I18N-mock', []).value('I18N.MESSAGES', {});
  beforeEach(module('admin-users-list', 'I18N-mock'));

  describe('UsersListCtrl', function () {

    var $rootScope, user;

    it('should set up the scope correctly', inject(function($controller, _$rootScope_, _$q_) {
      $rootScope = _$rootScope_;
      $q = _$q_;

      user = {
        $remove: jasmine.createSpy('$remove').andReturn($q.when(true)),
        $id: jasmine.createSpy('$id')
      };

      var locals = {
        $scope: $rootScope,
        crudListMethods: jasmine.createSpy('crudListMethods'),
        users: [ user ]
      };

      $controller('UsersListCtrl', locals);

      expect($rootScope.users).toBe(locals.users);
      expect(locals.crudListMethods).toHaveBeenCalled();
    }));

    describe("remove()", function() {
      it("should remove the user locally and remotely", function() {
        $rootScope.$apply(function() {
          $rootScope.remove(user, 0, { stopPropagation: angular.noop });
        });
        expect(user.$remove).toHaveBeenCalled();
        expect($rootScope.users.length).toEqual(0);
      });
    });
  });
});