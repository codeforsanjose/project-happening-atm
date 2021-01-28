import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import yaml from 'js-yaml';

i18n.use(Backend).use(LanguageDetector).use(initReactI18next).init({
  debug: true, // logs info level to console output, helps with finding issues
  ns: 'translation', // string or array of namespaces to load
  lng: undefined, // language to use (overrides language detection)
  fallbackLng: 'en', // language to use if translations in user language are not available
  interpolation: { // allows integration of dynamic values into your translations
    escapeValue: false, // not needed for react as it escapes by default
  },
  backend: { // will load resources from a backend server using the XMLHttpRequest or the fetch API
    loadPath: '/locales/{{lng}}/{{ns}}.yaml', // path where resources get loaded from, or a function returning a path:
    parse: (data) => yaml.load(data), // parse data after it has been fetched
  },
  detection: { // used to detect user language in the browser
    order: ['queryString', 'cookie'], // order and from where user language should be detected
    caches: ['cookie'], // cache user language on
  },
});

export default i18n;
