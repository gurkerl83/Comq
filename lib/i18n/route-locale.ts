import { notFound } from 'next/navigation';

import { isSupportedLocale } from './locales';

/**
 * Params type for every page and `generateMetadata` below `app/[locale]`.
 *
 * 1. Source
 *    - `PageProps<'/[locale]'>` is the props type Next generates for the
 *      `/[locale]` route.
 *    - Its `params` come from the folder name: `[locale]` becomes
 *      `{ locale: string }`.
 *
 * 2. Shape
 *    - `Pick` keeps only `params`: `{ params: Promise<{ locale: string }> }`.
 *    - Pages that read the query add their own `searchParams` type, such as
 *      `SelectorQuery`.
 *    - Pages with a further segment, such as `equipos/[slug]`, declare their
 *      own params.
 *
 * 3. Check
 *    - Next does not check page props: its generated `validator.ts` accepts
 *      any.
 *    - This type keeps page params in line with the folder.
 *    - If `[locale]` is renamed, `'/[locale]'` is no longer a known route and
 *      this line fails the typecheck.
 */
export type LocalePageProps = Pick<PageProps<'/[locale]'>, 'params'>;

/**
 * Props type for every layout below `app/[locale]`.
 *
 * 1. Source
 *    - `LayoutProps<'/[locale]'>` is the props type Next generates for the
 *      `/[locale]` layouts.
 *    - Route groups add no URL segment, so the root layout and the
 *      `(content)` and `(equipment)` layouts all belong to `/[locale]`.
 *
 * 2. Shape
 *    - Resolves to `children` and `params: Promise<{ locale: string }>`.
 *
 * 3. Check
 *    - Next checks layout props: its generated `validator.ts` requires every
 *      layout to accept `LayoutProps<'/[locale]'>`.
 *    - This type gives the layouts one name for those props.
 *    - If `[locale]` is renamed, `'/[locale]'` is no longer a known route and
 *      this line fails the typecheck.
 */
export type LocaleLayoutProps = LayoutProps<'/[locale]'>;

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
