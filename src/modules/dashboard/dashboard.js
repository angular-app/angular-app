angular.module('dashboard',['services.projects'], ['$routeProvider', function($routeProvider){
  $routeProvider.when('/dashboard', {
    templateUrl:'dashboard/partials/dashboard.tpl.html',
    controller:'DashboardCtrl',
    resolve:{
      projects:['Projects', function (Projects) {
        //TODO: this should be taken from the server side: the current user etc., leaving like this waiting for auth
        return Projects.forUser('5054ae7be4b023b611d2e122');
      }]
    }
  });
}]);

angular.module('dashboard').controller('DashboardCtrl', ['$scope', '$location', 'projects', function($scope, $location, projects){
  //projects for the sign-in user
  $scope.projects = projects;

  $scope.showProject = function (projectId) {
     $location.path('/projects/'+projectId);
  };
}]);