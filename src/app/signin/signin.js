angular.module('signin', ['services.authentication', 'services.users']).controller('SignInCtrl', ['$scope', 'AuthenticationService', function($scope, AuthenticationService) {

  $scope.user = {};
  $scope.authError = false;
  $scope.authService = AuthenticationService;

  $scope.clearForm = function() {
    $scope.user = {};
  };

  // Get the current user when the controller is instantiated - this could be put in the main app controller so that it is only called once??
  AuthenticationService.requestCurrentUser();

}]);