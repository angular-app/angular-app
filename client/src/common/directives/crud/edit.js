angular.module('directives.crud.edit', [])

.directive('crudEdit', ['$parse', function($parse) {
  return {
    scope: true,
    require: '^form',
    link: function(scope, element, attrs, form) {
      var resourceName = attrs.crudEdit;
      var resource = scope[resourceName];
      var original = angular.copy(resource);

      var makeFn = function(name) {
        var fn = scope.$parent.$eval(attrs[name]);
        if ( !angular.isFunction(fn) ) {
          throw new Error('crudEdit directive: The attribute "' + name + '" must evaluate to a function');
        }
        return fn;
      };

      // Set up callbacks with fallback
      // onSave attribute -> onSave scope -> noop
      var onSave = attrs.onSave ? makeFn('onSave') : ( scope.onSave || angular.noop );
      // onRemove attribute -> onRemove scope -> onSave attribute -> onSave scope -> noop
      var onRemove = attrs.onRemove ? makeFn('onRemove') : ( scope.onRemove || onSave );
      // onError attribute -> onError scope -> noop
      var onError = attrs.onError ? makeFn('onError') : ( scope.onError || angular.noop );


      scope.save = function() {
        resource.$saveOrUpdate(onSave, onSave, onError, onError);
      };

      scope.canSave = function() {
        return form.$valid && !angular.equals(resource, original);
      };

      scope.revertChanges = function() {
        resource = scope[resourceName] = angular.copy(original);
      };

      scope.canRevert = function() {
        return !angular.equals(resource, original);
      };

      scope.remove = function() {
        if(resource.$id()) {
          resource.$remove(onRemove, onError);
        } else {
          onRemove();
        }
      };

      scope.canRemove = function() {
        return resource.$id();
      };

      /**
       * Get the CSS classes for this item, to be used by the ng-class directive
       * @param {string} fieldName The name of the field on the form, for which we want to get the CSS classes
       * @return {object} A hash where each key is a CSS class and the corresponding value is true if the class is to be applied.
       */
      scope.getCssClasses = function(fieldName) {
        var ngModelContoller = form[fieldName];
        return {
          error: ngModelContoller.$invalid && !angular.equals(resource, original),
          success: ngModelContoller.$valid && !angular.equals(resource, original)
        };
      };

      /**
       * Whether to show an error message for the specified error
       * @param {string} fieldName The name of the field on the form, of which we want to know whether to show the error
       * @param  {string} error - The name of the error as given by a validation directive
       * @return {Boolean} true if the error should be shown
       */
      scope.showError = function(fieldName, error) {
        return form[fieldName].$error[error];
      };
    }
  };
}]);