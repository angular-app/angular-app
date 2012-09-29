angular.module('signin', ['services.authentication','services.users']).controller('SignInCtrl', ['$scope', '$http', 'AuthenticationService', function ($scope, $http, AuthenticationService) {

  $scope.user = {};
  $scope.authError = false;
  $scope.needsLogin = false;

  $scope.$watch(function() { return AuthenticationService.isLoginRequired(); }, function(newValue,oldValue) { $scope.needsLogin = newValue; });

  $scope.signIn = function () {
    console.log($scope.user);
    $http.post('/login', $scope.user).success(function() {
      console.log('logged in');
      AuthenticationService.loginConfirmed();
    });
  };

  $scope.clearForm = function () {
    $scope.user = {};
  };
}]);