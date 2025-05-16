import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/en/translation.json';
import translationDE from './locales/de/translation.json';
import translationAR from './locales/ar/translation.json'; // Added Arabic
import translationFR from './locales/fr/translation.json'; // Added French

const resources = {
    en: {
        translation: translationEN,
    },
    de: {
        translation: translationDE,
    },
    ar: {  // Added Arabic
        translation: translationAR,
    },
    fr: {  // Added French
        translation: translationFR,
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en', // Fallback language if translation missing
    interpolation: {
        escapeValue: false, // React already protects against XSS
    },
});

export default i18n;