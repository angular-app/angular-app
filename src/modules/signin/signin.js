angular.module('signin', ['services.users'], ['$routeProvider', function($routeProvider){
  $routeProvider.when('/signin', {templateUrl:'signin/partials/form.tpl.html', controller:'SignInCtrl'});
}]);

angular.module('signin').controller('SignInCtrl', ['$scope', '$location', 'Security', function ($scope, $location, Security) {

  $scope.user = {};
  $scope.authError = false;

  $scope.signIn = function () {
    $scope.authError = false;
    Security.authenticate($scope.user.login, $scope.user.password, function (user) {
      $location.path('/dashboard');
    }, function () {
      $scope.authError = true;
    });
  };

  $scope.clearForm = function () {
    $scope.user = {};
  };
}]);