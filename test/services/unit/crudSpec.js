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
      var scopeMixIn = new CrudScopeMixInConstructor('item', item, angular.noop);
      expect(scopeMixIn.item).toEqual(item);
    });
  });

});