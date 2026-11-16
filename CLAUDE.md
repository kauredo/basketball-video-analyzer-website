# Basketball Video Analyzer website

Astro 5 static site for the free desktop app. The app lives in `../app` (its own repo, with most plans in `app/plans/`); the feedback worker in `../worker`.

- `npm run build` is the only gate. Check `dist/` with grep for anything SEO-shaped (canonical, JSON-LD, sitemap). `src/utils/assets.test.ts` runs with `node --experimental-strip-types --test`.
- Every URL ends in a slash (`trailingSlash: "always"`, plan 001). Internal links and JSON-LD URLs use the slash form.
- `src/data/guides.ts` is the one list of guide pages. Add a page there and in `public/llms.txt`.
- A tagged app release pings the Vercel deploy hook, which rebuilds the site with the new version. A push to `main` deploys too.
- `docs/design-system.md` says who the site is for; `docs/DESIGN.md` holds the tokens (Scorebook: warm paper, teal accent, 1px rules). Match them.
- Copy is read by coaches and by answer engines. Plain sentences, no em dashes, no invented numbers or competitor prices without a source and a date.
- Conventional commits, squash-merged PRs. Screenshots for PRs go on the `pr-assets` branch; never delete it.
