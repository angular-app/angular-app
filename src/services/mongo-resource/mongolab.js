angular.module('mongolabResource', ['mongoResourceImpl']).factory('mongoResource', ['API_KEY', 'DB_NAME','mongoResourceImpl', function (API_KEY, DB_NAME, mongoResourceImpl) {
  return function(collectionName) {
    return mongoResourceImpl(collectionName, 'https://api.mongolab.com/api/1/databases/' + DB_NAME + '/collections/[[COLLECTION_NAME]]', { apiKey: API_KEY });
  };
}]);