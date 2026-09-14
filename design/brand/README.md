# COMQ brand assets

This directory keeps COMQ's master artwork and selected exports. The header and footer use the light and dark symbol exports in `public/images/brand`; the original gold symbol is retained there as a separate export. Favicon website copies live in `app`. Company logos have separate [experience artwork notes](../experience/README.md).

## Master artwork

Keep all four masters in `assets/`. “Logo” includes the COMQ lettering; “symbol” contains only the gold mine entrance and rails, centered horizontally and vertically.

All canvases are **1254 × 1254**: pixels for PNG, coordinate units for SVG. PNG masters are RGB with an opaque dark background and raster texture. SVGs use gold gradients on a solid `#111111` background.

| File                                      | Format | Purpose                   |
| ----------------------------------------- | ------ | ------------------------- |
| [comq-logo.png](assets/comq-logo.png)     | PNG    | Original full-logo image  |
| [comq-logo.svg](assets/comq-logo.svg)     | SVG    | Scalable full-logo master |
| [comq-symbol.png](assets/comq-symbol.png) | PNG    | Derived symbol image      |
| [comq-symbol.svg](assets/comq-symbol.svg) | SVG    | Symbol and favicon master |

The full-logo PNG is preserved byte-for-byte from the selected generated image. The symbol PNG was derived by removing the wordmark and centering the remaining symbol. Their SVG counterparts preserve the composition and background treatment.

The SVGs contain editable paths and gradients, with no embedded raster images or font dependencies. Contours were traced with [VTracer](https://github.com/visioncortex/vtracer), and gold gradients were fitted to the source colors. They approximate the PNGs' shading and fine texture; retain the PNGs for the original raster appearance. Retained SVGs can be exported directly with an SVG editor or raster exporter.

## Selected exports

Source paths in this section are relative to `assets/`. SVG canvas sizes are coordinate units, not required on-screen sizes. ICO frames are actual pixels.

| Source                                                              | Format | Canvas / frames | Appearance                    |
| ------------------------------------------------------------------- | ------ | --------------- | ----------------------------- |
| [symbol/comq-symbol.svg](assets/symbol/comq-symbol.svg)             | SVG    | 677.6 × 561.6   | Original gold gradients       |
| [symbol/comq-symbol-light.svg](assets/symbol/comq-symbol-light.svg) | SVG    | 677.6 × 561.6   | Flat `#20201d` for light mode |
| [symbol/comq-symbol-dark.svg](assets/symbol/comq-symbol-dark.svg)   | SVG    | 677.6 × 561.6   | Flat `#d4af37` for dark mode  |
| [favicon/comq-symbol.svg](assets/favicon/comq-symbol.svg)           | SVG    | 64 × 64         | Gold on a rounded dark square |
| [favicon/comq-symbol.ico](assets/favicon/comq-symbol.ico)           | ICO    | 16 / 32 / 48 px | Gold on a rounded dark square |

The symbol exports are transparent, tightly framed and centered. The cropped `assets/symbol/comq-symbol.svg` is distinct from the square `assets/comq-symbol.svg` master. Both favicons show the centered symbol on a `#080808` rounded square with a 10-unit corner radius and transparent outer corners. The ICO contains 32-bit DIB raster frames with alpha. All selected exports contain the symbol without COMQ lettering.

The light and dark exports derive from `assets/symbol/comq-symbol.svg`. They preserve all ten paths, their order, the `translate(0 136)` group and `viewBox="288.2 346.2 677.6 561.6"`, replacing the opaque gold gradients with the flat fills listed above. The original gold export and masters retain their artwork.

## Website copies

Source paths below are relative to `design/brand/assets/`; website paths are relative to the project root. Each source and website copy must remain byte-for-byte identical. All localized pages share the same copies.

| Source                         | Website copy                                                                                 | Usage                                |
| ------------------------------ | -------------------------------------------------------------------------------------------- | ------------------------------------ |
| `symbol/comq-symbol.svg`       | [public/images/brand/comq-symbol.svg](../../public/images/brand/comq-symbol.svg)             | Retained original gold symbol export |
| `symbol/comq-symbol-light.svg` | [public/images/brand/comq-symbol-light.svg](../../public/images/brand/comq-symbol-light.svg) | Header and footer in light mode      |
| `symbol/comq-symbol-dark.svg`  | [public/images/brand/comq-symbol-dark.svg](../../public/images/brand/comq-symbol-dark.svg)   | Header and footer in dark mode       |
| `favicon/comq-symbol.svg`      | [app/icon.svg](../../app/icon.svg)                                                           | SVG favicon                          |
| `favicon/comq-symbol.ico`      | [app/favicon.ico](../../app/favicon.ico)                                                     | ICO favicon                          |

## Website rendering

Header and footer use the shared server component [BrandSymbol.tsx](../../features/site/BrandSymbol.tsx). The shared [website rendering notes](../README.md#website-rendering) explain the image and theme behavior for this component and the experience strip.

| Consumer                                             | Component         | Purpose             | Display size       |
| ---------------------------------------------------- | ----------------- | ------------------- | ------------------ |
| [SiteNav.tsx](../../features/site/SiteNav.tsx)       | `BrandSymbol`     | Localized home link | 48 × 40 CSS px     |
| [SiteFooter.tsx](../../features/site/SiteFooter.tsx) | `BrandSymbol`     | Company identity    | 40 × 34 CSS px     |
| Browser                                              | SVG / ICO favicon | Site icon           | Browser-controlled |

The header link has a minimum **48 × 44 CSS px** target. Both symbols are decorative: the header link supplies its accessible name, and the footer symbol sits beside COMQ CIA S.A.C and the location. `BrandSymbol` uses empty `alt` text and an `aria-hidden` wrapper.

The [CSS Module](../../features/site/BrandSymbol.module.css) uses `object-fit: contain` to center the artwork inside each fixed display box. The Image dimensions `847 × 702` express the SVG's exact aspect ratio using integers. Symbol sizes stay fixed at mobile breakpoints; only the surrounding layout changes.

The external SVGs carry fixed fills. In forced-colors mode, each image receives a contrasting background so its fill remains visible. See the root README's [Theme section](../../README.md#theme) for color tokens and theme behavior.

Favicons display their embedded gold artwork and background. Next.js automatically adds icon links for `app/icon.svg` and root `app/favicon.ico`, shared across locales.

## Regeneration

Work from copies of the masters. Keep paths, gradients and aspect ratios when producing the gold symbol and favicon compositions; adjust their backgrounds as specified below. Derive the flat theme variants from the cropped gold symbol using the separate instructions below.

Retain SVG titles, descriptions and accessible references. If gradient IDs change, update their matching `url(#...)` references. Size variants must preserve path geometry and gradient colors.

### SVG compositions

Paths in this section are relative to `assets/`.

| Composition         | Master            | Output                    | Width × height |
| ------------------- | ----------------- | ------------------------- | -------------- |
| Cropped gold symbol | `comq-symbol.svg` | `symbol/comq-symbol.svg`  | 677.6 × 561.6  |
| Favicon symbol      | `comq-symbol.svg` | `favicon/comq-symbol.svg` | 64 × 64        |

**Cropped gold symbol:** remove the background rectangle for a transparent, centered crop. Set the width and height from the table above and `viewBox="288.2 346.2 677.6 561.6"`. Keep the symbol master's existing `translate(0 136)` group.

**Favicon:** set `viewBox="0 0 64 64"`. Replace the master background with a 64 × 64 rectangle, `fill="#080808"`, `rx="10"`; retain transparent outer corners.

Wrap the favicon artwork in an outer group with this transform, in the order shown:

```text
translate(-21.235849057 -21.235849057)
scale(0.084905660377)
```

Retain the inner `translate(0 136)` group.

### Theme variants

Copy `assets/symbol/comq-symbol.svg` to `assets/symbol/comq-symbol-light.svg` and `assets/symbol/comq-symbol-dark.svg`. Preserve the canvas, viewBox, group transform and all ten path `d` values in order. Replace the gradient fills with `#20201d` for light mode and `#d4af37` for dark mode, keeping the transparent background.

1. **Shape changes:** regenerate both theme variants from the updated cropped symbol, preserving its geometry and proportions.
2. **Brand color changes:** update each affected SVG's fill to match the color resolved by `--color-brand` in [app/theme.css](../../app/theme.css) in that theme.
3. **Website copies:** copy the updated design exports into `public/images/brand/`, keeping each pair identical, and update the appearance table.

### ICO export

Render `assets/favicon/comq-symbol.svg` separately at **16 × 16, 32 × 32 and 48 × 48 px**. Preserve transparency and proportions, including the rounded background and transparent corners. Package all three square images as 32-bit DIB frames with alpha in `assets/favicon/comq-symbol.ico`.

These settings preserve composition; raster antialiasing and encoding may vary between exporters. Rendering traced SVGs approximates the retained PNG masters' texture.

## Updating website copies

For artwork changes, update the source export first, then replace its mapped website copy. Cropped symbol changes require updating the gold export and both theme variants. Changes intended for both the symbol and favicon compositions also require regenerating the favicon SVG and ICO frames before replacing all five website copies.

From the project root, check each pair:

```sh
cmp design/brand/assets/symbol/comq-symbol.svg public/images/brand/comq-symbol.svg
cmp design/brand/assets/symbol/comq-symbol-light.svg public/images/brand/comq-symbol-light.svg
cmp design/brand/assets/symbol/comq-symbol-dark.svg public/images/brand/comq-symbol-dark.svg
cmp design/brand/assets/favicon/comq-symbol.svg app/icon.svg
cmp design/brand/assets/favicon/comq-symbol.ico app/favicon.ico
```

Each command succeeds without output when the files match. After artwork changes, review the header and footer in both languages and at mobile widths, plus favicons at 16, 32 and 48 px. Keep the original standalone `index.html` unchanged.
