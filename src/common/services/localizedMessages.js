angular.module('services.localizedMessages', []).factory('localizedMessages', ['$locale', '$interpolate', 'I18N.MESSAGES', 'I18N.DEFAULT_LOCALE', function ($locale, $interpolate, i18nmessages, i18ndefaultLocale) {

  var defaultLocale = i18ndefaultLocale;
  var getForLocale = function(locale, msgKey, handleNotFound) {
    return (i18nmessages[locale] || {})[msgKey];
  };

  var handleNotFound = function(msg, msgKey) {
    return msg || '?'+msgKey+'?';
  };

  var msgService = {};
   msgService.get = function(msgKey, interpolateParams) {
     return msgService.getForLocale(msgKey, $locale.id, interpolateParams)
   };

    msgService.getForLocale = function(msgKey, locale, interpolateParams) {
      var msgForLocale = getForLocale(locale || $locale.id, msgKey);
      if (!msgForLocale && locale !== defaultLocale) {
        msgForLocale =  getForLocale(defaultLocale, msgKey, true);
      }

      if (msgForLocale) {
        return $interpolate(msgForLocale)(interpolateParams);
      } else {
        return handleNotFound(msgForLocale, msgKey);
      }
    };

  return msgService;
}]);