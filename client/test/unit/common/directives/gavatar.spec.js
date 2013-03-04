describe('directives.gravatar', function () {
  var element, scope;
  beforeEach(module('directives.gravatar'));
  beforeEach(inject(function($compile, $rootScope) {
    scope = $rootScope;
    scope.email = "pete@bacondarwin.com";
    element = $compile('<gravatar email="email" size="size" default-image="defaultImage" force-default="forceDefault"></gravatar>')(scope);
  }));
  it('should create an img tag with a valid gravatar url', function() {
    scope.$digest();
    expect(element.attr('src')).toBe("http://www.gravatar.com/avatar/9a952bcf6fd701bb1303cd9f64cf9620");
  });
  it('should append an s GET parameter if size is set', function () {
    scope.size = 200;
    scope.$digest();
    expect(element.attr('src')).toBe("http://www.gravatar.com/avatar/9a952bcf6fd701bb1303cd9f64cf9620?s=200");
  });
  it('should append a d GET parameter if default is set', function () {
    scope.defaultImage = 'monsterid';
    scope.$digest();
    expect(element.attr('src')).toBe("http://www.gravatar.com/avatar/9a952bcf6fd701bb1303cd9f64cf9620?d=monsterid");
  });
  it('should append a f=y GET parameter if force-default is set to true', function() {
    scope.forceDefault = true;
    scope.$digest();
    expect(element.attr('src')).toBe("http://www.gravatar.com/avatar/9a952bcf6fd701bb1303cd9f64cf9620?f=y");
  });
  it('should work with combinations of options', function () {
    scope.size = 200;
    scope.defaultImage = 'monsterid';
    scope.forceDefault = true;
    scope.$digest();
    expect(element.attr('src')).toContain("http://www.gravatar.com/avatar/9a952bcf6fd701bb1303cd9f64cf9620?");
    expect(element.attr('src')).toContain("f=y");
    expect(element.attr('src')).toContain("d=monsterid");
    expect(element.attr('src')).toContain("s=200");
  });
});