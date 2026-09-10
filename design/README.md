# COMQ logo assets

This directory keeps COMQ's master artwork and selected exports. The website loads copies from `public/images` and `app`, not from `design`. Experience-strip company logos have separate [asset and provenance notes](experience/README.md).

## Master artwork

Keep all four masters. “Logo” includes the COMQ lettering; “symbol” contains only the gold mine entrance and rails, centered horizontally and vertically.

All canvases are **1254 × 1254**: pixels for PNG, coordinate units for SVG. PNG masters are RGB with an opaque dark background and raster texture. SVGs use gold gradients on a solid `#111111` background.

| File                               | Format | Purpose                   |
| ---------------------------------- | ------ | ------------------------- |
| [comq-logo.png](comq-logo.png)     | PNG    | Original full-logo image  |
| [comq-logo.svg](comq-logo.svg)     | SVG    | Scalable full-logo master |
| [comq-symbol.png](comq-symbol.png) | PNG    | Derived symbol image      |
| [comq-symbol.svg](comq-symbol.svg) | SVG    | Header and favicon master |

The full-logo PNG is preserved byte-for-byte from the selected generated image. The symbol PNG was derived by removing the wordmark and centering the remaining symbol. Their SVG counterparts preserve the composition and background treatment.

The SVGs contain editable paths and gradients, with no embedded raster images or font dependencies. Contours were traced with [VTracer](https://github.com/visioncortex/vtracer), and gold gradients were fitted to the source colors. They approximate the PNGs' shading and fine texture; retain the PNGs for the original raster appearance.

Exporting from a retained SVG requires neither AI generation nor retracing.

## Selected exports

SVG canvas sizes are coordinate units, not required on-screen sizes. PNG dimensions and ICO frames are actual pixels.

| Source                                             | Format | Canvas / frames |
| -------------------------------------------------- | ------ | --------------- |
| [header/comq-symbol.svg](header/comq-symbol.svg)   | SVG    | 677.6 × 561.6   |
| [favicon/comq-symbol.svg](favicon/comq-symbol.svg) | SVG    | 64 × 64         |
| [favicon/comq-symbol.ico](favicon/comq-symbol.ico) | ICO    | 16 / 32 / 48 px |

The header symbol is transparent, tightly framed and centered. Both favicons show the centered symbol on a `#080808` rounded square with a 10-unit corner radius and transparent outer corners. The ICO contains 32-bit DIB raster frames with alpha.

These exports omit COMQ lettering. Their gold gradients and favicon background remain embedded in the original files. The website uses the header export's alpha shape as a CSS mask for theme-aware color; favicons display their original gold gradients and background.

## Website copies

Sources are relative to this directory; website paths are relative to the project root. Each pair must remain byte-for-byte identical. Both language branches share the same copies.

| Source                    | Website copy                                                      |
| ------------------------- | ----------------------------------------------------------------- |
| `header/comq-symbol.svg`  | [public/images/comq-symbol.svg](../public/images/comq-symbol.svg) |
| `favicon/comq-symbol.svg` | [app/icon.svg](../app/icon.svg)                                   |
| `favicon/comq-symbol.ico` | [app/favicon.ico](../app/favicon.ico)                             |

| Location                                  | Purpose             | Display size       | Rendering             |
| ----------------------------------------- | ------------------- | ------------------ | --------------------- |
| [Header](../features/site/SiteNav.tsx)    | Localized home link | 48 × 40 CSS px     | CSS alpha mask        |
| [Footer](../features/site/SiteFooter.tsx) | Company identity    | 40 × 34 CSS px     | CSS alpha mask        |
| Browser                                   | SVG / ICO favicon   | Browser-controlled | Original gold artwork |

The header link has a minimum **48 × 44 CSS px** target. The footer symbol is decorative, beside COMQ CIA S.A.C and the location.

Header and footer use the shared server component [BrandSymbol.tsx](../features/site/BrandSymbol.tsx). Its [CSS Module](../features/site/BrandSymbol.module.css) loads the unchanged `/images/comq-symbol.svg` as an alpha mask, centered with `contain` sizing and no repetition to preserve proportions. The mask lets one SVG follow the theme; CSS `color` cannot override the embedded fills of an SVG loaded through `next/image`.

The component uses `--color-brand` for `color` and `currentColor` for its background: gold (`#d4af37`) in the default dark theme and charcoal (`--color-text`, `#20201d`) in light mode. The large homepage COMQ heading shares this brand token independently of UI accents. Forced-colors mode uses the system `CanvasText` color. Symbol sizes stay fixed at mobile breakpoints; only the surrounding layout changes. Theme variants and the footer need no separate image exports.

Next.js automatically adds icon links for `app/icon.svg` and root `app/favicon.ico`. The SVG scales from its 64 × 64 canvas; the ICO offers 16, 32 and 48 px frames. No manual metadata or locale-specific icons are needed.

## Regeneration

Work from copies of the masters. Keep paths, gradients and aspect ratios; remove or replace only the master background as specified below. An SVG editor or raster exporter is sufficient.

Retain SVG titles, descriptions and accessible references. If gradient IDs change, update their matching `url(#...)` references. Size variants must not change path geometry or gradient colors.

### SVG compositions

| Composition    | Master            | Width × height |
| -------------- | ----------------- | -------------- |
| Header symbol  | `comq-symbol.svg` | 677.6 × 561.6  |
| Favicon symbol | `comq-symbol.svg` | 64 × 64        |

**Header:** remove the background rectangle for a transparent, centered crop. Set the width and height from the table above and `viewBox="288.2 346.2 677.6 561.6"`. Keep the symbol master's existing `translate(0 136)` group.

**Favicon:** set `viewBox="0 0 64 64"`. Replace the master background with a 64 × 64 rectangle, `fill="#080808"`, `rx="10"`; retain transparent outer corners.

Wrap the artwork in an outer group with this transform, in the order shown:

```text
translate(-21.235849057 -21.235849057)
scale(0.084905660377)
```

Retain the inner `translate(0 136)` group.

### ICO export

Render `favicon/comq-symbol.svg` separately at **16 × 16, 32 × 32 and 48 × 48 px**. Preserve transparency and proportions, including the rounded background and transparent corners. Package all three square images as 32-bit DIB frames with alpha in `favicon/comq-symbol.ico`.

These settings preserve composition; raster antialiasing and encoding may vary between exporters. Rendering traced SVGs cannot exactly recover the retained PNG masters' texture.

## Updating website copies

For artwork changes, update the source export first, then replace its mapped website copy. A header change does not update the favicon composition. Changes intended for both compositions require regenerating them and the ICO frames before replacing all three website copies. Theme colors are runtime styling in [app/theme.css](../app/theme.css) and require no changes to masters, exports or website image copies.

From the project root, check each pair:

```sh
cmp design/header/comq-symbol.svg public/images/comq-symbol.svg
cmp design/favicon/comq-symbol.svg app/icon.svg
cmp design/favicon/comq-symbol.ico app/favicon.ico
```

Each command succeeds without output when the files match. After artwork changes, review the header and footer in both languages and at mobile widths, plus favicons at 16, 32 and 48 px. Keep the original standalone `index.html` unchanged.
