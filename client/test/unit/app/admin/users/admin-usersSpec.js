describe('admin users', function () {

  var $scope;
  var $controller;
  beforeEach(module('admin-users'));
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
      $scope.onSave();
      expect(params.i18nNotifications.pushForNextRoute).toHaveBeenCalled();
      expect(params.$location.path).toHaveBeenCalled();
    });

    it('should set updateError in onError', function() {
      $scope.onError();
      expect(params.i18nNotifications.pushForCurrentRoute).toHaveBeenCalled();
    });
  });

  describe('validateEquals directive', function() {
    var element;
    beforeEach(inject(function($compile) {
      // we might move this tpl into an html file as well...
      element = angular.element(
        '<form name="form"><input name="testInput" ng-model="model.testValue" validate-equals="model.compareTo"></form>'
      );
      $scope.model = {
        testValue: '',
        compareTo: ''
      };
      $compile(element)($scope);
      $scope.$digest();
    }));

    describe('model validity', function() {
      it('should be valid initially', function() {
        expect($scope.form.testInput.$valid).toBe(true);
      });
      it('should be invalid if the model changes', function() {
        $scope.model.testValue = "different";
        $scope.$digest();
        expect($scope.form.testInput.$valid).toBe(false);
      });
      it('should be invalid if the reference model changes', function() {
        $scope.model.compareTo = "different";
        $scope.$digest();
        expect($scope.form.testInput.$valid).toBe(false);
      });
      it('should be valid if the model changes to be the same as the reference', function() {
        $scope.model.compareTo = "different";
        $scope.$digest();
        expect($scope.form.testInput.$valid).toBe(false);
        $scope.model.testValue = "different";
        $scope.$digest();
        expect($scope.form.testInput.$valid).toBe(true);
      });
    });
  });

  describe('uniqueEmail directive', function() {

  });
});