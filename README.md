# The Supply Chain Project — Website

A conversion-first, static HTML/CSS/JS website for **The Supply Chain Project (TSCP)**,
built from the *TSCP Website Build Brief v1.0* and the *TSCP Brand Guidelines v1.0*.
Clean, professional UI inspired by GrowGood & CharityX, expressed entirely through
the TSCP brand system (Harbor Navy, Route Teal, Cargo Gold, Signal Red for actions only).

## Folder structure

```
supplychain/
├── index.html            # Homepage — conversion router
├── volunteer.html        # /volunteer  landing page (ad destination)
├── nonprofit.html        # /nonprofit  landing page (ad destination)
├── donate.html           # /donate     landing page (ad destination)
├── partner.html          # /partner    landing page (ad destination)
├── about.html            # About us
├── what-we-do.html       # What we do / how it works
├── resources.html        # Blog, guides, FAQ (FAQPage schema)
├── contact.html          # Contact form
├── 404.html              # Custom 404 — routes back into the site
├── robots.txt            # Allows crawling, points to sitemap
├── sitemap.xml           # XML sitemap
├── css/
│   ├── styles.css        # Design system: tokens, components, all sections
│   └── responsive.css    # Mobile-first breakpoints (floor: 375px)
├── js/
│   └── main.js           # Nav, counters, slider, forms, GA4 event stubs
└── images/
    ├── logo/             # Hub marks + wordmark lockups (SVG)
    ├── icons/            # (reserved)
    └── backgrounds/      # (reserved)
```

## Logos

The `images/logo/` folder currently contains recreated Hub marks so the site renders
out of the box. **To use your official brand files, simply overwrite these with the
same filenames** — no code changes needed:

- `tscp-mark-full-color.svg`, `tscp-mark-navy.svg`, `tscp-mark-white.svg`
- `tscp-logo-navy.svg`, `tscp-logo-white.svg`, `tscp-logo-reversed.svg`

## Brand system (baked into `css/styles.css`)

| Token | Value | Use |
|------|-------|-----|
| Harbor Navy | `#17323F` | Text, structure, headers, footers |
| Route Teal / Deep Teal | `#00ACAB` / `#007B7A` | Accents, hovers, links |
| Cargo Gold | `#F9D076` | Badges, highlights |
| **Signal Red** | `#C43D59` | **Donate / Register actions ONLY** |
| Paper / Mist / Cloud / Slate | `#FAF9F6` / `#F1EFEA` / `#DAD7CF` / `#5A6C77` | Neutrals |

Fonts: **Nunito** (display), **IBM Plex Sans** (body/UI), **IBM Plex Mono** (data).
The "Route" motif (dotted path → waypoints → bullseye) recurs throughout.

## Conversion tracking (brief Section 08)

Forms fire GA4-ready events via `window.tscpTrack()` in `js/main.js`. Event names match
the brief exactly so they can be imported into Google Ads as conversions:

`volunteer_register` · `nonprofit_register` · `partner_register` · `donate_start` ·
`donate_complete` · `email_signup`

To go live: add your GA4 **Google Tag** in each page `<head>`, and the stub will route
events to `gtag()`/`dataLayer` automatically. Donation and registration forms are
currently front-end demos — wire them to your backend / donation processor before launch.

## Notes for launch (from the brief)
- Set up the 301 redirect map (brief Section 10) on the server.
- Point Performance Max only at `/volunteer`, `/nonprofit`, `/donate`, `/partner`.
- Confirm HTTPS + valid SSL, GA4 ↔ Google Ads link with auto-tagging on.
- Run the pre-launch QA checklist in brief Section 11.

Built as a static site; the structure ports cleanly into a WordPress theme (each
root `.html` becomes a page template; `css/` and `js/` enqueue as theme assets).
