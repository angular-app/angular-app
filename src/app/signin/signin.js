angular.module('signin', ['services.authentication','services.users']).controller('SignInCtrl', ['$scope', 'AuthenticationService', function ($scope, AuthenticationService) {

  $scope.user = {};
  $scope.authError = false;
  $scope.showLogin = false;

  $scope.$watch(function() {
    return AuthenticationService.isLoginRequired();
  }, function(newValue,oldValue) {
    $scope.showLogin = newValue;
  });

  $scope.login = function () {
    AuthenticationService.login($scope.user);
  };

  $scope.clearForm = function () {
    $scope.user = {};
  };
}]);