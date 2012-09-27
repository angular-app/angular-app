angular.module('signin', ['services.users'], ['$routeProvider', function($routeProvider){
  $routeProvider.when('/signin', {templateUrl:'signin/form.tpl.html', controller:'SignInCtrl'});
}]);

angular.module('signin').controller('SignInCtrl', ['$scope', '$location', 'Security', function ($scope, $location, Security) {

  $scope.user = {};
  $scope.authError = false;

  $scope.signIn = function () {
    $scope.authError = false;
    Security.authenticate($scope.user.email, $scope.user.password, function (user) {
      $location.path('/dashboard');
    }, function () {
      $scope.authError = true;
    });
  };

  $scope.clearForm = function () {
    $scope.user = {};
  };
}]);