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

Next.js 16.3 App Router, React 19.3 and strict TypeScript, with Node.js 24 and pnpm 11.1.1. TypeScript checks types and Prettier handles formatting. See [package.json](package.json) for dependencies and scripts.

| Area            | Approach                                                                                                                |
| --------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Routing         | One shared route tree under `app/[locale]`, with server-rendered pages and localized metadata.                          |
| Pages           | Shared server components in `features/`.                                                                                |
| Content and SEO | Typed dictionaries in `lib/i18n/`; identity, contact details and canonical origin in [site config](lib/site/config.ts). |
| Styling         | CSS Modules and shared design tokens; see [Theme](#theme).                                                              |
| Assets          | Source artwork in `design/`; website copies in `public/` and App Router favicon files in `app/`.                        |

### Routing and content

Next.js rewrites keep default-language URLs unprefixed while letting all locales share the same pages and server layout. The routing rules and examples are documented in [next.config.ts](next.config.ts). Unsupported locales and missing pages return 404.

The shared locale layout keeps the header and footer mounted during navigation within one language. Pages render only their content.

When extending the site:

- **Add a page:** create one thin entrypoint under `app/[locale]` that renders its feature, add its `metadata.ts` helper and translated content, and update its [sitemap](app/sitemap.ts) and [AI agent guide](public/llms.txt).
- **Add a language:** extend the `Locale` constant in [locale configuration](lib/i18n/locales.ts), register a matching dictionary in the [loader](lib/i18n/dictionaries.ts), and update the [language labels](features/site/LanguageSwitcher.tsx) and Open Graph locale mapping in the metadata helper. Add the [selector translations](features/equipment/selector-content.ts), [catalogue-page text](features/equipment/catalogue-content.ts), [machine-page text](features/equipment/MachinePage.tsx) and all localized content in the [equipment catalogue](features/equipment/catalogue.ts).

Keep the original standalone `index.html` unchanged; it is separate from the Next.js application.

Keep `public/llms.txt` aligned with published content, contact details and supported languages. It follows the [llms.txt proposal](https://llmstxt.org/) as a concise guide to the existing HTML pages; it does not replace the sitemap or guarantee AI search inclusion. The robots policy allows all crawlers; hosting and firewall settings must also permit their requests.

### Equipment selector

The sales pages (`/venta` and `/en/venta`) offer compact machine cards before the service details. Cards show the category, summary and first two specifications in catalogue order, then link to the full machine page. Keep those specifications ordered by their usefulness for a quick comparison. Demo equipment remains explicitly identified.

`/selector` and `/en/selector` provide a data-driven, four-step flow: equipment type, machine, requirements and review. Local React state retains answers when moving Back or Continue within the wizard. Individual equipment pages are available at `/equipos/[slug]` and `/en/equipos/[slug]`.

A browse link above the wizard returns to the sales-page catalogue. Machine-page links use `?machine=...` to start at Requirements. Missing or unknown machines start at equipment type. Change equipment returns to the equipment-type step and preserves the enquiry draft, including the visitor's purchase/rental preference and rental details.

The draft lasts for the current wizard instance. A full page reload initializes a new draft from the machine in the URL, or from equipment type if none is recognized. Navigating to a different valid machine link also starts a new draft. Language changes do not transfer answers, and the language switch drops `?machine=...`.

Purchase and Rental are enquiry preferences available for every machine. COMQ confirms availability and terms. Rental fields appear only when Rental is selected.

The fictional catalogue is explicitly labelled as a demo and does not represent real COMQ offers. The demo selector and machine-detail routes are marked `noindex` and intentionally excluded from the sitemap and `llms.txt` until real content is confirmed. To add real products later, update the localized text, specifications and `variants` in [the equipment catalogue](features/equipment/catalogue.ts).

### Theme

Theme selection and shared visibility classes live in [app/theme-selection.css](app/theme-selection.css), and design tokens in [app/theme.css](app/theme.css). Both are imported by [app/globals.css](app/globals.css); CSS Modules retain component styling.

The theme follows the operating system until the user toggles it. The manual choice survives page and language navigation; a full reload returns to the OS preference. See the [theme toggle](features/site/useThemeToggle.ts) for its implementation.

Logo variants, image loading and regeneration are covered in the [artwork guides](#documentation).

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

**Other Node.js hosts:** install dependencies, run `pnpm build`, then serve with `pnpm start` using a normal Next.js runtime.

## Documentation

- [Content strategy](strategy/content-roadmap.md) — product comparisons, staged pickers, articles and LinkedIn presence.
- [What we need from Alberto](strategy/alberto-first-inputs.md) — a short list of the first content inputs, in priority order.
- [Artwork guide](design/README.md) — directory overview and shared image rendering.
- [COMQ artwork](design/brand/README.md) — brand masters, theme variants, favicons and export mappings.
- [Company logo assets](design/experience/README.md) — sources, variants, sizes and regeneration.
