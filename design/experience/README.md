# Founder experience artwork

This directory retains downloaded and user-supplied artwork with its provenance for the homepage’s founder experience strip. The application uses the static React server component [`CompanyLogoStrip`](../../features/experience/CompanyLogoStrip.tsx), with a monochrome variant by default and an optional `colour` variant chosen at the homepage call site. Its CSS Module uses the current COMQ tokens from [`app/theme.css`](../../app/theme.css); it requires no third-party logo library or client-side state.

Alberto’s biography lives on the Our experience page at `/experiencia` and `/en/experiencia`, linked from the footer.

- **Black and white:** official white Sandvik and Normet exports and dedicated supplied ZANINGROUP and RESEMIN monochrome SVGs on COMQ’s charcoal surface.
- **Colour:** separate colour artwork on a full-width warm gray band using `--color-logo-surface` (`#f3f2ee`); Sandvik uses its black version. Neither variant applies CSS filters or blending to the logos.

The background belongs to the outer section, while its inner content retains the 1200px maximum width, padding and logo layout. There is no divider directly above or below the band; dividers between the service sections remain.

The company selection reflects **Alberto Llana’s previous professional experience**, based on his [LinkedIn profile](https://www.linkedin.com/in/alberto-llana-69018592/), with ZANINGROUP added at the site owner’s request. The site owner supplied the “Over 35 years of experience in mining” figure, which describes Alberto’s career, not COMQ’s age. These logos are not COMQ customer references or endorsements. The strip omits individual employment dates.

## Artwork and provenance

The 12 originals under `assets/` are grouped into `colour/` and `monochrome/`, with lowercase company-only filenames. They include official downloads and user-supplied artwork. The eight files below are copied unchanged to the same relative paths under `public/images/experience`. For example, `assets/colour/normet.png` maps to `public/images/experience/colour/normet.png`. Keep each source and website copy byte-identical; CSS preserves proportions and supplied clear space.

| Relative path               | Source   |
| --------------------------- | -------- |
| `colour/sandvik.svg`        | Sandvik  |
| `colour/normet.png`         | Normet   |
| `colour/resemin.svg`        | Supplied |
| `colour/zaningroup.svg`     | Supplied |
| `monochrome/sandvik.svg`    | Sandvik  |
| `monochrome/normet.png`     | Normet   |
| `monochrome/resemin.svg`    | Supplied |
| `monochrome/zaningroup.svg` | Supplied |

Four additional supplied PNG originals remain in `assets/` for design use only. The website renders their SVG counterparts; these PNGs have no runtime copies.

| Relative path               | Dimensions  |
| --------------------------- | ----------- |
| `colour/resemin.png`        | 4128 × 712  |
| `colour/zaningroup.png`     | 1254 × 1254 |
| `monochrome/resemin.png`    | 2048 × 353  |
| `monochrome/zaningroup.png` | 1254 × 1254 |

Sandvik's official downloads are [logo_dark.svg](https://www.home.sandvik/logo/logo_dark.svg) for `colour/sandvik.svg` and [logo_light.svg](https://www.home.sandvik/logo/logo_light.svg) for `monochrome/sandvik.svg`. Their SVG viewBoxes are 308 × 56.

The Normet files come from its [official logo pack](https://assets.ctfassets.net/idihyv8a6g5y/5oCLR8th6sFikjv2GiHWfh/c018e7fa330cdbc9b6e9ce502f69a7f6/Normet_Logo.zip), linked from its [media page](https://www.normet.com/en/discover-normet/about-us/media). `colour/normet.png` is the black-letter/red-O export named `Normet Primary Logo - Black Version- RGB.png` in the archive. `monochrome/normet.png` is `Normet Secondary Logo - White Version - RGB.png`. Their transparent canvas includes substantial clear space, which the component preserves when sizing the images. See the [Normet logo guidelines](https://assets.ctfassets.net/idihyv8a6g5y/4usi88Oj7jdppiZ45sptcu/c4036b3a720fbf34e7d481041b8cd8b4/Normet_Logo_Guidelines_-_20220318.pdf) for the supplied color variants and spacing guidance.

ZANINGROUP and RESEMIN use the SVGs from `monochrome/` on the default dark strip and `colour/` for the optional light band. The embedded descriptions of both colour SVGs identify reconstructed artwork with approximated details, not verified official masters. The monochrome RESEMIN metadata also identifies approximated machine details; the monochrome ZANINGROUP version uses white and grayscale tones. All four SVGs are retained and served unchanged, without CSS filters or blending.

## Image dimensions and display sizes

The component's `width` and `height` describe each website image's original canvas. Next.js uses these values to establish its aspect ratio and reserve space before loading, helping prevent layout shifts. Each company's colour and monochrome files share these dimensions, so one pair is defined per company.

| Company    | Original width × height | CSS width |
| ---------- | ----------------------- | --------- |
| Sandvik    | 308 × 56                | 184px     |
| Normet     | 2000 × 792              | 244px     |
| RESEMIN    | 2064 × 356              | 175px     |
| ZANINGROUP | 1122 × 744              | 152px     |

The original values are PNG pixels or SVG intrinsic canvas dimensions. The [CSS Module](../../features/experience/CompanyLogoStrip.module.css) controls display size: `height: auto` preserves proportions, and `max-width: 100%` allows images to shrink within narrower grid columns. Keep the original dimensions on the current path-based `<Image>` elements even when CSS sets a smaller display width.

The grid gives each company an equal column; the images have different proportions and clear space. Their individual CSS widths balance their visible sizes. Normet's visible mark occupies about 76% of its PNG canvas width, so its larger CSS width preserves the supplied padding while keeping the mark comparable to the others.
