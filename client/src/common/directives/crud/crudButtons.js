angular.module('directives.crud.buttons', [])

.directive('crudButtons', function () {
  return {
    restrict:'E',
    replace:true,
    template:
      '<div>' +
      '  <primary-button class="save" ng-disabled="!canSave()" ng-click="save()">Save</primary-button>' +
      '  <button class="btn-warning revert" ng-click="revertChanges()" ng-disabled="!canRevert()">Revert changes</button>'+
      '  <button class="btn-danger remove" ng-click="remove()" ng-show="canRemove()">Remove</button>'+
      '</div>'
  };
});