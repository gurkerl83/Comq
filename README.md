# COMQ website

A bilingual website for COMQ's underground mining equipment and services.

[Website](https://www.comqcia.com) · [GitHub](https://github.com/gurkerl83/Comq)

## Features

- Spanish is the default language and uses unprefixed URLs; English uses `/en`. Language switching preserves the current page.
- Equipment sales, rentals and spare-parts pages, plus About COMQ and the founder's experience.
- Light and dark themes with a manual switch.
- Responsive navigation and footer, keyboard-accessible controls and WhatsApp quote actions.
- Company logos, founder portrait, email, telephone and LinkedIn contact links.
- Localized metadata, canonical URLs, language alternates, [sitemap](https://www.comqcia.com/sitemap.xml), [robots policy](https://www.comqcia.com/robots.txt), structured data and Vercel Web Analytics.
- Optional [AI agent guide](public/llms.txt) at `/llms.txt`, linked from every page and covering both languages.

## Foundation

Next.js 16.3 App Router, React 19.3 and strict TypeScript, with Node.js 24 and pnpm 11.1.1. TypeScript checks types and Prettier handles formatting. Dependency ranges use caret (`^`) prefixes in [package.json](package.json); the lockfile records exact resolved versions.

| Area            | Approach                                                                                                                |
| --------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Routing         | One shared route tree under `app/[locale]`, with server-rendered pages and localized metadata.                          |
| Pages           | Shared server components in `features/`.                                                                                |
| Content and SEO | Typed dictionaries in `lib/i18n/`; identity, contact details and canonical origin in [site config](lib/site/config.ts). |
| Styling         | CSS Modules and shared design tokens; see [Theme](#theme).                                                              |
| Assets          | Source artwork in `design/`; website copies in `public/` and App Router favicon files in `app/`.                        |

### Routing and content

Next.js rewrites keep default-language URLs unprefixed while letting all locales share the same pages and server layout. The routing rules and examples are documented in [next.config.ts](next.config.ts). Unsupported locales and missing pages return 404.

When extending the site:

- **Add a page:** create one thin entrypoint under `app/[locale]`, render its feature inside `SiteShell` with the locale-free `pathname`, add its `metadata.ts` helper and translated content, and update its [sitemap](app/sitemap.ts) and [AI agent guide](public/llms.txt).
- **Add a language:** extend the `Locale` constant in [locale configuration](lib/i18n/locales.ts), register a matching dictionary in the [loader](lib/i18n/dictionaries.ts), and update the [language labels](features/site/LanguageSwitcher.tsx) and Open Graph locale mapping in the metadata helper.

Keep the original standalone `index.html` unchanged; it is separate from the Next.js application.

Keep `public/llms.txt` aligned with published content, contact details and supported languages. It follows the [llms.txt proposal](https://llmstxt.org/) as a concise guide to the existing HTML pages; it does not replace the sitemap or guarantee AI search inclusion. The robots policy allows all crawlers; hosting and firewall settings must also permit their requests.

### Theme

[app/theme.css](app/theme.css) separates theme selection from shared design tokens. The selection group follows the operating system through native `color-scheme`; each `light-dark()` pair lists the light value first and the dark value second. Edit palette values in this file; CSS Modules consume the tokens.

The [theme toggle](features/site/useThemeToggle.ts) sets `data-theme` on the document after interaction. Its manual choice stays in browser memory across soft page and language navigation and is reapplied before paint when a locale change resets the document attributes. A full reload returns to the OS preference. The implementation uses no theme provider, persistent storage or initialization script.

The [toggle styles](features/site/ThemeToggle.module.css) and [company logo styles](features/experience/CompanyLogoStrip.module.css) select the visible icon or artwork through `prefers-color-scheme` until a manual override is active. Asset sources, rendering and regeneration are documented in the [COMQ artwork](design/README.md) and [company logo](design/experience/README.md) guides.

Token names describe their purpose:

| Token                                                         | Purpose                                                             |
| ------------------------------------------------------------- | ------------------------------------------------------------------- |
| `--color-brand-base`                                          | Fixed brand color.                                                  |
| `--color-brand`                                               | Theme-dependent COMQ symbol and wordmark color.                     |
| `--color-accent`, `--color-on-accent`                         | UI emphasis and its contrasting foreground.                         |
| `--color-action`, `--color-action-hover`, `--color-on-action` | Quote-button background, hover and foreground.                      |
| `--color-text-muted`                                          | Secondary text color.                                               |
| `--color-footer-link`                                         | Footer navigation color.                                            |
| `--color-logo-strip-background`, `--color-logo-strip-text`    | Company logo band's surface and text; artwork keeps its own colors. |

## Local development

Use Node.js 24 (the exact version is in [.nvmrc](.nvmrc)) and pnpm 11.1.1. From the project root:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open [Spanish](http://localhost:3000) or [English](http://localhost:3000/en). If that port is occupied, use the URL printed in the terminal.

| Command             | Purpose                                           |
| ------------------- | ------------------------------------------------- |
| `pnpm typecheck`    | Generate route types and run TypeScript 7 checks. |
| `pnpm format`       | Format project files.                             |
| `pnpm format:check` | Check formatting.                                 |
| `pnpm build`        | Run typecheck and create a production build.      |
| `pnpm start`        | Serve the production build.                       |

## Deployment

Before deploying, run:

```sh
pnpm format:check
pnpm build
```

**Vercel:** use the existing `comq` project with the Next.js preset, repository root, Node.js 24 and `pnpm build`. Production uses `main` from [the GitHub repository](https://github.com/gurkerl83/Comq) and the [COMQ domain](https://www.comqcia.com).

Install the [Vercel CLI](https://vercel.com/docs/cli) once with `pnpm add --global vercel` if it is not already available. For a manual preview of local changes, sign in and link to the existing project, then deploy:

```sh
vercel login
vercel link
vercel deploy --target=preview
```

Choose the existing `comq` project when linking. The CLI returns a preview URL; local changes do not need to be committed. Production releases use the Git integration on `main`, or an intentional `vercel deploy --prod` invocation. See [Vercel deployment options](https://vercel.com/docs/cli/deploy). Enable Web Analytics in the project's dashboard to collect deployed traffic; the integration is already included ([setup guide](https://vercel.com/docs/analytics/quickstart)).

**Other Node.js hosts:** install dependencies, run `pnpm build`, then serve with `pnpm start`. The application uses a normal Next.js runtime, including image optimization.

## Documentation

- [COMQ artwork](design/README.md) — brand masters, CSS mask, favicons and export mappings.
- [Company logo assets](design/experience/README.md) — sources, variants, sizes and regeneration.
