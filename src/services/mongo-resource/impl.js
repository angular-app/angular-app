angular.module('mongoResourceImpl', []).factory('mongoResourceImpl', ['$http', 'jsonFilter', function ($http, jsonFilter) {
  // A generic service that deals with the common logic between different MongoDB providers
  // @param {string=} collectionName - name of the MongoDB collection we are to manage
  // @param {string=} urlTemplate - the url of the db of the form: http://hostname/path/[[COLLECTION_NAME]]/morepath/, where [[COLLECTION_NAME]] will be replaced with the collectionName
  // @param {obj} defaultParams - an object containing additional query params to include in calls to the db (such as ApiKey).
  return function (collectionName, urlTemplate, defaultParams) {

    var url = urlTemplate.replace('[[COLLECTION_NAME]]',collectionName);
    defaultParams = defaultParams || {};

    var thenFactoryMethod = function (httpPromise, successcb, errorcb, isArray) {
      successcb = successcb || angular.noop;
      errorcb = errorcb || angular.noop;

      return httpPromise.then(function (response) {
        var result;
        if (isArray) {
          result = [];
          for (var i = 0; i < response.data.length; i++) {
            result.push(new Resource(response.data[i]));
          }
        } else {
          result = new Resource(response.data);
        }
        successcb(result, response.status, response.headers, response.config);
        return result;
      }, function (response) {
        errorcb(undefined, response.status, response.headers, response.config);
        return undefined;
      });
    };

    var Resource = function (data) {
      angular.extend(this, data);
    };

    Resource.all = function (cb, errorcb) {
      return Resource.query({}, cb, errorcb);
    };

    Resource.query = function (queryJson, successcb, errorcb) {
      var params = angular.isObject(queryJson) ? {q:jsonFilter(queryJson)} : {};
      var httpPromise = $http.get(url, {params:angular.extend({}, defaultParams, params)});
      return thenFactoryMethod(httpPromise, successcb, errorcb, true);
    };

    Resource.getById = function (id, successcb, errorcb) {
      var httpPromise = $http.get(url + '/' + id, {params:defaultParams});
      return thenFactoryMethod(httpPromise, successcb, errorcb);
    };

    //instance methods

    Resource.prototype.$id = function () {
      if (this._id && this._id.$oid) {
        return this._id.$oid;
      }
    };

    Resource.prototype.$save = function (successcb, errorcb) {
      var httpPromise = $http.post(url, this, {params:defaultParams});
      return thenFactoryMethod(httpPromise, successcb, errorcb);
    };

    Resource.prototype.$update = function (successcb, errorcb) {
      var httpPromise = $http.put(url + "/" + this.$id(), angular.extend({}, this, {_id:undefined}), {params:defaultParams});
      return thenFactoryMethod(httpPromise, successcb, errorcb);
    };

    Resource.prototype.$remove = function (successcb, errorcb) {
      var httpPromise = $http['delete'](url + "/" + this.$id(), {params:defaultParams});
      return thenFactoryMethod(httpPromise, successcb, errorcb);
    };

    Resource.prototype.$saveOrUpdate = function (savecb, updatecb, errorSavecb, errorUpdatecb) {
      if (this.$id()) {
        return this.$update(updatecb, errorUpdatecb);
      } else {
        return this.$save(savecb, errorSavecb);
      }
    };

    return Resource;
  };
}]);
