# COMQ logo assets

| Asset           | PNG                    | Vector SVG             |
| --------------- | ---------------------- | ---------------------- |
| Full logo       | [PNG](comq-logo.png)   | [SVG](comq-logo.svg)   |
| Centered symbol | [PNG](comq-symbol.png) | [SVG](comq-symbol.svg) |

These assets retain the selected refined design: a gold mine entrance and rails. The full logo includes the COMQ wordmark; the symbol omits the lettering and is centered horizontally and vertically. All four files use a 1254 × 1254 canvas and an opaque dark background.

The full-logo PNG is preserved byte-for-byte from the selected generated image. The symbol PNG was derived from that image by removing the wordmark and centering the remaining symbol. Their SVG counterparts preserve the same composition and background treatment.

The SVGs contain editable vector paths and color gradients, with no embedded raster images or font dependencies. Their contours were traced with [VTracer](https://github.com/visioncortex/vtracer), and their gold gradients were fitted to the source colors. They approximate the PNGs' shading and fine texture rather than reproducing every pixel. Use the PNGs to preserve the raster appearance.

The temporary tracing tool is not a website dependency. These files are design masters; the shared header, footer and favicon use the dedicated symbol exports described below.

## Header and favicon exports

| Use         | Full logo                    | Symbol                         |
| ----------- | ---------------------------- | ------------------------------ |
| Header SVG  | [SVG](header/comq-logo.svg)  | [SVG](header/comq-symbol.svg)  |
| Header PNG  | [PNG](header/comq-logo.png)  | [PNG](header/comq-symbol.png)  |
| Favicon SVG | [SVG](favicon/comq-logo.svg) | [SVG](favicon/comq-symbol.svg) |
| Favicon PNG | [PNG](favicon/comq-logo.png) | [PNG](favicon/comq-symbol.png) |
| Favicon ICO | [ICO](favicon/comq-logo.ico) | [ICO](favicon/comq-symbol.ico) |

Header exports have transparent backgrounds and tight, centered framing. SVGs retain the master paths and gradients; the PNGs are rendered from those vectors at 492 × 384 pixels for the full logo and 463 × 384 pixels for the symbol. Suggested display heights are 40–48 pixels.

Favicons center the artwork inside a dark rounded square. Each SVG uses a scalable 64 × 64 canvas; the PNG is 32 × 32, and each ICO contains 16 × 16, 32 × 32, and 48 × 48 frames. The symbol is clearer at the smallest sizes; the full-logo version retains the COMQ lettering for comparison.

These exports preserve the four master assets above. The selected header symbol is copied to `public/images/comq-symbol.svg` and displayed at 40 pixels tall in the shared navigation, linking to the current language's homepage. The shared footer reuses that asset at 34 pixels tall beside the company name and location. The selected symbol favicon is copied to Next.js's native `app/icon.svg` and `app/favicon.ico`, with 16, 32 and 48px ICO frames. Both language branches use the same mine symbol in the header, footer and favicon. Full-logo exports remain available for comparison.
