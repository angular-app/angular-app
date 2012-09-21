describe('CRUD scope mix-in', function () {

  var $rootScope, CrudScopeMixInConstructor;

  beforeEach(module('services.crud'));
  beforeEach(inject(function (_$rootScope_, CRUDScopeMixIn) {
    $rootScope = _$rootScope_;
    CrudScopeMixInConstructor = CRUDScopeMixIn;
  }));

  describe('scope init', function () {
    it('should initialize a scope with an item', function () {
      var item = {key:'value'};
      var scopeMixIn = new CrudScopeMixInConstructor('item', item, 'form', angular.noop);
      expect(scopeMixIn.item).toEqual(item);
    });
  });

  describe('copy and revert changes', function () {

    var item, scopeMixIn;
    beforeEach(function () {
      item = {key:'value'};
      scopeMixIn = new CrudScopeMixInConstructor('item', item, 'form', angular.noop);
    });

    it('should correctly detect when revert is possible', function () {
      expect(scopeMixIn.canRevert()).toBeFalsy();
      scopeMixIn.item.key = 'changed';
      expect(scopeMixIn.canRevert()).toBeTruthy();
    });

    it('should make it possible to revert changes', function () {
      scopeMixIn.item.key = 'changed';
      expect(scopeMixIn.item).toEqual({key:'changed'});

      scopeMixIn.revertChanges();
      expect(scopeMixIn.item).toEqual({key:'value'});
    });

    it('should not revert anything if there were no changes', function () {
      scopeMixIn.revertChanges();
      expect(scopeMixIn.item).toEqual({key:'value'});
    });
  });

  describe('save and update', function () {

    var item, scope;
    beforeEach(inject(function ($rootScope) {
      item = {key:'value'};
      scope = $rootScope;
      angular.extend(scope, new CrudScopeMixInConstructor('item', item, 'form', angular.noop));
    }));
    it('should not be possible to save if there were no changes', function () {
      scope.form = { $valid : true};
      expect(scope.canSave()).toBeFalsy();
    });
    it('should not be possible to save if a form is invalid', function () {
      scope.form = { $valid : false};
      scope.item = {key : 'changed'};
      expect(scope.canSave()).toBeFalsy();
    });
    it('should be possible to save only if there were changes and a form is valid', function () {
      scope.form = { $valid : true};
      scope.item = {key : 'changed'};
      expect(scope.canSave()).toBeTruthy();
    });
    it('should invoke the $saveOrUpdate method on an item with callback arguments on save', function () {
      //TODO: need to learn how to use spays and make sure that those are invoked with different functions for the ok / error
    });
  });

  describe('remove', function () {

  });

});