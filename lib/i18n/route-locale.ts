import { notFound } from 'next/navigation';

import { isSupportedLocale } from './locales';

/**
 * Resolve and validate the locale received by an App Router page entrypoint.
 * Pages and metadata functions validate their own inputs rather than relying
 * on the parent layout to run first. Both Spanish and English use this route
 * tree; unsupported values return 404 instead of selecting a fallback language.
 */
export const getRouteLocale = async (params: Promise<{ locale: string }>) => {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();
  return locale;
};
