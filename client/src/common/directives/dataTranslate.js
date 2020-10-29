/** This directive help us to set attribute on every element for supporting multi languages
 * Multi language for PlaceHolder,Button Value,Title,Alt of image
 * For every language we can create json file with key value structure . For example English.json,Persian.json
 * This way better than i18N , Because management of changes and added key is easier.
 * Hows it work :
 * For example : we set data-translate on span
 *
 * <span data-translate="DeliveryDate"></span>
 *
 * when you set this attribute , this directive read key from json file based on site language. For example
 * Site language set on Dutch and this directive read key from Dutch.json file and replace value of key
 */

/** Parameters must be in running site module section
 * localizationStrings array of include key and value of site language json file.
 * You must set this variable in running module with this structure :
 * You can tell me structure of site and added by me
 * $.ajax({
                url: 'Scripts/localization/Localization-' + langName + '.json',
                dataType: "json",
                type: "GET",
                success: function (data) {
                    localizationStrings = JSON.parse(JSON.stringify(data));
                    $scope.localizationInView = localizationStrings;
                    $scope.$apply();
                    $scope.$broadcast('localizeResourcesUpdated');
                    if (langName != "English" && !ss) {
                        $scope.$broadcast('allFunctionUpdated');
                        $scope.isFirstUrl = false;
                        $scope.$apply();
                    }
                }
            });

  Variation of using this directive :

  data-translate="DeliveryDate" -> For any text value
  data-translate="PLH_DeliveryDate" -> Translate placeholder
  data-translate="VAL_DeliveryDate" -> Translate button value
  data-translate="TTL_DeliveryDate" -> Translate title of element
  data-translate="ABB_DeliveryDate" -> Translate with short length of value
 */

angular.module("directives.crud.buttons", []).directive("translate", [
  function () {
    console.log("Hello");
    // var localizationStrings = []
    console.log("localizationStrings", localizationStrings);
    var i18nDirective = {
      restrict: "EAC",
      updateText: function (elm, token) {
        var values = token.split("|");
        for (var i = 0; i < values.length; i++) {
          if (values[i].substring(0, 4) == "PLH_") {
            angular
              .element(elm)
              .attr("placeholder", localizationStrings[values[i].substring(4)]);
          } else if (values[i].substring(0, 4) == "VAL_") {
            angular
              .element(elm)
              .attr("value", localizationStrings[values[i].substring(4)]);
          } else if (values[i].substring(0, 4) == "TTL_") {
            angular
              .element(elm)
              .attr("title", localizationStrings[values[i].substring(4)]);
          } else if (values[i].substring(0, 4) == "ALT_") {
            angular
              .element(elm)
              .attr("alt", localizationStrings[values[i].substring(4)]);
          } else if (values[i].substring(0, 4) == "ABB_") {
            var sArray = values[i].substring(4).split("-");
            if (localizationStrings[sArray[0]] != undefined) {
              angular
                .element(elm)
                .text(
                  localizationStrings[sArray[0]].length < parseInt(sArray[1])
                    ? localizationStrings[sArray[0]]
                    : localizationStrings[sArray[0]].substring(
                        0,
                        parseInt(sArray[1])
                      ) + "..."
                );
            }
          } else if (localizationStrings[values[i]] === undefined) {
            elm.text(values[i]);
          } else {
            elm.text(localizationStrings[values[i]]);
          }
        }
      },
      link: function (scope, elm, attrs) {
        scope.$on("localizeResourcesUpdated", function () {
          i18nDirective.updateText(elm, attrs.translate);
        });
        attrs.$observe("translate", function (value) {
          i18nDirective.updateText(elm, attrs.translate);
        });
      },
    };
    return i18nDirective;
  },
]);
