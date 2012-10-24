angular.module('services.crud', []);
angular.module('services.crud').factory('crudEditMethods', function () {

  return function (itemName, item, formName, successcb, errorcb) {

    var mixin = {};

    mixin[itemName] = item;
    mixin[itemName+'Copy'] = angular.copy(item);

    mixin.save = function () {
      this[itemName].$saveOrUpdate(successcb, successcb, errorcb, errorcb);
    };

    mixin.canSave = function () {
      return this[formName].$valid && !angular.equals(this[itemName], this[itemName+'Copy']);
    };

    mixin.revertChanges = function () {
      this[itemName] = angular.copy(this[itemName+'Copy']);
    };

    mixin.canRevert = function () {
      return !angular.equals(this[itemName], this[itemName+'Copy']);
    };

    mixin.remove = function () {
      if (this[itemName].$id()) {
        this[itemName].$remove(successcb, errorcb);
      } else {
        successcb();
      }
    };

    mixin.canRemove = function() {
      return item.$id();
    };

    /**
     * Get the CSS classes for this item, to be used by the ng-class directive
     * @return {object} A hash where each key is a CSS class and the corresponding value is true if the class is to be applied.
     */
    mixin.getCssClasses = function() {
      var ngModelContoller = this[formName][itemName];
      return {
        error: ngModelContoller.$invalid && ngModelContoller.$dirty,
        success: ngModelContoller.$valid && ngModelContoller.$dirty
      };
    };

    /**
     * Whether to show an error message for the specified error
     * @param  {string} error - The name of the error as given by a validation directive
     * @return {Boolean} true if the error should be shown
     */
    mixin.showError = function(error) {
      return this[formName][itemName].$error[error];
    };

    return mixin;
  };
});

angular.module('services.crud').factory('crudListMethods', ['$location', function ($location) {

  return function (pathPrefix) {

    var mixin = {};

    mixin['new'] = function () {
      $location.path(pathPrefix+'/new');
    };

    mixin['edit'] = function (itemId) {
      $location.path(pathPrefix+'/'+itemId);
    };

    return mixin;
  };
}]);

(function() {
  function routeCRUDProvider($routeProvider) {

    var routeResolveFactory = function (dependencies, resolveFunctions) {
      var resolve = {};
      angular.forEach(resolveFunctions, function(fn, resolveDepName){
        var resolveDepsAndFn = angular.copy(dependencies);
        resolveDepsAndFn.push('$route');
        resolveDepsAndFn.push(fn);
        resolve[resolveDepName] = resolveDepsAndFn;
      });
      return resolve;
    };

    var routeDefFactory = function (resourceName, partialPrefix, resourceOperationType, additionalDeps, resolveFactoryFns) {
      return {
        templateUrl:partialPrefix+'/'+resourceName.toLowerCase()+'-'+resourceOperationType.toLowerCase()+'.tpl.html',
        controller:resourceName+resourceOperationType +'Ctrl',
        resolve:routeResolveFactory([resourceName].concat(additionalDeps), resolveFactoryFns)
      };
    };

    this.defineRoutes = function(urlPrefix, partialPrefix, resourceName, additionalDeps, dataRetrievalDef) {
      $routeProvider.when(urlPrefix, routeDefFactory(resourceName, partialPrefix, 'List', additionalDeps, dataRetrievalDef.listItems));
      $routeProvider.when(urlPrefix+'/new', routeDefFactory(resourceName, partialPrefix, 'Edit', additionalDeps, dataRetrievalDef.newItem));
      $routeProvider.when(urlPrefix+'/:itemId', routeDefFactory(resourceName, partialPrefix, 'Edit', additionalDeps, dataRetrievalDef.editItem));
    };

    this.$get = function () {
      //we are not interested in instances
      return {};
    };
  }
  routeCRUDProvider.$inject = ['$routeProvider'];

  angular.module('services.crud').provider('routeCRUD', routeCRUDProvider);
})();