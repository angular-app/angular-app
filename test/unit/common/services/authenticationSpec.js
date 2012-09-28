describe('Authentication Service', function () {

  var $rootScope, callback, $httpBackend;

  beforeEach(module('services.authentication', 'ng'));
  beforeEach(inject(function($injector) {
    $rootScope = $injector.get('$rootScope');
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('GET', '/').respond(401,'');
    callback = jasmine.createSpy();
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
  });

  describe('Retry Queue', function() {
    it('does what it is supposed to do', function () {
      inject(function($http) {
        $http.get('/').then(function(result) {
          throw new Error('Should not get here.');
        }, function(error) {
          expect(error).toBe(402);
        });
        $httpBackend.flush();
      });
    });
  });
});