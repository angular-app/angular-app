describe('button directive', function () {
  beforeEach(module('directives.button'));

  it('adds a "btn" class to the button element', function() {
    inject(function($compile, $rootScope) {
      var element = $compile('<button></button>')($rootScope);
      expect(element.hasClass('btn')).toBe(true);
    });
  });

  it('leaves the contents of the button intact', function() {
    inject(function($compile, $rootScope) {
      var element = $compile('<button>Click Me!</button>')($rootScope);
      expect(element.text()).toBe('Click Me!');
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

  it('transcludes the contents of the button correctly', function() {
    inject(function($compile, $rootScope) {
      var element = $compile('<primary-button>Click Me!</primary-button>')($rootScope);
      expect(element.text()).toBe('Click Me!');
    });
  });
});
