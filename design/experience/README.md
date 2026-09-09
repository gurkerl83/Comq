# Founder experience artwork

This directory retains the downloaded source artwork and its provenance for the homepage’s founder experience strip. The application uses the static React server component [`CompanyLogoStrip`](../../features/experience/CompanyLogoStrip.tsx), with a monochrome treatment by default and an optional `colour` variant chosen in code. Its CSS Module uses the current COMQ tokens from [`app/theme.css`](../../app/theme.css); it requires no third-party logo library or client-side state.

Alberto’s biography lives on the Our experience page at `/experiencia` and `/en/experiencia`, linked from the footer.

- **Black and white:** official white company logos on COMQ’s charcoal surface; ZANINGROUP’s colour JPEG uses a CSS monochrome treatment.
- **Colour:** official artwork on a light strip so black lettering remains legible. Sandvik’s current logo is monochrome, so its black version is used here too.

The company selection reflects **Alberto Llana’s previous professional experience**, based on his [LinkedIn profile](https://www.linkedin.com/in/alberto-llana-69018592/), with ZANINGROUP added at the site owner’s request. The site owner supplied the “Over 35 years of experience in mining” figure, which describes Alberto’s career, not COMQ’s age. These logos are not COMQ customer references or endorsements. The strip omits individual employment dates.

## Official artwork

All files in `assets/` preserve the downloaded artwork byte-for-byte under descriptive local names. No logo was traced, recolored, cropped, or generated. SVGs retain their original geometry; PNGs retain their transparency and supplied clear space.

| Local asset               | Official source                                                                          | Dimensions           |
| ------------------------- | ---------------------------------------------------------------------------------------- | -------------------- |
| `sandvik-monochrome.svg`  | [Sandvik `logo_light.svg`](https://www.home.sandvik/logo/logo_light.svg)                 | 308 × 56 SVG viewBox |
| `sandvik-colour.svg`      | [Sandvik `logo_dark.svg`](https://www.home.sandvik/logo/logo_dark.svg)                   | 308 × 56 SVG viewBox |
| `normet-monochrome.png`   | Normet ZIP: `Normet Secondary Logo - White Version - RGB.png`                            | 2000 × 792           |
| `normet-colour-light.png` | Normet ZIP: `Normet Primary Logo - Black Version- RGB.png`                               | 2000 × 792           |
| `normet-colour.png`       | Normet ZIP: `Normet Primary Logo - White Version - RGB.png`                              | 2000 × 792           |
| `resemin-monochrome.png`  | [RESEMIN `logo-footer.png`](https://www.resemin.com/uploads/logo-footer.png)             | 175 × 36             |
| `resemin-colour.png`      | [RESEMIN `logo-header.png`](https://www.resemin.com/uploads/logo-header.png)             | 202 × 38             |
| `zaningroup.jpg`          | [ZANINGROUP’s official LinkedIn page](https://www.linkedin.com/company/zaningroup/jobs/) | 200 × 200 JPEG       |

ZANINGROUP’s logo was retrieved from its LinkedIn page on September 8, 2026; the company website was unavailable. Both variants use the same unchanged JPEG. On the dark strip, CSS grayscale, inversion and brightness adjustments create a monochrome treatment, with screen blending removing the appearance of its white background. This is a display treatment, not an official white logo export. The colour variant displays the original file without filters.

The Normet files come from its [official logo pack](https://assets.ctfassets.net/idihyv8a6g5y/5oCLR8th6sFikjv2GiHWfh/c018e7fa330cdbc9b6e9ce502f69a7f6/Normet_Logo.zip), linked from its [media page](https://www.normet.com/en/discover-normet/about-us/media). Their transparent canvas includes substantial clear space, which the component preserves when sizing the images. See the [Normet logo guidelines](https://assets.ctfassets.net/idihyv8a6g5y/4usi88Oj7jdppiZ45sptcu/c4036b3a720fbf34e7d481041b8cd8b4/Normet_Logo_Guidelines_-_20220318.pdf) for the supplied color variants and spacing guidance.

In this directory, `normet-colour-light.png` is the black-letter version used on the light strip; the same unchanged file is deployed as `public/images/experience/normet-colour.png`. The source asset `assets/normet-colour.png` retains the alternative white-letter/red-O version for a dark background and is not currently rendered. RESEMIN is displayed at no more than 175 pixels wide to respect the smaller white source image.
