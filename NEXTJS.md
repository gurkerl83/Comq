# Next.js conventions

## Routing and content

Next.js rewrites keep default-language URLs unprefixed while letting all locales share the same pages and server layout. The routing rules and examples are documented in [next.config.ts](next.config.ts). Unsupported locales and missing pages return 404.

The shared locale layout keeps the header and footer mounted during navigation within one language. Pages render only their content.

All application links use the shared [Link component](components/Link.tsx). Its block comment documents the usage and scrolling rules.

When extending the site:

- **Add a page:** create one thin entrypoint under `app/[locale]` that renders its feature, add its `metadata.ts` helper and translated content, and update its [sitemap](app/sitemap.ts) and [AI agent guide](public/llms.txt).
- **Add a language:** extend the `Locale` constant in [locale configuration](lib/i18n/locales.ts), register a matching dictionary in the [loader](lib/i18n/dictionaries.ts), and update the [language labels](features/site/LanguageSwitcher.tsx) and Open Graph locale mapping in the metadata helper. Add the [selector translations](features/equipment/selector-content.ts), [catalogue-page text](features/equipment/catalogue-content.ts), [machine-page text](features/equipment/MachinePage.tsx) and all localized content in the [equipment catalogue](features/equipment/catalogue.ts).

### Next.js route groups and shared layouts

Next.js maps folders under `app/` to routes. An ordinary folder such as `venta` adds a literal URL segment; square brackets such as `[locale]` or `[slug]` capture a dynamic segment. Parentheses such as `(equipment)` define a **route group**: they organize routes without adding a URL segment. The group name is our choice; the parentheses give it this behavior.

We use `(equipment)` to give browse, selector and machine-detail pages a shared layout. The relevant structure is:

```text
app/[locale]/
├── layout.tsx                  Shared document, site header and footer
├── page.tsx                    Homepage
├── experiencia/page.tsx        Experience page, outside the equipment group
└── (equipment)/
    ├── layout.tsx              Shared equipment navigation and child content
    ├── venta/page.tsx          Browse equipment
    ├── selector/page.tsx       Equipment selector
    └── equipos/[slug]/page.tsx Machine details
```

The group itself does not render navigation. Its [layout](<app/[locale]/(equipment)/layout.tsx>) renders `EquipmentNavigation` followed by `children`, where Next.js supplies the active page. This layout is nested inside the existing [locale layout](app/[locale]/layout.tsx), which owns the document, header and footer. Pages outside the group use the locale layout without the equipment navigation.

The resulting public URLs remain:

| Page in `(equipment)/`    | Spanish URL              | English URL                 |
| ------------------------- | ------------------------ | --------------------------- |
| `venta/page.tsx`          | `/venta`                 | `/en/venta`                 |
| `selector/page.tsx`       | `/selector`              | `/en/selector`              |
| `equipos/[slug]/page.tsx` | `/equipos/demo-jumbo-j1` | `/en/equipos/demo-jumbo-j1` |

Omitting the group name is a Next.js convention. Omitting `/es` is a separate project rule implemented by our locale rewrites. Links use the public URLs and never include `(equipment)`. Renaming the folder to `equipment` without parentheses would add `/equipment` to these paths.

For a practical navigation example, stay within English and use the application's links:

1. Open `/en/venta`: the site shell wraps the equipment navigation and browse page.
2. Open `/en/equipos/demo-jumbo-j1`: the shared layouts remain mounted while machine details replace the browse content. Browse remains the active equipment section.
3. Open `/en/selector`: the selector replaces the machine details. The navigation stays mounted, and its client component uses `useSelectedLayoutSegment()` to mark Selector active.
4. Open `/en/experiencia`: the equipment layout leaves the active route, so its navigation disappears. The shared locale layout still provides the site header and footer.

Layout persistence describes what is reused during client-side navigation. It does not determine whether a page is statically generated, make navigation sticky, or control scroll restoration. It also does not preserve state owned by a page that unmounts; the selector draft lifetime is described in the [README](README.md#equipment-selector). The equipment layout is a nested layout under the same root, so entering or leaving this group does not itself require a full page reload.

To add a future equipment comparison page with this same navigation, create `app/[locale]/(equipment)/comparar/page.tsx`. It would serve `/comparar` and `/en/comparar`, and only needs to render its page content. Add its translated content and links through the shared `Link` component as usual. This is an example of extending the route tree; no comparison page currently exists. A page that should omit the equipment navigation belongs outside the group, such as `app/[locale]/experiencia/page.tsx`.

When moving an existing page into a group, move its entrypoint and adjust relative imports. Do not leave another page at the same effective URL: `app/[locale]/venta/page.tsx` and `app/[locale]/(equipment)/venta/page.tsx` would conflict because the group does not distinguish their URLs.

### Next.js Link and automatic scrolling

Our shared `Link` delegates routed navigation to Next.js. With the default `scroll={true}`, the App Router can scroll the destination into view without an application `onClick` handler or an explicit application call to `scrollIntoView()`. This applies on both mobile and desktop. Keep the component's block comment as the usage rule; this section explains the framework behavior behind it.

1. **Next.js decides whether scrolling is needed.** After a client-side route change, it measures the destination route's rendered content against the viewport. If the target's top is already visible, it can keep the existing position. In the installed 16.3.4 implementation, the visibility check also accounts for root `scroll-padding-top`. Otherwise it first sets the document's vertical scroll position to zero, then calls `scrollIntoView()` if the target is still outside the usable viewport. Consequently, `scroll={true}` enables this decision; it does not promise an unconditional `window.scrollTo(0, 0)`. See the [Link scroll API](https://nextjs.org/docs/app/api-reference/components/link#scroll) and [16.3.4 router implementation](https://github.com/vercel/next.js/blob/v16.3.4/packages/next/src/client/components/layout-router.tsx).
2. **The scroll call can come from a React Fragment.** Our installed Next.js version uses a Fragment ref around route content and can call `instance.scrollIntoView()`. The bundled React implementation can forward that call to multiple rendered children. Searching only our application source will therefore not find every native scroll call. A React Fragment here groups rendered children; it is separate from both a URL `#fragment` and a `(route-group)` folder.
3. **`scroll={false}` skips Next's automatic navigation scroll.** It does not scroll to the top, disable CSS offsets, prevent our own scroll calls, or configure browser Back/Forward restoration. Use it when the current position should be retained during an in-place URL update, as in the gallery demo's image-count links. Native links use browser behavior instead of this App Router handler.
4. **CSS supplies the header offset.** Our `html` rule in [globals.css](app/globals.css) uses `scroll-padding-top: var(--site-header-height)` for the sticky header. Native `scrollIntoView()` takes scroll padding on the container and scroll margin on its target into account. These properties do not add normal layout spacing or guarantee an offset for direct scroll-coordinate assignments or history restoration. Setting `scroll={false}` leaves the CSS rules intact. See [Next.js's sticky-header guidance](https://nextjs.org/docs/app/api-reference/components/link#scroll-offset-with-sticky-headers).
5. **Wizard step changes are a separate operation.** Continue and Back inside the selector update local state without navigating to another route. Next's Link handling does not perform that step scroll. The existing `wizardStart.current?.scrollIntoView({ block: 'start' })` in [EquipmentWizard](features/equipment/selector/EquipmentWizard.tsx) deliberately brings the wizard progress and new step into view; it leaves the initial page navigation alone.

For example, scroll down the English homepage and follow its Experience link to `/en/experiencia`. Our ordinary routed `Link` lets Next.js measure the new route and apply the process above. Adding `scroll={false}` would skip that process and can leave the destination at the previous offset, subject to the browser clamping it to the new page height. Clicking the browser's Back button is history restoration and does not rerun the link click; changing that link's `scroll` prop is not a fix for an incorrect restored position.

The version history distinguishes automatic scrolling from later changes to its implementation:

| Version             | Verified behavior                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **13.0.0**          | The initial App Router beta already conditionally called `scrollIntoView()` during navigation. See the [tagged router source](https://github.com/vercel/next.js/blob/v13.0.0/packages/next/client/components/layout-router.tsx#L123-L132) and [release announcement](https://nextjs.org/blog/next-13).                                                                             |
| **13.4.0**          | The App Router became stable. Its router already checked visibility, tried the document top, then used `scrollIntoView()` if needed. See the [tagged source](https://github.com/vercel/next.js/blob/v13.4.0/packages/next/src/client/components/layout-router.tsx#L224-L241) and [stability announcement](https://nextjs.org/blog/next-13-4).                                      |
| **16.2.0**          | Includes the newer Fragment-based handler behind `experimental.appNewScrollHandler`, with the option defaulting to `false`. See the [handler](https://github.com/vercel/next.js/blob/v16.2.0/packages/next/src/client/components/layout-router.tsx#L235-L328) and [configuration](https://github.com/vercel/next.js/blob/v16.2.0/packages/next/src/server/config-shared.ts#L1717). |
| **16.3.0 / 16.3.4** | Both default that option to `true`; 16.3.4 is the version in our lockfile. See the [16.3.0 default](https://github.com/vercel/next.js/blob/v16.3.0/packages/next/src/server/config-shared.ts#L2159) and [16.3.4 default](https://github.com/vercel/next.js/blob/v16.3.4/packages/next/src/server/config-shared.ts#L2159).                                                          |

Automatic route scrolling has been part of the App Router since its first public release. The exact checks have evolved; recheck the installed router when upgrading Next.js. The timeline above specifically covers App Router route scrolling; `next/link` itself and the older Pages Router have a separate history.
