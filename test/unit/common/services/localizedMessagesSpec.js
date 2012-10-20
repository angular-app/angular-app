describe('localized messages', function () {

  var $locale, localizedMessages, messages;
  beforeEach(function () {
    angular.module('test',['services.localizedMessages'])
      .value('I18N.MESSAGES', messages = {})
      .constant('I18N.DEFAULT_LOCALE', 'en-us');
    module('test');
  });
  beforeEach(inject(function (_$locale_, _localizedMessages_) {
    $locale = _$locale_;
    localizedMessages = _localizedMessages_;
  }));

  describe('messages for the current locale', function () {

    it('should return a localized message if defined', function () {
      messages['en-us'] = {existing:'Existing message!'};
      expect(localizedMessages.get('existing')).toEqual('Existing message!');
    });

    it('should return a message key surrounded by a question mark for non-existing messages', function () {
      expect(localizedMessages.get('non.existing')).toEqual('?non.existing?');
    });
  });

  describe('messages for a specified locale', function () {

    it('should return a message for a specified locale if exists', function () {
      messages['fr-fr'] = {sth:'quelque chose'};
      expect(localizedMessages.getForLocale('sth', 'fr-fr')).toEqual('quelque chose');
    });

    it('should return a message from the default locale if doesnt exist in a specified one', function () {
      messages['en-us'] = {sth:'something'};
      expect(localizedMessages.getForLocale('sth', 'fr-fr')).toEqual('something');
    });

    it('should allow using forLocale even for the current locale', function () {
      messages['en-us'] = {sth:'something'};
      expect(localizedMessages.getForLocale('sth', 'en-us')).toEqual('something');
    });

    it('should return a message key surrounded by a question mark for non-existing messages when locale was specified', function () {
      expect(localizedMessages.getForLocale('sth', 'fr-fr')).toEqual('?sth?');
    });
  });

  describe('interpolation of message parameters', function () {

    it('should interpolate parameters for the current locale', function () {
      messages['en-us'] = {sth:'en {{param}} us'};
      expect(localizedMessages.get('sth', {param:'value'})).toEqual('en value us');
    });

    it('should interpolate parameters for a specified locale', function () {
      messages['en-us'] = {sth:'en {{param}} us'};
      expect(localizedMessages.getForLocale('sth', 'en-us', {param:'value'})).toEqual('en value us');
    });

    it('should not break for missing params', function () {
      messages['en-us'] = {sth:'en {{param}} us'};
      expect(localizedMessages.getForLocale('sth', 'en-us')).toEqual('en  us');
      expect(localizedMessages.getForLocale('sth', 'en-us', {other:'value'})).toEqual('en  us');

      expect(localizedMessages.get('sth')).toEqual('en  us');
      expect(localizedMessages.get('sth', {other:'value'})).toEqual('en  us');
    });

  });
});