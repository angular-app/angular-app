describe('securityRetryQueue', function() {
  var queue;

  function mockRetryItem() {
    return jasmine.createSpyObj('retryItem', ['retry', 'cancel']);
  }

  beforeEach(module('security.retryQueue'));

  beforeEach(inject(function($injector) {
    queue = $injector.get('securityRetryQueue');
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

  describe('pushRetryFn', function() {
    it('adds a new item to the queue', function() {
      queue.pushRetryFn(function() {});
      expect(queue.hasMore()).toBe(true);
    });
    it('adds a reason to the retry', function() {
      var reason = 'SOME_REASON';
      queue.pushRetryFn(reason, function() {});
      expect(queue.retryReason()).toBe(reason);
    });
    it('does not add a reason to the retry if not specified', function() {
      queue.pushRetryFn(function() {});
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
