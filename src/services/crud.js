angular.module('services.crud', []);
angular.module('services.crud').factory('CRUDScopeMixIn', function () {

  var CRUDScopeMixIn = function (itemName, item, formName, successcb, errorcb) {

    //a copy as an instance memeber here, just not to expose it to a template, might change in the future
    var copy = angular.copy(item);
    this[itemName] = item;

    this.save = function () {
      this[itemName].$saveOrUpdate(successcb, successcb, errorcb, errorcb);
    };

    this.canSave = function () {
      return this[formName].$valid && !angular.equals(this[itemName], copy);
    };

    this.revertChanges = function () {
      this[itemName] = angular.copy(copy);
    };

    this.canRevert = function () {
      return !angular.equals(this[itemName], copy);
    };

    this.remove = function () {
      if (this[itemName].$id()) {
        this[itemName].$remove(successcb, errorcb);
      } else {
        successcb();
      }
    };

    this.canRemove = function() {
      return item.$id();
    };
  };
  return CRUDScopeMixIn;

});