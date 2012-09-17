angular.module('mongolabResource', ['ngResource']).factory('$mongolabResource', ['$resource', 'API_KEY', 'DB_NAME', 'jsonFilter', function ($resource, API_KEY, DB_NAME, jsonFilter) {

    function MmongolabResourceFactory(collectionName) {

      var resource = $resource('https://api.mongolab.com/api/1/databases/' + DB_NAME + '/collections/' + collectionName + '/:id',
        { apiKey:API_KEY, id:'@_id.$oid'}, { update:{ method:'PUT' } }
      );

      resource.getById = function (id, cb, errorcb) {
        return resource.get({id:id}, cb, errorcb);
      };

      var query = resource.query;
      resource.query = function (queryJson, cb, errorcb) {
        var q = angular.isObject(queryJson) ? {q:jsonFilter(queryJson)} : {};
        return query(q, cb, errorcb);
      };

      resource.prototype.update = function (cb, errorcb) {
        return resource.update({id:this._id.$oid}, angular.extend({}, this, {_id:undefined}), cb, errorcb);
      };

      resource.prototype.saveOrUpdate = function (savecb, updatecb, errorSavecb, errorUpdatecb) {
        if (this._id && this._id.$oid) {
          return this.update(updatecb, errorUpdatecb);
        } else {
          return this.$save(savecb, errorSavecb);
        }
      };

      resource.prototype.remove = function (cb, errorcb) {
        return resource.remove({id:this._id.$oid}, cb, errorcb);
      };

      resource.prototype['delete'] = function (cb, errorcb) {
        return this.remove(cb, errorcb);
      };

      return resource;
    }

    return MmongolabResourceFactory;
}]);