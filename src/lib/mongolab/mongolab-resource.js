angular.module('mongolabResource', []).factory('$mongolabResource', ['$http', 'jsonFilter', 'API_KEY', 'DB_NAME', function ($http, jsonFilter, API_KEY, DB_NAME) {

  function MmongolabResourceFactory(collectionName) {

    var url = 'https://api.mongolab.com/api/1/databases/' + DB_NAME + '/collections/' + collectionName;
    var defaultParams = {apiKey:API_KEY};

    var Resource = function (data) {
      angular.extend(this, data);
    };

    Resource.all = function (cb, errorcb) {
      return Resource.query({}, cb, errorcb);
    };

    Resource.query = function (queryJson, cb, errorcb) {

      var params = angular.isObject(queryJson) ? {q:jsonFilter(queryJson)} : {};
      var httpPromise = $http.get(url, {params:angular.extend({}, defaultParams, params)});
      var scb = cb || angular.noop;
      var ecb = errorcb || angular.noop;

      return httpPromise.then(function (response) {
        var result = [];
        for (var i = 0; i < response.data.length; i++) {
          result.push(new Resource(response.data[i]));
        }
        scb(result, response.status, response.headers, response.config);
        return result;

      }, function (response) {
        ecb(undefined, response.status, response.headers, response.config);
        return undefined;
      });
    };

    Resource.getById = function (id, cb, errorcb) {
      var httpPromise = $http.get(url + '/' + id, {params:defaultParams});
      var scb = cb || angular.noop;
      var ecb = errorcb || angular.noop;

      return httpPromise.then(function (response) {
        var result = new Resource(response.data);
        scb(result, response.status, response.headers, response.config);
        return result;
      }, function (response) {
        ecb(undefined, response.status, response.headers, response.config);
        return undefined;
      });
    };

    //instance methods

    Resource.prototype.$id = function() {
      if (this._id && this._id.$oid) {
        return this._id.$oid;
      }
    };

    Resource.prototype.$save = function (cb, errorcb) {
      var httpPromise = $http.post(url, this, {params:defaultParams});
      var scb = cb || angular.noop;
      var ecb = errorcb || angular.noop;

      return httpPromise.then(function (response) {
        var result = new Resource(response.data);
        scb(result, response.status, response.headers, response.config);
        return result;
      }, function (response) {
        ecb(undefined, response.status, response.headers, response.config);
        return undefined;
      });
    };

    Resource.prototype.$update = function (cb, errorcb) {
      var httpPromise = $http.post(url + "/" + this.$id(), angular.extend({}, this, {_id:undefined}), {params:defaultParams});
      var scb = cb || angular.noop;
      var ecb = errorcb || angular.noop;

      return httpPromise.then(function (response) {
        var result = new Resource(response.data);
        scb(result, response.status, response.headers, response.config);
        return result;
      }, function (response) {
        ecb(undefined, response.status, response.headers, response.config);
        return undefined;
      });
    };

    Resource.prototype.$remove = function (cb, errorcb) {
      var httpPromise = $http['delete'](url + "/" + this.$id(), {params:defaultParams});
      var scb = cb || angular.noop;
      var ecb = errorcb || angular.noop;

      return httpPromise.then(function (response) {
        var result = new Resource(response.data);
        scb(result, response.status, response.headers, response.config);
        return result;
      }, function (response) {
        ecb(undefined, response.status, response.headers, response.config);
        return undefined;
      });
    };

    Resource.prototype.$saveOrUpdate = function (savecb, updatecb, errorSavecb, errorUpdatecb) {
      if (this.$id()) {
        return this.$update(updatecb, errorUpdatecb);
      } else {
        return this.$save(savecb, errorSavecb);
      }
    };

    return Resource;
  }
  return MmongolabResourceFactory;
}]);

//TODO: tests
//TODO: DRY
//TODO: make the first param to query optional
