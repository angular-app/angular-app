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

angular.module('services.crud').provider('routeCRUD', function () {

  var routeResolveFactory = function (dependencies, resolveFunctions) {
    var resolve = {};
    angular.forEach(resolveFunctions, function(fn, resolveDepName){
      var resolveDepsAndFn = angular.copy(dependencies);
      resolveDepsAndFn.push(fn);
      resolve[resolveDepName] = resolveDepsAndFn;
    });
    return resolve;
  };

  var routeDefFactory = function (resourceName, partialPrefix, resourceOperationType, dependencies, resolveFactoryFns) {
    return {
      templateUrl:partialPrefix+'/partials/'+resourceName.toLowerCase()+'-'+resourceOperationType.toLowerCase()+'.tpl.html',
      controller:resourceName+resourceOperationType +'Ctrl',
      resolve:routeResolveFactory(dependencies, resolveFactoryFns)
    };
  };

  this.defineRoutes = function($routeProvider, urlPrefix, partialPrefix, resourceName, dependencies, dataRetrievalDef) {
    //there is a bug in AngularJS where we can't specify dependencies for a provider in an array format thus we need to pass the $routeProvider in
    $routeProvider.when(urlPrefix, routeDefFactory(resourceName, partialPrefix, 'List', dependencies, dataRetrievalDef.listItems));
    $routeProvider.when(urlPrefix+'/new', routeDefFactory(resourceName, partialPrefix, 'Edit', dependencies, dataRetrievalDef.newItem));
    $routeProvider.when(urlPrefix+'/:itemId', routeDefFactory(resourceName, partialPrefix, 'Edit', dependencies, dataRetrievalDef.editItem));
  };

  this.$get = function () {
    //we are not interested in instances
    return {};
  };
});