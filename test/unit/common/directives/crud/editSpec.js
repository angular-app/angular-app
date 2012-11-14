describe('crud-edit directive', function () {
  var resourceMock;

  beforeEach(module('directives.crud.edit'));
  beforeEach(function() {
    resourceMock = jasmine.createSpyObj('resource', ['$saveOrUpdate', '$remove']);
  });

  it('requires a form element', function() {
    inject(function($compile, $rootScope) {
      expect(function() {
        $compile('<form crud-edit></form>')($rootScope);
      }).not.toThrow();
      expect(function() {
        $compile('<div crud-edit></div>')($rootScope);
      }).toThrow();
    });
  });

  it('should attach methods to the scope', function() {
    inject(function($compile, $rootScope) {
      var element = $compile('<form crud-edit></form>')($rootScope);
      expect($rootScope.save).toBeDefined();
      expect($rootScope.canSave).toBeDefined();
      expect($rootScope.revertChanges).toBeDefined();
      expect($rootScope.canRevert).toBeDefined();
      expect($rootScope.remove).toBeDefined();
      expect($rootScope.canRemove).toBeDefined();
      expect($rootScope.getCssClasses).toBeDefined();
      expect($rootScope.showError).toBeDefined();
    });
  });

  it('scope.save should call resource.$saveOrUpdate', function() {
    inject(function($compile, $rootScope) {
      $rootScope.resource = resourceMock;
      var element = $compile('<form crud-edit="resource"></form>')($rootScope);
      $rootScope.save();
      expect(resourceMock.$saveOrUpdate).toHaveBeenCalled();
    });
  });

  it('scope.remove should call resource.$remove if resource.$id returns true', function() {
    inject(function($compile, $rootScope) {
      resourceMock.$id = jasmine.createSpy('$id').andReturn(true);
      $rootScope.resource = resourceMock;
      var element = $compile('<form crud-edit="resource"></form>')($rootScope);
      $rootScope.remove();
      expect(resourceMock.$remove).toHaveBeenCalled();
    });
  });

  it('scope.remove should call resource.$remove if resource.$id returns false', function() {
    inject(function($compile, $rootScope) {
      resourceMock.$id = jasmine.createSpy('$id').andReturn(false);
      $rootScope.resource = resourceMock;
      var element = $compile('<form crud-edit="resource"></form>')($rootScope);
      $rootScope.remove();
      expect(resourceMock.$remove).not.toHaveBeenCalled();
    });
  });
});