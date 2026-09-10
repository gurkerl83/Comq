# Founder experience artwork

This directory retains downloaded and user-supplied artwork, plus SVG conversions of official vector artwork, with provenance for the homepage’s founder experience strip. The static server component [`CompanyLogoStrip`](../../features/experience/CompanyLogoStrip.tsx) renders both logo sets. Its CSS Module selects the visible set from the root `data-theme` attribute, controlled by the shared theme provider and manual header toggle. Artwork selection uses CSS without animation and consumes the COMQ tokens from [`app/theme.css`](../../app/theme.css).

Alberto’s biography lives on the Our experience page at `/experiencia` and `/en/experiencia`, linked from the footer.

- **Dark/default theme:** Sandvik’s official white SVG, Normet’s white SVG converted from its official EPS, and dedicated supplied ZANINGROUP and RESEMIN monochrome SVGs on COMQ’s charcoal surface.
- **Light theme:** separate colour artwork on a full-width warm gray band; Sandvik uses its black version. Neither theme applies CSS filters or blending to the logos.

The band palette pair is defined in `app/theme.css`: `--color-logo-surface` aliases `--color-surface` (`#111` dark, `#eae8e1` light), while `--color-on-logo-surface` uses `--color-text` (white) in dark mode and `#545454` in light mode. The outer `.section` consumes both tokens and `.heading` inherits the foreground. Root-theme selectors choose the artwork, not its palette.

The inactive logo set uses `display: none`, so its duplicate names are also absent from the accessibility tree. The shared provider remembers the manual theme choice across page and language loads; dark is the default and system preference detection is disabled.

The background belongs to the outer section, while its inner content retains the 1200px maximum width, padding and logo layout. There is no divider directly above or below the band; dividers between the service sections remain.

The company selection reflects **Alberto Llana’s previous professional experience**, based on his [LinkedIn profile](https://www.linkedin.com/in/alberto-llana-69018592/), with ZANINGROUP added at the site owner’s request. The site owner supplied the “Over 35 years of experience in mining” figure, which describes Alberto’s career, not COMQ’s age. These logos are not COMQ customer references or endorsements. The strip omits individual employment dates.

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

Four additional supplied PNG originals remain in `assets/` for design use only. The website renders their SVG counterparts; these PNGs have no runtime copies.

| Relative path               | Dimensions  |
| --------------------------- | ----------- |
| `colour/resemin.png`        | 4128 × 712  |
| `colour/zaningroup.png`     | 1254 × 1254 |
| `monochrome/resemin.png`    | 2048 × 353  |
| `monochrome/zaningroup.png` | 1254 × 1254 |

The two official Normet PNG originals, `colour/normet.png` and `monochrome/normet.png`, remain unchanged in `assets/` as color and appearance references. Both are 2000 × 792. The website uses their SVG counterparts.

Sandvik's official downloads are [logo_dark.svg](https://www.home.sandvik/logo/logo_dark.svg) for `colour/sandvik.svg` and [logo_light.svg](https://www.home.sandvik/logo/logo_light.svg) for `monochrome/sandvik.svg`. Their SVG viewBoxes are 308 × 56.

The Normet files come from its [official logo pack](https://assets.ctfassets.net/idihyv8a6g5y/5oCLR8th6sFikjv2GiHWfh/c018e7fa330cdbc9b6e9ce502f69a7f6/Normet_Logo.zip), linked from its [media page](https://www.normet.com/en/discover-normet/about-us/media). `colour/normet.svg` derives directly from `Normet Primary Logo - Black Version - CMYK.eps`, and `monochrome/normet.svg` from `Normet Secondary Logo - White Version - CMYK.eps`. Each SVG contains two filled compound paths, with no embedded bitmap or fonts. The colour file is 2862 bytes and the monochrome file is 2861 bytes. Their RGB fills match the official digital PNG exports: black `#000000`, red `#e2241b` and white `#ffffff`. The retained `colour/normet.png` is the black-letter/red-O export named `Normet Primary Logo - Black Version- RGB.png` in the archive; `monochrome/normet.png` is `Normet Secondary Logo - White Version - RGB.png`.

To regenerate the Normet SVGs, retrieve the EPS originals from the official pack and convert their `mo`, `li`, `cv` and `cp` path operations to SVG `M`, `L`, `C` and `Z`, preserving all coordinates and the nonzero fill rule. The path coordinates in these EPS files already follow a top-down canvas after their page setup, so retain them without a vertical flip. Use a transparent 2000 × 792 SVG canvas, rounding only the EPS canvas height of 791.8429 to match the official PNG canvas and clear space. Check the RGB fills against the official PNG exports and visually compare both variants before copying the SVGs byte-identically to `public/`. This is direct vector conversion without AI reconstruction or raster tracing. The EPS files remain available in the official archive; the repository contains neither the EPS originals nor a conversion generator. See the [Normet logo guidelines](https://assets.ctfassets.net/idihyv8a6g5y/4usi88Oj7jdppiZ45sptcu/c4036b3a720fbf34e7d481041b8cd8b4/Normet_Logo_Guidelines_-_20220318.pdf) for the supplied color variants and spacing guidance.

ZANINGROUP and RESEMIN use the SVGs from `monochrome/` in dark mode and `colour/` in light mode. The embedded descriptions of both colour SVGs identify reconstructed artwork with approximated details, not verified official masters. The monochrome RESEMIN metadata also identifies approximated machine details; the monochrome ZANINGROUP version uses white and grayscale tones. All four SVGs are retained and served unchanged, without CSS filters or blending.

## Image dimensions and display sizes

The component's `width` and `height` describe each website image's original canvas. Next.js uses these values to establish its aspect ratio and reserve space before loading, helping prevent layout shifts. Each company's colour and monochrome files share these dimensions, so one pair is defined per company.

| Company    | Original width × height | CSS width |
| ---------- | ----------------------- | --------- |
| Sandvik    | 308 × 56                | 184px     |
| Normet     | 2000 × 792              | 244px     |
| RESEMIN    | 2064 × 356              | 175px     |
| ZANINGROUP | 1122 × 744              | 152px     |

The original values are SVG intrinsic canvas dimensions. The [CSS Module](../../features/experience/CompanyLogoStrip.module.css) controls display size: `height: auto` preserves proportions, and `max-width: 100%` allows images to shrink within narrower grid columns. Keep the original dimensions on the current path-based `<Image>` elements even when CSS sets a smaller display width.

Next.js serves all eight SVGs directly. SVGs do not need a `sizes` hint because they have no raster size variants.

The static grid has four equal columns above 640px and two at 640px or below, without scrolling or animation. The images have different proportions and clear space. Their individual CSS widths balance their visible sizes. Normet's visible mark occupies about 76% of its canvas width, so its 244px CSS width preserves the supplied padding while keeping the mark comparable to the others.
