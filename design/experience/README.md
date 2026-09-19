# Founder experience artwork

This directory retains downloaded and user-supplied artwork, plus SVG conversions of official vector artwork, for the homepage’s founder experience strip. Source details and regeneration instructions are recorded below.

The company selection reflects **Alberto Llana’s previous professional experience**, based on his [LinkedIn profile](https://www.linkedin.com/in/alberto-llana-69018592/), with ZANINGROUP added at the site owner’s request. The site owner supplied the “Over 35 years of experience in mining” figure, which describes Alberto’s career, not COMQ’s age. These logos are not COMQ customer references or endorsements. The strip omits individual employment dates; Alberto’s biography lives on the Our experience page at `/experiencia` and `/en/experiencia`, linked from the footer.

## Website rendering

[`CompanyLogoStrip`](../../features/experience/CompanyLogoStrip.tsx) renders the four company logos. Shared image loading and theme selection are documented in [Website rendering](../README.md#website-rendering).

### Theme variants

| Theme | Artwork folder | Visibility class   |
| ----- | -------------- | ------------------ |
| Light | `colour/`      | `light-theme-only` |
| Dark  | `monochrome/`  | `dark-theme-only`  |

Each image uses the company name as its `alt` text.

### Image dimensions

The component's `width` and `height` match each SVG's original canvas. Each company's colour and monochrome files share these dimensions, so one pair is defined per company.

| Company    | Original width × height | CSS width |
| ---------- | ----------------------- | --------- |
| Sandvik    | 308 × 56                | 184px     |
| Normet     | 2000 × 792              | 244px     |
| RESEMIN    | 2064 × 356              | 175px     |
| ZANINGROUP | 1122 × 744              | 152px     |

CSS controls display size: `height: auto` preserves proportions, and `max-width: 100%` allows images to shrink within narrower grid columns. Keep the original dimensions on the current path-based `<Image>` elements even when CSS sets a smaller display width.

### Layout

The [CSS Module](../../features/experience/CompanyLogoStrip.module.css) controls image sizing and the grid. The background and inner content span the full width, with padding around the content. The grid has four equal columns above 640px and two at 640px or below.

Individual CSS widths balance the logos' different proportions and clear space. Normet's visible mark occupies about 76% of its canvas width, so its 244px CSS width preserves the supplied padding while keeping the mark comparable to the others.

## Artwork and provenance

The artwork under `assets/` is grouped into `colour/` and `monochrome/`, with lowercase company-only filenames. It includes official downloads, SVG conversions of official vector artwork and user-supplied artwork. The eight active SVG files below are copied unchanged to the same relative paths under `public/images/experience`. For example, `assets/colour/normet.svg` maps to `public/images/experience/colour/normet.svg`. Keep each source and website copy byte-identical; CSS preserves proportions and supplied clear space.

| Relative path               | Source   |
| --------------------------- | -------- |
| `colour/sandvik.svg`        | Sandvik  |
| `colour/normet.svg`         | Normet   |
| `colour/resemin.svg`        | Supplied |
| `colour/zaningroup.svg`     | Supplied |
| `monochrome/sandvik.svg`    | Sandvik  |
| `monochrome/normet.svg`     | Normet   |
| `monochrome/resemin.svg`    | Supplied |
| `monochrome/zaningroup.svg` | Supplied |

### Retained PNG references

Four additional supplied PNG originals remain in `assets/` for design use only. The website renders their SVG counterparts; these PNGs have no runtime copies.

| Relative path               | Dimensions  |
| --------------------------- | ----------- |
| `colour/resemin.png`        | 4128 × 712  |
| `colour/zaningroup.png`     | 1254 × 1254 |
| `monochrome/resemin.png`    | 2048 × 353  |
| `monochrome/zaningroup.png` | 1254 × 1254 |

The two official Normet PNG originals, `colour/normet.png` and `monochrome/normet.png`, remain unchanged in `assets/` as color and appearance references. Both are 2000 × 792. The website uses their SVG counterparts.

### Sandvik

Sandvik's official downloads are [logo_dark.svg](https://www.home.sandvik/logo/logo_dark.svg) for `colour/sandvik.svg` and [logo_light.svg](https://www.home.sandvik/logo/logo_light.svg) for `monochrome/sandvik.svg`. Their SVG viewBoxes are 308 × 56.

### Normet

The Normet files come from its [official logo pack](https://assets.ctfassets.net/idihyv8a6g5y/5oCLR8th6sFikjv2GiHWfh/c018e7fa330cdbc9b6e9ce502f69a7f6/Normet_Logo.zip), linked from its [media page](https://www.normet.com/en/discover-normet/about-us/media). `colour/normet.svg` derives directly from `Normet Primary Logo - Black Version - CMYK.eps`, and `monochrome/normet.svg` from `Normet Secondary Logo - White Version - CMYK.eps`. Each SVG contains two filled compound paths, with no embedded bitmap or fonts. The colour file is 2862 bytes and the monochrome file is 2861 bytes. Their RGB fills match the official digital PNG exports: black `#000000`, red `#e2241b` and white `#ffffff`. The retained `colour/normet.png` is the black-letter/red-O export named `Normet Primary Logo - Black Version- RGB.png` in the archive; `monochrome/normet.png` is `Normet Secondary Logo - White Version - RGB.png`.

To regenerate the Normet SVGs, retrieve the EPS originals from the official pack and convert their `mo`, `li`, `cv` and `cp` path operations to SVG `M`, `L`, `C` and `Z`, preserving all coordinates and the nonzero fill rule. The path coordinates in these EPS files already follow a top-down canvas after their page setup, so retain them without a vertical flip. Use a transparent 2000 × 792 SVG canvas, rounding only the EPS canvas height of 791.8429 to match the official PNG canvas and clear space. Check the RGB fills against the official PNG exports and visually compare both variants before copying the SVGs byte-identically to `public/`. This is direct vector conversion without AI reconstruction or raster tracing. The EPS files remain available in the official archive; the repository contains neither the EPS originals nor a conversion generator. See the [Normet logo guidelines](https://assets.ctfassets.net/idihyv8a6g5y/4usi88Oj7jdppiZ45sptcu/c4036b3a720fbf34e7d481041b8cd8b4/Normet_Logo_Guidelines_-_20220318.pdf) for the supplied color variants and spacing guidance.

### RESEMIN and ZANINGROUP

The embedded descriptions of both colour SVGs identify reconstructed artwork with approximated details, not verified official masters. The monochrome RESEMIN metadata also identifies approximated machine details; the monochrome ZANINGROUP version uses white and grayscale tones.
