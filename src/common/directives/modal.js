angular.module('directives.modal', []).directive('modal', ['$parse', function($parse){
  var directive = {
    restrict: 'C',
    link: function($scope, $element, $attrs, $controller){
      var showFn = $parse($attrs.show);

      if ( !$element.modal ) {
        throw new Error("Modal directive requires Twitter Bootstrap Modal library");
      }

      $element.modal({ backdrop: $attrs.backdrop, keyboard: $attrs.keyboard, show: showFn($scope) });

      $scope.$watch($attrs.show, function(value) {
        if ( value ) {
          $element.modal('show');
        } else {
          $element.modal('hide');
        }
      });
    }
  };
  return directive;
}]);