describe('breadcrumbs', function () {

  var LocationMock = function (initialPath) {
    var pathStr = initialPath || '';

    this.path = function (pathArg) {
      return pathArg ? pathStr = pathArg : pathStr;
    };
  };

  beforeEach(function () {
    angular.module('test', ['services.breadcrumbs']).value('$location', new LocationMock());
  });
  beforeEach(module('test'));

  it('should have sensible defaults before route navigation', inject(function (breadcrumbs) {
    expect(breadcrumbs.getAll()).toEqual([]);
    expect(breadcrumbs.getFirst()).toEqual({});
  }));

  it('should not expose breadcrumbs before route change success', inject(function (breadcrumbs, $location) {
    $location.path('/some/path');
    expect(breadcrumbs.getAll()).toEqual([]);
    expect(breadcrumbs.getFirst()).toEqual({});
  }));

  it('should correctly parse $location() after route change success', inject(function (breadcrumbs, $location, $rootScope) {
    $location.path('/some/path');
    $rootScope.$broadcast('$routeChangeSuccess', {});
    expect(breadcrumbs.getAll()).toEqual([
      { name:'some', path:'/some' },
      { name:'path', path:'/some/path' }
    ]);
    expect(breadcrumbs.getFirst()).toEqual({name:'some', path:'/some'});
  }));

});