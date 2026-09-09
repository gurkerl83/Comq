# COMQ website

A standalone Next.js App Router application for COMQ, with Spanish at `/` and English at `/en`. The homepage includes the shared navigation, footer, company introduction and equipment sales, rentals and spare-parts sections. It uses server components, typed dictionaries and CSS Modules.

Each homepage service title and image links to its own page: `/venta`, `/alquiler` and `/repuestos`, with matching `/en` routes. Descriptions and surrounding space remain non-clickable. The header contains only the COMQ mine symbol linking to the localized homepage, WhatsApp contact and the ES/EN language switch. Each service page presents a translated offer, relevant options, practical details and a contextual quote request, with the shared header and footer. The homepage service copy is adapted from the original Spanish page and translated into English, with equipment sales now advertising immediate delivery worldwide. Shared SVG image placeholders follow the theme below the service headings until the original images are supplied.

The original `index.html` remains a separate standalone page. It is excluded from formatting and linting, is not imported by the application and is not served by Next.js. Keep it unchanged.

The footer's Empresa / Company group links to two separate pages, alongside the
COMQ symbol, legal company name and location. Acerca de COMQ / About COMQ opens
`/empresa` (Spanish) or `/en/empresa` (English), where
`features/company/CompanyPage.tsx` introduces the company, its purpose, its
customers and its approach.
Nuestra experiencia / Our experience opens `/experiencia` or `/en/experiencia`,
where `features/experience/ExperiencePage.tsx` presents Alberto Llana's founder
experience, biography, portrait and LinkedIn profile. Both pages use the shared
header/footer, and the language switch preserves the current page. Their slugs
stay the same in both languages, following the service-page convention.

## Development

Use Node.js 24 and pnpm 11.1.1, as declared in `.nvmrc` and `package.json`. Install the locked dependencies and start the development server:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://localhost:3000` for Spanish or `http://localhost:3000/en` for English.

| Command             | Purpose                                                                  |
| ------------------- | ------------------------------------------------------------------------ |
| `pnpm dev`          | Start the development server.                                            |
| `pnpm build`        | Generate route types, run TypeScript 7 checks and build the application. |
| `pnpm start`        | Serve an existing production build.                                      |
| `pnpm typecheck`    | Generate Next route types and run TypeScript 7 without emitting code.    |
| `pnpm lint`         | Run Next's ESLint rules and TypeScript lint rules.                       |
| `pnpm format`       | Format supported project files with Prettier.                            |
| `pnpm format:check` | Check formatting without changing files.                                 |

For a production check, run `pnpm typecheck`, `pnpm lint`, `pnpm format:check` and `pnpm build`, then `pnpm start`. This is a normal Next.js runtime application; publishing is outside the current setup.

### TypeScript and ESLint compatibility

The native TypeScript 7 compiler does not provide the JavaScript compiler API expected by Next.js and TypeScript ESLint. This project follows Microsoft's [side-by-side TypeScript setup](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0):

- `typescript` aliases `@typescript/typescript6@6.0.2`, providing the compiler API for Next.js and ESLint.
- `@typescript/native` aliases `typescript@7.0.2`, providing the `tsc` executable used by `pnpm typecheck`.
- `pnpm build` runs that TypeScript 7 check before the normal Next.js build, including Next's own checks.
- ESLint 9 is retained for compatibility with the Next ESLint plugins.

Keep both TypeScript packages when upgrading, until the framework and lint tools support the native compiler's integration directly.

## Routing and translations

There is no top-level `app/layout.tsx`. Instead, two native root layouts render their own `<html lang>` and share `SiteShell`:

- `app/(default)` renders Spanish at `/`.
- `app/(localized)/[locale]` renders the statically enumerated non-default locales, currently English at `/en`.

The prefixed branch disables unspecified dynamic locale parameters and validates them before rendering. `/es`, `/fr` and unknown pages return 404. Language selection is manual; there are no browser-language detection or language cookies. Crossing root layouts performs a full page load, which also updates the document language. Language links preserve the current page, such as `/venta` and `/en/venta`, through a small client component using Next's `usePathname`; the surrounding shell and page content remain server components.

Route entrypoints load a server-only dictionary and pass the locale and translated strings to shared components under `features`. `lib/i18n/locales.ts` is the source of truth for supported locales. `createHrefForLocale` accepts an absolute, locale-free pathname such as `/` or `/equipos`; it rejects already localized paths, queries, hashes and malformed pathnames. Spanish keeps the pathname; English receives an `/en` prefix.

### Add a language

1. Add its locale code to `SUPPORTED_LOCALES`; `PREFIXED_LOCALES` and static route enumeration derive from that list.
2. Add a dictionary module with the same `Dictionary` shape and register its explicit import in the server-only dictionary loader.
3. Add its native display name to `languageNames` in `LanguageSwitcher` and its region-qualified Open Graph locale to `OPEN_GRAPH_LOCALES` in the metadata helper.
4. Run `pnpm typecheck` to check dictionary shapes and locale mappings. Metadata alternates and sitemap entries derive from the locale list.

### Add a page

Create thin `.tsx` page entrypoints in both native branches and share the page implementation in `features`. For example, an `equipos/page.tsx` entrypoint in each branch creates `/equipos` and `/en/equipos`. Keep locale validation in the prefixed page and pass its dictionary explicitly.

The URL helper only adds locale prefixes; it does not translate slugs. If translated paths are needed, author explicit route wrappers and a corresponding URL mapping. Update the navigation and language-switch links to point to the actual matching pages. Extend metadata with page-specific titles and descriptions, matching canonical URLs and language alternates, and add only implemented pages to the sitemap. Do not add placeholder service links.

### Service page content

The three service pages share `features/services/ServicePage.tsx` and typed
Spanish/English `servicePages` dictionaries. Each focuses on the offer, options to
discuss, practical details and the information needed to request a quote.
Alberto's biography remains on the separate Our experience page.
The copy guides buyers through their requirements; actual inventory, equipment
details, availability and commercial terms still need confirmation. It does not
present an invented catalogue. Service route metadata uses each page's title and
introduction.

Closing quote actions belong to the page features. Home, About COMQ and Our
experience render the shared `QuoteInvitation` after their main content. Service
pages provide their own contextual closing section, so `SiteShell` does not add
a duplicate invitation.

## Theme and styling

`app/theme.css` defines the global design tokens as CSS custom properties on `:root`, including the dark `color-scheme`. `app/globals.css` imports it, and CSS Modules consume its variables. Change this file to adjust the application palette; no theme provider, JavaScript state or additional library is needed.

| Tokens                                                        | Purpose                                               |
| ------------------------------------------------------------- | ----------------------------------------------------- |
| `--color-background`, `--color-surface`                       | Page and raised surface backgrounds.                  |
| `--color-text`, `--color-muted`, `--color-border`             | Primary text, secondary text and neutral dividers.    |
| `--color-accent`, `--color-on-accent`                         | Gold accents and readable text on accent backgrounds. |
| `--color-action`, `--color-action-hover`, `--color-on-action` | Quote button backgrounds and foreground.              |
| `--color-focus-ring`                                          | Keyboard focus color; follows the accent by default.  |
| `--font-family-body`                                          | Shared font stack.                                    |
| `--radius-small`, `--radius-control`, `--radius-media`        | Skip-link, button and image corner radii.             |
| `--border-width`, `--focus-ring-width`, `--focus-ring-offset` | Divider thickness and keyboard focus treatment.       |

Choose background and foreground colors together and check text contrast, hover and keyboard focus in both languages. Layout spacing and responsive breakpoints remain in their component CSS Modules. The current palette is the only supplied theme.

`features/home/ServiceImagePlaceholder.tsx` renders a shared inline SVG with a translated accessible label. Its drawing uses `currentColor`; the containing CSS Module supplies the accent and surface tokens so placeholders follow palette changes.

Logo artwork is deliberately fixed: the header/footer symbol and favicons do not inherit CSS tokens. A future brand recolor needs coordinated exports from `design` into `public/images/comq-symbol.svg`, `app/icon.svg` and `app/favicon.ico`. Keep the standalone `index.html` unchanged.

## Site identity and reference patterns

### Founder experience

The homepage shows a compact, static company-logo strip below the hero, separated
by a neutral top divider and the existing charcoal `--color-surface` background.
Its content stays within the site's standard width, with tighter internal spacing;
the hero retains its original height and padding. Alberto
Llana's introduction appears on the separate Our experience page linked from the
footer. Both use the typed Spanish/English `experience` dictionary; About COMQ
uses `company` for the company's introduction and purpose. The approved “Over 35 years of
experience in mining” headline introduces the logos. That figure refers to
Alberto's career, not COMQ's age. The logos represent his previous professional
experience, not COMQ clients or endorsements; employment dates are omitted.

Our experience pairs Alberto's name and translated founder/advisor role with his
biography and a real portrait. `public/images/company/alberto-llana.jpg` is
the unchanged 481 × 481 JPEG retrieved from his
[LinkedIn profile](https://www.linkedin.com/in/alberto-llana-69018592/) on
September 8, 2026. Next.js serves optimized sizes from this local asset, without
depending on LinkedIn at runtime. The image remains in its original proportions.
Only the existing approved biography is used; a dated career timeline is deferred
until exact roles and employment dates are supplied or verified.

`features/experience/CompanyLogoStrip.tsx` uses the original local logo artwork
and CSS Modules, with no animation, client state or new library. Its default
`variant='monochrome'` matches the dark page. To use the alternative, pass
`variant='colour'` at its homepage call site. That variant uses the paired
`--color-logo-surface` and `--color-on-logo-surface` theme tokens for a light
background that keeps the logos' black lettering readable. All four logos occupy
one row of equal columns on desktop and a two-by-two grid at widths of 640px or
less, retaining their original proportions and supplied clear space.

The served assets in `public/images/experience` are unchanged copies of the
official files recorded in [the design notes](design/experience/README.md).
The public `normet-colour.png` is the black-letter/red-O version, copied from
the design asset `normet-colour-light.png`. ZANINGROUP uses its original LinkedIn
JPEG in both variants, with a CSS monochrome treatment on the dark strip. The
source artwork and provenance notes remain in `design/experience`; both visual
variants are supported by the shared Next.js component.

### Shared identity

`lib/site` centralizes the canonical origin (`https://www.comqcia.com`), company identity, email, phone, WhatsApp and LinkedIn contact links, localized metadata and safe JSON-LD serialization. The sitemap contains the homepage, three service pages, About COMQ and Our experience in both languages; it deliberately omits invented modification dates. Each service, company and experience route supplies its own title and description to the metadata helper. Social metadata is text-based. The company and website schemas use the supplied public facts.

Shared decorative icons live in `features/site/icons.tsx`; the WhatsApp icon's license is included in `THIRD_PARTY_NOTICES.md`. The same gold mine symbol identifies the header, footer and browser icon in both language branches. The browser icon uses Next.js's native `app/icon.svg` and `app/favicon.ico` conventions, copied from the symbol exports in `design/favicon`. The ICO contains 16, 32 and 48px versions of the SVG mark.

The setup adapts these read-only references from the `next-slug-splitter` repository:

- The `app-router-multi-locale-heavy` demo contributed typed locale constants, validation, locale-aware links, static locale enumeration and shared server components.
- The `website` project contributed thin route entrypoints, `features`/`lib` organization, CSS Modules, shared navigation/footer and SEO helpers.
- The repository's Prettier style and relevant explanatory comments were retained. Locale guard/link JSDoc, canonical URL documentation, safe JSON-LD serialization documentation and crawler intent remain alongside their code, with COMQ and Spanish/English examples where appropriate.

These are design references only. The application has no imports, symlinks or runtime links into either reference folder. It contains no MDX, heavy/light page classification, splitter packages, generated page handlers, benchmarks, iframes, rewrites, custom redirects, proxy, middleware or Next.js patches.

## Verified runtime behavior

The production build serves `/` and `/en` directly and returns HTTP 404 for `/es`, `/fr` and missing pages. On Next.js 16.3.4, rejected locale requests can also emit `Internal: NoFallbackError` in the server log. The response remains the normal 404 document; the exception is not exposed to visitors. The framework is left unpatched. Recheck this logging behavior when upgrading Next.js.
