angular.module('backendResource', ['mongoResourceImpl']).factory('mongoResource', ['mongoResourceImpl', function (mongoResourceImpl) {
  return function(collectionName) {
    return mongoResourceImpl(collectionName, '/databases/[[COLLECTION_NAME]]');
  };
}]);
