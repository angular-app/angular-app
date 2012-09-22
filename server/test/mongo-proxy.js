var mongoProxyFactory = require('../lib/mongo-proxy');

exports.testUrlMap = function(test) {
  test.ok(!!mongoProxyFactory);

  var proxy = mongoProxyFactory('','','','');
  test.ok(!!proxy);

  test.ok(!!proxy.mapUrl, 'mapUrl');

  //proxy.mapUrl('http://localhost:3000/db/users?q=%7B%7D');
  test.done();

};