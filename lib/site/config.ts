export const SITE_NAME = 'COMQ CIA';
export const LEGAL_NAME = 'COMQ CIA S.A.C';
export const SITE_URL = 'https://www.comqcia.com';
export const WHATSAPP_NUMBER = '+51 980 523 531';
export const WHATSAPP_URL = 'https://wa.me/51980523531';
export const LINKEDIN_URL =
  'https://www.linkedin.com/in/alberto-llana-69018592/';

/**
 * Resolve a website path against the canonical public site URL.
 *
 * @param path - Absolute website path such as `/en`.
 * @returns Absolute URL string for metadata, sitemap, and structured data.
 */
export const createSiteUrl = (path: string): string =>
  new URL(path, SITE_URL).toString();
