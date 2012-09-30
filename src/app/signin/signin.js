angular.module('signin', ['services.authentication','services.users']).controller('SignInCtrl', ['$scope', 'AuthenticationService', function ($scope, AuthenticationService) {

  $scope.user = {};
  $scope.authError = false;
  $scope.authService = AuthenticationService;

  $scope.clearForm = function () {
    $scope.user = {};
  };
}]);