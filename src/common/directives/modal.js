angular.module('directives.modal', []).directive('modal', [function(){
  var directive = {
    restrict: 'C',
    link: function($scope, $element, $attrs, $controller){
      if ( !$element.modal ) {
        throw new Error("Modal directive requires Twitter Bootstrap Modal library");
      }
      $element.modal({ backdrop: $attrs.backdrop, keyboard: $attrs.keyboard, show: false });
      $scope.$watch($attrs.show, function(value) {
        console.log(value);
        $element.modal(value ? 'show' : 'hide');
      });
    }
  };
  return directive;
}]);