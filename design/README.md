# Artwork guide

Retained artwork lives under `design/`; the website serves copies from `public/` and the App Router favicon files in `app/`.

## Resources

| Directory            | Contents                                              | Guide                                 |
| -------------------- | ----------------------------------------------------- | ------------------------------------- |
| `brand/assets/`      | COMQ masters, symbol variants and favicon exports     | [COMQ artwork](brand/README.md)       |
| `experience/assets/` | Company logo originals and colour/monochrome variants | [Company logos](experience/README.md) |

The guides record exact source-to-website mappings, usage, dimensions and regeneration instructions. Keep each mapped source and website copy byte-for-byte identical.

## Website rendering

### Image loading

[BrandSymbol](../features/site/BrandSymbol.tsx) and [CompanyLogoStrip](../features/experience/CompanyLogoStrip.tsx) use `next/image` to load SVG artwork from `public/`. Next.js serves these files directly at their image URLs. Their server-rendered HTML includes two image elements per logo, one for each theme.

> **Loading note:** Both variants use `loading="eager"`, so the browser requests the light and dark artwork during the initial page load, preparing both sets for theme switching.

### Theme selection

In the browser, shared classes in [theme-selection.css](../app/theme-selection.css) show the artwork for the active theme: `light-theme-only` for light and `dark-theme-only` for dark. The other image has `display: none`, which removes its layout space and excludes it from the accessibility tree.

See [Theme](../README.md#theme) for the OS preference, manual switch and color tokens. The individual artwork guides list the corresponding files and accessible labels.

### Image dimensions

The `width` and `height` props establish each image's aspect ratio. CSS controls its displayed size while preserving that ratio, helping reserve space before the image loads. Concrete dimensions and layout details belong in the [COMQ artwork](brand/README.md) and [company logo](experience/README.md#image-dimensions) guides.
