describe('admin-users-edit', function() {

  beforeEach(function() {
    angular.module('I18N-mock', []).value('I18N.MESSAGES', {});
  });
  beforeEach(module('admin-users-edit', 'I18N-mock'));

  describe('UsersEditCtrl', function () {
    function createLocals() {
      return {
        $scope: {},
        $location: jasmine.createSpyObj('$location', ['path']),
        i18nNotifications: jasmine.createSpyObj('i18nNotifications', ['pushForCurrentRoute', 'pushForNextRoute']),
        user: {
          $id: jasmine.createSpy('$id'),
          $password: 'XXX'
        }
      };
    }
    function runController(locals) {
      inject(function($controller) {
        $controller('UsersEditCtrl', locals);
      });
    }

    it('should extract the password from the user object', function () {
      var locals = createLocals();
      runController(locals);

      expect(locals.$scope.password).toBe(locals.$scope.user.password);
    });

    it('should call $location & i18nNotifications services when $scope.onSave() is called', function() {
      var locals = createLocals();
      runController(locals);

      locals.$scope.onSave({$id : angular.noop});

      expect(locals.i18nNotifications.pushForNextRoute).toHaveBeenCalled();
      expect(locals.$location.path).toHaveBeenCalled();
    });

    it('should set updateError in onError', function() {
      var locals = createLocals();
      runController(locals);

      locals.$scope.onError();
      expect(locals.i18nNotifications.pushForCurrentRoute).toHaveBeenCalled();
    });
  });

});