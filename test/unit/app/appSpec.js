describe('hello world scenario', function () {

  var scope, $controller;

  beforeEach(module('app'));
  beforeEach(inject(function (_$rootScope_, _$controller_) {
    scope = _$rootScope_.$new();
    $controller = _$controller_;
  }));
});