describe('button directive', function () {
  beforeEach(module('directives.button'));

  it('adds a "btn" class to the button element', function() {
    inject(function($compile, $rootScope) {
      var element = $compile('<button></button>')($rootScope);
      expect(element.hasClass('btn')).toBe(true);
    });
  });
});

describe('primaryButton directive', function () {
  var element;
  beforeEach(module('directives.button'));
  beforeEach(function() {
    inject(function($compile, $rootScope) {
      element = $compile('<primary-button></primary-button>')($rootScope);
    });
  });

  it('replaces the directive element with a button element', function() {
    expect(element[0].localName).toBe('button');
  });

  it('adds a "btn-primary" class to the button element', function() {
    expect(element.hasClass('btn')).toBe(true);
  });

  it('adds a "btn" class to button elements (because it is a button!)', function() {
    expect(element.hasClass('btn')).toBe(true);
  });
});
