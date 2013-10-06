describe('uniqueEmail directive', function() {
  var Users, $scope, form;

  function setTestValue(value) {
    $scope.model.testValue = value;
    $scope.$digest();
  }

  beforeEach(function() {
    // Mockup Users resource
    angular.module('mock-Users', []).factory('Users', function() {
      Users = jasmine.createSpyObj('Users', ['query']);
      return Users;
    });
  });
  
  beforeEach(module('admin-users-edit-uniqueEmail', 'mock-Users'));

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