describe('AuthenticationRetryQueue', function() {
  var queue;

  function mockRetryItem() {
    return jasmine.createSpyObj('retryItem', ['retry', 'cancel']);
  }

  beforeEach(module('services.authentication.retry-queue'));

  beforeEach(inject(function($injector) {
    queue = $injector.get('AuthenticationRetryQueue');
  }));

  it('initially has no items to retry', function() {
    expect(queue.hasMore).toBeDefined();
    expect(queue.hasMore()).toBe(false);
  });

  it('has more items once one has been pushed', function() {
    queue.push(mockRetryItem());
    expect(queue.hasMore()).toBe(true);
  });

  it('has no more items once all items have been got', function() {
    queue.push(mockRetryItem());
    var next = queue.getNext();
    expect(queue.hasMore()).toBe(false);
  });

  describe('retry', function() {
    it('should not fail if the queue is empty', function(){
      queue.retry(function(item) {});
    });
    it('should empty the queue', function() {
      queue.push(mockRetryItem());
      queue.push(mockRetryItem());
      queue.push(mockRetryItem());
      expect(queue.hasMore()).toBe(true);
      queue.retry(function(item) {});
      expect(queue.hasMore()).toBe(false);
    });
  });
  
});
