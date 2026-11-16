# Basketball Video Analyzer website

The marketing site for [Basketball Video Analyzer](https://github.com/kauredo/basketball-video-analyzer), a free desktop app for cutting and tagging basketball game film. Live at https://basketballvideoanalyzer.com.

Astro 5, static output, Tailwind 3, deployed on Vercel. One React island: the download button.

## Run it

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # the only gate; there is no lint or typecheck script
npm run preview
```

`src/utils/assets.test.ts` covers the release-asset parser: `node --experimental-strip-types --test src/utils/assets.test.ts`.

## How the download button works

At build time `src/utils/github.ts` reads the latest release of the app repo from the GitHub API, and `src/utils/assets.ts` sorts its files into one download per platform. If the API call fails, `src/utils/fallback.ts` links to the releases page instead. The site only learns about a new release when it is rebuilt, so the app's `release.yml` calls a Vercel deploy hook after every tagged release (`scripts/setup-deploy-hook.sh` in the app repo sets it up).

## Environment

| Variable | Needed for |
|---|---|
| `GITHUB_TOKEN` | Optional. Raises the GitHub API rate limit during the build. |
| `PUBLIC_GA_MEASUREMENT_ID` | Google Analytics. Left unset, no analytics script loads. |

## Layout

- `src/pages/`: the home page plus six guide pages (Hudl alternatives, film breakdown, scouting, and so on). `src/data/guides.ts` is the one list of guides; the footer and the related-guides block read it.
- `src/layouts/BaseLayout.astro`: meta tags, JSON-LD, analytics.
- `public/llms.txt`: the summary answer engines read.
- `docs/DESIGN.md` and `docs/design-system.md`: the visual system the site shares with the app.
- `plans/`: SEO plans for this repo. Most plans for the product live in the app repo's `plans/`.
