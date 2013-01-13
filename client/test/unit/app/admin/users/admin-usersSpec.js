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
    var $scope, modelCtrl, modelValue;

    beforeEach(inject(function($compile, $rootScope) {
      $scope = $rootScope;
      var element = angular.element(
        '<form name="testForm">' +
          '<input name="testInput" ' +
            'ng-model="model.testValue" ' +
            'validate-equals="model.compareTo">' +
        '</form>'
      );
      $compile(element)($scope);
      modelValue = $scope.model = {};
      modelCtrl = $scope.testForm.testInput;
      $scope.$digest();
    }));

    it('should be valid initially', function() {
      expect(modelCtrl.$valid).toBeTruthy();
    });

    describe('model value changes', function() {
      it('should be invalid if the model changes', function() {
        modelValue.testValue = 'different';
        $scope.$digest();
        expect(modelCtrl.$valid).toBeFalsy();
        expect(modelCtrl.$viewValue).toBe(undefined);
      });
      it('should be invalid if the reference model changes', function() {
        modelValue.compareTo = 'different';
        $scope.$digest();
        expect(modelCtrl.$valid).toBeFalsy();
        expect(modelCtrl.$viewValue).toBe(undefined);
      });
      it('should be valid if the modelValue changes to be the same as the reference', function() {
        modelValue.compareTo = 'different';
        $scope.$digest();
        expect(modelCtrl.$valid).toBeFalsy();

        modelValue.testValue = 'different';
        $scope.$digest();
        expect(modelCtrl.$valid).toBeTruthy();
        expect(modelCtrl.$viewValue).toBe('different');
      });
    });

    describe('input value changes', function() {
      it('should be invalid if the input value changes', function() {
        modelCtrl.$setViewValue('different');
        expect(modelCtrl.$valid).toBeFalsy();
        expect(modelValue.testValue).toBe(undefined);
      });

      it('should be invalid if the input value changes to be the same as the reference', function() {
        modelValue.compareTo = 'different';
        $scope.$digest();
        expect(modelCtrl.$valid).toBeFalsy();

        modelCtrl.$setViewValue('different');
        expect(modelCtrl.$viewValue).toBe('different');
        expect(modelCtrl.$valid).toBeTruthy();
      });
    });
  });

  describe('uniqueEmail directive', function() {
    var $scope, testInput, querySpy, respondWith;

    // We are best to mock up the whole Users object this way because Users
    // relies on so many other services, including the MONGOLAB_CONFIG constant
    angular.module('test', []).factory('Users', function() {
      querySpy = jasmine.createSpy('query');
      querySpy.andCallFake(function(query, response) {
        // We capture the response so that the tests can call it with their own data
        respondWith = response;
      });
      return { query: querySpy };
    });
    beforeEach(module('test'));

    beforeEach(inject(function($compile, $rootScope){
      $scope = $rootScope;
      var element = angular.element(
        '<form name="form">' +
          '<input name="testInput" ng-model="model.testValue" unique-email>' +
        '</form>'
      );
      $compile(element)($scope);
      $scope.model = {};
      $scope.$digest();
      // Keep a reference to the test input for the tests
      testInput = $scope.form.testInput;
    }));
    it('should be valid initially', function() {
        expect(testInput.$valid).toBe(true);
    });
    it('should not call Users.query when the model changes', function() {
      $scope.model.testValue = 'different';
      $scope.$digest();
      expect(querySpy).not.toHaveBeenCalled();
    });
    it('should call Users.query when the view changes', function() {
      testInput.$setViewValue('different');
      expect(querySpy).toHaveBeenCalled();
    });
    it('should set model to invalid if the Users.query response contains users', function() {
      testInput.$setViewValue('different');
      respondWith(['someUser']);
      expect(testInput.$valid).toBe(false);
    });
    it('should set model to valid if the Users.query response contains no users', function() {
      testInput.$setViewValue('different');
      respondWith([]);
      expect(testInput.$valid).toBe(true);
    });
  });
});