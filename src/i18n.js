// src/i18n.js
// i18next configuration — translations are bundled locally for offline native app support

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en/translation.json';
import es from './locales/es/translation.json';
import fr from './locales/fr/translation.json';

// i18next v23+ prints a promotional Locize message via console.log with no opt-out config.
// This targeted filter removes it without touching any other logs.
const _origLog = console.log.bind(console);
console.log = (...args) => {
  if (args.some(a => typeof a === 'string' && a.includes('locize.com'))) return;
  _origLog(...args);
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      cacheUserLanguage: true,
    },
  });

export default i18n;
