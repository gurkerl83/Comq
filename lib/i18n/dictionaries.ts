import 'server-only';

import type { SupportedLocale } from './locales';

// Explicit imports keep the supported dictionaries visible to the bundler and
// load only the requested language on the server.
const dictionaries = {
  es: () => import('./dictionaries/es').then(module => module.default),
  en: () => import('./dictionaries/en').then(module => module.default)
};

export const getDictionary = (locale: SupportedLocale) =>
  dictionaries[locale]();
