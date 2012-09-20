angular.module('services.crud', []);
angular.module('services.crud').factory('CRUDScopeMixIn', function () {

  //probably should be named differently as there is no "read/list" involved
  var CRUDScopeMixIn = function (itemName, item, editFinishedFn) {

    //a copy as an instance memeber here, just not to expose it to a template, might change in the future
    var copy = angular.copy(item);
    this[itemName] = item;

    this.save = function () {
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
        //TODO: error handling
        this[itemName].$remove(editFinishedFn);
      } else {
        editFinishedFn();
      }
    };
  };
  return CRUDScopeMixIn;

});