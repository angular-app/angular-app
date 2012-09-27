angular.module('directives.crud', []);

//TODO: does it make any sense to create an isolated scope here? Somehow a ngInclude would do the trick but is not that cool :-)
angular.module('directives.crud').directive('crudButtons', function () {
  return {
    restrict:'E',
    replace:true,
    template:
      '<div>' +
      '  <button type="button" class="btn btn-primary" ng-disabled="!canSave()" ng-click="save()">Save</button>' +
      '  <button type="button" class="btn btn-warning" ng-click="revertChanges()" ng-disabled="!canRevert()">Revert changes</button>'+
      '  <button type="button" class="btn btn-danger" ng-click="remove()" ng-show="canRemove()">Remove</button>'+
      '</div>'
  };
});