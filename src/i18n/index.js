import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import frFlag from '../assets/flags/fr.png';
import enFlag from '../assets/flags/gb.png'; 

import en from '../locales/en.json';
import fr from '../locales/fr.json'; 

import languageDetector from './language-detector';

const resources = {
  en,
  fr, 
};
const namespace = 'translation';

export const languages = [  
  {
    code: 'en',
    name: 'English',
    title: 'Tracking COVID-19',
    description:
      'Help the Civil Protection Team to track potential COVID-19 infections in Djibouti',
    button: 'Continue in English',
    flag: enFlag,
  },
  {
    code: 'fr',
    name: 'Français',
    title: 'Suivi du COVID-19',
    description: "Aidez l'équipe de protection civile à suivre les infections potentielles au COVID-19 à Djibouti",
    button: 'Continuer en français',
    flag: frFlag,
  },
];

/**
 * We use content as keys and have no namespace.
 */
export default function initI18n() {
  i18next
    .use(languageDetector)
    .use(initReactI18next)
    .init({
      debug: false,
      resources,
      whitelist: Object.keys(resources),

      fallbackLng: 'en',
      saveMissing: true,
      missingKeyHandler: (locale, ns, key) => {
        if (__DEV__) {
          console.log(
            `Translations: Missing key '${key}' in locale ${locale}.`,
          );
        }
      },
      ns: namespace,
      defaultNs: namespace,

      keySeparator: false,
      nsSeparator: false,
      interpolation: {
        escapeValue: false,
      },
    });
}

export const changeLanguage = lang => {
  i18next.changeLanguage(lang);
};

export const getLanguage = () => i18next.language;
