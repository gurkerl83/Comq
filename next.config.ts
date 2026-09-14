import type { NextConfig } from 'next';

import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from './lib/i18n/locales';

const nextConfig: NextConfig = {
  /**
   * Serve the default locale without a public URL prefix while keeping all page
   * entrypoints and the root layout together under `app/[locale]`.
   *
   * The internal rewrites supply the default locale through route params.
   * This lets the shared server layout render the correct `<html lang>`
   * without duplicating pages or layouts in a separate default-language branch.
   *
   * Existing public files and non-dynamic routes resolve before this array;
   * for example, `/images/brand/comq-symbol.svg` and `/sitemap.xml` are served directly.
   *
   * The browser keeps the requested URL without a redirect. Direct URLs with
   * the default locale prefix remain accessible, while public links and canonical
   * metadata use unprefixed URLs. Missing destinations still return 404.
   *
   * 1. Root URL
   *
   * `/` is a literal path, with no regex or captured parameter.
   * Supply DEFAULT_LOCALE for the empty path after the leading slash.
   *
   * Examples: `/` serves `/es` when DEFAULT_LOCALE is 'es', or `/en` when
   * DEFAULT_LOCALE is 'en'. The browser address remains `/` in either case.
   *
   * 2. Subpages
   *
   * Prepend DEFAULT_LOCALE to an unprefixed path, including nested
   * segments, so adding a page does not require another rewrite rule.
   * Examples below assume DEFAULT_LOCALE = 'es' and supported locales es/en.
   *
   * - `:path(...)` is Next's named parameter with a regex constraint.
   *   For `/venta`, it captures 'venta', reused by `:path` in the destination.
   * - `(?!...)` is a negative lookahead: reject an excluded first segment
   *   immediately after the leading slash, without consuming characters.
   *   For example, `/en/venta` must not become `/es/en/venta`.
   * - `(?:...)` groups alternatives without capturing another value;
   *   `|` means "or". SUPPORTED_LOCALES supplies `es|en`, followed by the
   *   reserved `_next`, `_vercel` and `api` alternatives. For example,
   *   `/es/venta`, `/_next/image`, `/_vercel/insights` and `/api/contact` skip
   *   this rule.
   * - `(?:/|$)` requires a slash or the end of the pathname after that name.
   *   `/en/venta` uses the slash boundary; `/en` uses `$`. `/energia` passes
   *   because 'en' is not its complete first segment.
   * - `.+` matches one or more characters, including nested slashes.
   *   It matches 'equipos/jumbos' but not the empty path handled above.
   *
   * Examples: `/venta` rewrites internally to `/es/venta`, and
   * `/equipos/jumbos` to `/es/equipos/jumbos`. Each destination needs a page
   * to serve content; otherwise the request returns 404.
   */
  rewrites() {
    return [
      {
        source: '/',
        destination: `/${DEFAULT_LOCALE}`
      },
      {
        source: `/:path((?!(?:${SUPPORTED_LOCALES.join('|')}|_next|_vercel|api)(?:/|$)).+)`,
        destination: `/${DEFAULT_LOCALE}/:path`
      }
    ];
  }
};

export default nextConfig;
