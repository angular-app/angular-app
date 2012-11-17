angular.module('mongolabResource', []).factory('mongolabResource', ['MONGOLAB_CONFIG','$http', '$q', function (MONGOLAB_CONFIG, $http, $q) {

  function MongolabResourceFactory(collectionName) {

    var url = MONGOLAB_CONFIG.baseUrl + MONGOLAB_CONFIG.dbName + '/collections/' + collectionName;
    var defaultParams = {};
    if (MONGOLAB_CONFIG.apiKey) {
      defaultParams.apiKey = MONGOLAB_CONFIG.apiKey;
    }
    
    var thenFactoryMethod = function (httpPromise, successcb, errorcb, isArray) {
      var scb = successcb || angular.noop;
      var ecb = errorcb || angular.noop;

      return httpPromise.then(function (response) {
        var result;
        if (isArray) {
          result = [];
          for (var i = 0; i < response.data.length; i++) {
            result.push(new Resource(response.data[i]));
          }
        } else {
          //MongoLab has rather peculiar way of reporting not-found items, I would expect 404 HTTP response status...
          if (response.data === " null "){
            return $q.reject({
              code:'resource.notfound',
              collection:collectionName
            });
          } else {
            result = new Resource(response.data);
          }
        }
        scb(result, response.status, response.headers, response.config);
        return result;
      }, function (response) {
        ecb(undefined, response.status, response.headers, response.config);
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
      var params = angular.isObject(queryJson) ? {q:JSON.stringify(queryJson)} : {};
      var httpPromise = $http.get(url, {params:angular.extend({}, defaultParams, params)});
      return thenFactoryMethod(httpPromise, successcb, errorcb, true);
    };

    Resource.getById = function (id, successcb, errorcb) {
      var httpPromise = $http.get(url + '/' + id, {params:defaultParams});
      return thenFactoryMethod(httpPromise, successcb, errorcb);
    };

    Resource.getByIds = function (ids, successcb, errorcb) {
      var qin = [];
      angular.forEach(ids, function (id) {
         qin.push({$oid: id});
      });
      return Resource.query({_id:{$in:qin}}, successcb, errorcb);
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
  }
  return MongolabResourceFactory;
}]);
