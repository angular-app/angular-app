describe('authenticationRetryQueue', function() {
  var queue;

  function mockRetryItem() {
    return jasmine.createSpyObj('retryItem', ['retry', 'cancel']);
  }

  beforeEach(module('authentication.retryQueue'));

  beforeEach(inject(function($injector) {
    queue = $injector.get('authenticationRetryQueue');
  }));

  describe('hasMore', function() {
    it('initially has no items to retry', function() {
      expect(queue.hasMore).toBeDefined();
      expect(queue.hasMore()).toBe(false);
    });

    it('has more items once one has been pushed', function() {
      queue.push(mockRetryItem());
      expect(queue.hasMore()).toBe(true);
    });
  });

  describe('pushPromiseFn', function() {
    it('adds a new item to the queue', function() {
      queue.pushPromiseFn(function() {});
      expect(queue.hasMore()).toBe(true);
    });
    it('adds a reason to the retry if specified', function() {
      var reason = 'SOME_REASON';
      queue.pushPromiseFn(function() {}, reason);
      expect(queue.retryReason()).toBe(reason);
    });
    it('does not add a reason to the retry if not specified', function() {
      queue.pushPromiseFn(function() {});
      expect(queue.retryReason()).not.toBeDefined();
    });
  });

  describe('retryAll', function() {
    it('should not fail if the queue is empty', function(){
      queue.retryAll(function(item) {});
    });
    it('should empty the queue', function() {
      queue.push(mockRetryItem());
      queue.push(mockRetryItem());
      queue.push(mockRetryItem());
      expect(queue.hasMore()).toBe(true);
      queue.retryAll(function(item) {});
      expect(queue.hasMore()).toBe(false);
    });
  });

  describe('cancelAll', function() {
    it('should empty the queue', function() {
      queue.push(mockRetryItem());
      queue.push(mockRetryItem());
      queue.push(mockRetryItem());
      expect(queue.hasMore()).toBe(true);
      queue.cancelAll(function(item) {});
      expect(queue.hasMore()).toBe(false);
    });
  });
  
});
