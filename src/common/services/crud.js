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

angular.module('services.crud').provider('routeCRUD', function () {

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

  this.defineRoutes = function($routeProvider, urlPrefix, partialPrefix, resourceName, additionalDeps, dataRetrievalDef) {
    //there is a bug in AngularJS where we can't specify dependencies for a provider in an array format thus we need to pass the $routeProvider in
    $routeProvider.when(urlPrefix, routeDefFactory(resourceName, partialPrefix, 'List', additionalDeps, dataRetrievalDef.listItems));
    $routeProvider.when(urlPrefix+'/new', routeDefFactory(resourceName, partialPrefix, 'Edit', additionalDeps, dataRetrievalDef.newItem));
    $routeProvider.when(urlPrefix+'/:itemId', routeDefFactory(resourceName, partialPrefix, 'Edit', additionalDeps, dataRetrievalDef.editItem));
  };

  this.$get = function () {
    //we are not interested in instances
    return {};
  };
});