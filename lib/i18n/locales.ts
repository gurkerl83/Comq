export const Locale = {
  Spanish: 'es',
  English: 'en'
} as const;

export type SupportedLocale = (typeof Locale)[keyof typeof Locale];

export const DEFAULT_LOCALE = Locale.Spanish;
export const SUPPORTED_LOCALES = Object.values(Locale);

/**
 * Type guard for the supported COMQ locales.
 *
 * 1. `Locale` is the source of truth.
 * 2. A `true` result narrows the input string to `SupportedLocale`.
 *
 * @example
 * // Supported locale
 * 'en' -> true
 *
 * // Unsupported locale
 * 'fr' -> false
 *
 * @param value - String value to check.
 * @returns `true` when the value is a supported locale.
 */
export const isSupportedLocale = (value: string): value is SupportedLocale =>
  SUPPORTED_LOCALES.some(locale => locale === value);

/**
 * Remove a supported locale prefix before building language links.
 *
 * 1. Match the complete first segment so page names such as '/energia' stay intact.
 * 2. Normalize locale homepages to '/'.
 * 3. Give prerendered routes and public URLs the same locale-free path so
 *    rendered links agree across our default-locale rewrites.
 *
 * @example
 * getLocaleFreePathname('/es/venta') -> '/venta'
 * getLocaleFreePathname('/en/venta') -> '/venta'
 * getLocaleFreePathname('/venta') -> '/venta'
 * getLocaleFreePathname('/en') -> '/'
 * getLocaleFreePathname('/energia') -> '/energia'
 *
 * @param pathname - Absolute pathname without a query or hash.
 */
export const getLocaleFreePathname = (pathname: string) => {
  const segments = pathname.split('/');

  if (!isSupportedLocale(segments[1])) return pathname;

  return `/${segments.slice(2).join('/')}`;
};

/**
 * Create the navigation href for one COMQ locale from a locale-free
 * pathname.
 *
 * 1. The default locale keeps every pathname unprefixed.
 * 2. Non-default locales add their locale segment at the front.
 * 3. Locale homepages are handled without adding a trailing slash.
 * 4. Already localized paths are rejected to prevent doubled locale prefixes.
 *
 * @example
 * // Default-locale homepage
 * createHrefForLocale('es', '/') -> '/'
 *
 * // Default-locale subpage
 * createHrefForLocale('es', '/equipos') -> '/equipos'
 *
 * // Non-default locale
 * createHrefForLocale('en', '/equipos') -> '/en/equipos'
 *
 * // Root pathname
 * createHrefForLocale('en', '/') -> '/en'
 *
 * @param locale - COMQ locale to create the href for.
 * @param localeFreePathname - Absolute pathname without a locale, query or hash.
 * @returns Browser href for the requested locale.
 * @throws When the pathname is malformed or already contains a locale prefix.
 */
export const createHrefForLocale = (
  locale: SupportedLocale,
  localeFreePathname: string
): string => {
  if (
    !localeFreePathname.startsWith('/') ||
    localeFreePathname.includes('//') ||
    /[?#\\]/.test(localeFreePathname)
  ) {
    throw new Error('Expected an absolute pathname without a query or hash.');
  }

  const segments = localeFreePathname.split('/');

  if (segments.some(segment => segment === '.' || segment === '..')) {
    throw new Error('Expected a pathname without relative segments.');
  }

  if (isSupportedLocale(segments[1] ?? '')) {
    throw new Error('Expected a locale-free pathname.');
  }

  if (locale === DEFAULT_LOCALE) {
    return localeFreePathname;
  }

  if (localeFreePathname === '/') {
    return `/${locale}`;
  }

  return `/${locale}${localeFreePathname}`;
};
