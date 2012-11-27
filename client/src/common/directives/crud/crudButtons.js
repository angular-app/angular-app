angular.module('directives.crud.buttons', [])

.directive('crudButtons', function () {
  return {
    restrict:'E',
    replace:true,
    template:
      '<div>' +
      '  <button class="btn-primary save" ng-disabled="!canSave()" ng-click="save()">Save</button>' +
      '  <button class="btn-warning revert" ng-click="revertChanges()" ng-disabled="!canRevert()">Revert changes</button>'+
      '  <button class="btn-danger remove" ng-click="remove()" ng-show="canRemove()">Remove</button>'+
      '</div>'
  };
});