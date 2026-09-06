import 'server-only';

import type { SupportedLocale } from './locales';
import type { Dictionary } from './types';

// Explicit imports keep the supported dictionaries visible to the bundler and
// load only the requested language on the server.
const dictionaries = {
  es: () => import('./dictionaries/es').then(module => module.default),
  en: () => import('./dictionaries/en').then(module => module.default)
} satisfies Record<SupportedLocale, () => Promise<Dictionary>>;

export async function getDictionary(
  locale: SupportedLocale
): Promise<Dictionary> {
  return dictionaries[locale]();
}
