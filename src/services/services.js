angular.module('services.users', ['mongolabResource']);

angular.module('services.users').factory('Users', ['$mongolabResource', function ($mongolabResource) {
  return $mongolabResource('users');
}]);

angular.module('services.users').factory('Roles', function () {
  return {
    po:{code:'po', name:'Product owner'},
    sm:{code:'sm', name:'Scrum master'},
    tm:{code:'tm', name:'Team member'}
  };
});

angular.module('services.projects', ['mongolabResource']);

angular.module('services.projects').factory('Projects', ['$mongolabResource', function ($mongolabResource) {
  return $mongolabResource('projects');
}]);