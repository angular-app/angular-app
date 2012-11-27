describe('admin users', function () {

  var $scope;
  var $controller;
  beforeEach(module('admin-users'));

  describe('controllers', function() {
    beforeEach(inject(function ($injector) {
      $scope = $injector.get('$rootScope');
      $controller = $injector.get('$controller');
    }));

    describe('UsersListCtrl', function () {
      it('should call crudListMethods', function () {
        var params = {
          $scope: $scope,
          crudListMethods: jasmine.createSpy('crudListMethods'),
          users: {}
        };
        var ctrl = $controller('UsersListCtrl', params);
        expect($scope.users).toBe(params.users);
        expect(params.crudListMethods).toHaveBeenCalled();
      });
    });

    describe('UsersEditCtrl', function () {
      var params, ctrl;
      beforeEach(function() {
        params = {
          $scope: $scope,
          $location: jasmine.createSpyObj('$location', ['path']),
          i18nNotifications: jasmine.createSpyObj('i18nNotifications', ['pushForCurrentRoute', 'pushForNextRoute']),
          user: jasmine.createSpyObj('user', ['$id'])
        };
        params.user.password = "XXX";
        ctrl = $controller('UsersEditCtrl', params);
      });

      it('should set up the scope correctly', function () {
        expect($scope.password).toBe($scope.user.password);
      });

      it('should call $location in onSave', function() {
        $scope.onSave({$id : angular.noop});
        expect(params.i18nNotifications.pushForNextRoute).toHaveBeenCalled();
        expect(params.$location.path).toHaveBeenCalled();
      });

      it('should set updateError in onError', function() {
        $scope.onError();
        expect(params.i18nNotifications.pushForCurrentRoute).toHaveBeenCalled();
      });
    });
  });

  describe('validateEquals directive', function() {
    var $scope, form;

    function setTestValue(value) {
      $scope.model.testValue = value;
      $scope.$digest();
    }
    function setCompareTo(value) {
      $scope.model.compareTo = value;
      $scope.$digest();
    }

    beforeEach(inject(function($compile, $rootScope) {
      $scope = $rootScope;
      var element = angular.element(
        '<form name="form"><input name="testInput" ng-model="model.testValue" validate-equals="model.compareTo"></form>'
      );
        $scope.model = {
        testValue: '',
        compareTo: ''
      };
      $compile(element)($scope);
      $scope.$digest();
      form = $scope.form;
    }));

    describe('model validity', function() {
      it('should be valid initially', function() {
        expect(form.testInput.$valid).toBe(true);
      });
      it('should be invalid if the model changes', function() {
        setTestValue('different');
        expect(form.testInput.$valid).toBe(false);
      });
      it('should be invalid if the reference model changes', function() {
        setCompareTo('different');
        expect(form.testInput.$valid).toBe(false);
      });
      it('should be valid if the model changes to be the same as the reference', function() {
        setCompareTo('different');
        expect(form.testInput.$valid).toBe(false);

        setTestValue('different');
        expect(form.testInput.$valid).toBe(true);
      });
    });
  });

  describe('uniqueEmail directive', function() {
    var Users, $scope, form;

    function setTestValue(value) {
      $scope.model.testValue = value;
      $scope.$digest();
    }

    // Mockup Users resource
    angular.module('test', []).factory('Users', function() {
      Users = jasmine.createSpyObj('Users', ['query']);
      return Users;
    });

    beforeEach(module('test'));
    beforeEach(inject(function($compile, $rootScope){
      $scope = $rootScope;
      var element = angular.element(
        '<form name="form"><input name="testInput" ng-model="model.testValue" unique-email></form>'
      );
      $scope.model = { testValue: null};
      $compile(element)($scope);
      $scope.$digest();
      form = $scope.form;
    }));
    it('should be valid initially', function() {
        expect(form.testInput.$valid).toBe(true);
    });
    it('should not call Users.query when the model changes', function() {
      setTestValue('different');
      expect(Users.query).not.toHaveBeenCalled();
    });
    it('should call Users.query when the view changes', function() {
      form.testInput.$setViewValue('different');
      expect(Users.query).toHaveBeenCalled();
    });
    it('should set model to invalid if the Users callback contains users', function() {
      Users.query.andCallFake(function(query, callback) {
        callback(['someUser']);
      });
      form.testInput.$setViewValue('different');
      expect(form.testInput.$valid).toBe(false);
    });
    it('should set model to valid if the Users callback contains no users', function() {
      Users.query.andCallFake(function(query, callback) {
        callback([]);
      });
      form.testInput.$setViewValue('different');
      expect(form.testInput.$valid).toBe(true);
    });
  });
});