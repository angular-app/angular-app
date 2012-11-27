describe('button directive', function () {
  beforeEach(module('directives.button'));

  it('adds a "btn" class to button elements', function() {
    inject(function($compile, $rootScope) {
      var element = $compile('<button></button>')($rootScope);
      expect(element.hasClass('btn')).toBe(true);
    });
  });
});