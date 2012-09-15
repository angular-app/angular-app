describe('<%=module%> scenario', function () {

  var $scope;

  beforeEach(module('<%=module%>'));
  beforeEach(inject(function (_$rootScope_) {
    $scope = _$rootScope_.$new();
  }));

  it('should be OK', function () {

  });
});