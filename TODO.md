# Basketball Video Analyzer Website - TODO

## Completed

- [x] Website structure, all pages functional, tip links working
- [x] Real app screenshots (5 high-res PNGs in `src/assets/screenshots/`)
- [x] OG image for social sharing (`public/images/og-image.jpg`, 1200x738)
- [x] Sitemap via `@astrojs/sitemap`
- [x] Meta descriptions on all pages
- [x] OG tags (og:title, og:description, og:image) + Twitter cards
- [x] Homepage title optimized (uses `fullTitle` prop)
- [x] AI crawlers explicitly allowed in `robots.txt`
- [x] `llms.txt` for AI discoverability
- [x] Schema.org JSON-LD: `WebSite` + `SoftwareApplication` (BaseLayout), `HowTo` (homepage)
- [x] Video demo section structure (conditional, activate by setting `DEMO_VIDEO_ID`)
- [x] Analytics ready

## Needs Content (not code)

### 1. Testimonials
Add a testimonials section to `src/pages/index.astro` once real coach quotes are available.

### 2. Demo Video
The video demo section is built but hidden. To activate:
1. Record a 2-3 minute demo showing: import → cut → organize → export
2. Upload to YouTube
3. Set `DEMO_VIDEO_ID` in `src/pages/index.astro` to the YouTube video ID

## Optional Enhancements (Nice to Have)

- Blog/News section for updates
- Changelog page showing version history
- Community showcase featuring teams using the software
- Live GitHub stats integration
