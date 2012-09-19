angular.module('services.util', []);
angular.module('services.util').factory('HTTPRequestTracker', ['$http', function($http){

  var HTTPRequestTracker = {};
  HTTPRequestTracker.hasPendingRequests = function() {
    return $http.pendingRequests.length > 0;
  };

  return HTTPRequestTracker;
}]);

angular.module('services.util').factory('CRUDScopeMixIn', function() {

  //probably should be named differently as there is no "read/list" involved
  var CRUDScopeMixIn = function (itemName, item, editFinishedFn) {

    //a copy as an instance memeber here, just not to expose it to a template, might change in the future
    var copy = angular.copy(item);
    this[itemName] = item;

    this.save = function() {
      //need to introduce an error handling function, probably just expose the error
      //can I even do it like this? I would be overriding methods on a prototype, right?
      //TODO: this probably won't flight, don't want to destroy the prototype on each call...
      //I could probably get rid of closures but then, need to have everything in a scope :-(
      //and how to test those things???
      //TODO: error handling
      this[itemName].$saveOrUpdate(editFinishedFn, editFinishedFn);
    };

    this.canSave = function () {
      //what about the form here? Do we want to just pass it in? I think we have to...
      return this.form.$valid && !angular.equals(this[itemName], copy);
    };

    this.revertChanges = function () {
      this[itemName] = angular.copy(copy);
    };

    this.canRevert = function () {
      return !angular.equals(this[itemName], copy);
    };

    this.remove = function () {
      if (this[itemName].$id()) {
        this[itemName].$remove(editFinishedFn);
      } else {
        editFinishedFn();
      }
    };
  };
  return CRUDScopeMixIn;

});