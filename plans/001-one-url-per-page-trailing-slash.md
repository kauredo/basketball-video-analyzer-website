# Plan 001: Every page has one URL, the one with the trailing slash

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report, do not improvise. When done, update the status row for this plan
> in `plans/README.md`, unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat efd5c70..HEAD -- astro.config.mjs vercel.json src/data/guides.ts src/pages src/components/ui/RelatedGuides.astro src/layouts/BaseLayout.astro`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `efd5c70`, 2026-09-18

## Why this matters

Every guide page answers on two URLs, `/hudl-alternatives` and `/hudl-alternatives/`, and both return 200. The canonical tag and the sitemap name the slash form, but every internal link, the footer, the navbar and every BreadcrumbList in the structured data use the form without the slash. Google Search Console reports the two as separate pages: over the last 28 days `/hudl-alternatives/` sat at average position 4 and `/hudl-alternatives` at position 26. After this plan there is one URL per page (the slash form, which is already the canonical and the stronger one), the host redirects the other form, and the site's own links agree with its canonical.

## Current state

This is an Astro 5 static site deployed on Vercel. Pages are built as `dist/<slug>/index.html` (Astro's default `build.format: 'directory'`).

- `astro.config.mjs`: no `trailingSlash` option, so Astro uses its default `'ignore'`. It declares two redirects that must keep working:
  ```js
  // astro.config.mjs:8-13
  export default defineConfig({
    site: "https://basketballvideoanalyzer.com",
    redirects: {
      "/download": "/",
      "/pricing": "/",
    },
  ```
- `vercel.json`: only a `headers` block (security headers for `/(.*)`). No `trailingSlash`, no redirects. With no rule, Vercel serves `dist/hudl-alternatives/index.html` for both URL forms.
- `src/layouts/BaseLayout.astro:29` builds the canonical from the request path, and `:46` emits it. On a static build `Astro.url.pathname` is the slash form, which is why every canonical in `dist/` ends in `/`:
  ```astro
  const canonicalURL = new URL(Astro.url.pathname, Astro.site);
  ...
  <link rel="canonical" href={canonicalURL} />
  ```
- `@astrojs/sitemap` writes `dist/sitemap-index.xml` and `dist/sitemap-0.xml` with slash URLs (`/film-breakdown/`, `/hudl-alternatives/`, ...).
- `src/data/guides.ts:10-17` is the single list of guide pages. Its hrefs have no slash, and `Footer.astro:10`, `Navbar.astro:66` and `RelatedGuides.astro:26` all render `g.href` directly:
  ```ts
  export const guides: Guide[] = [
    { href: '/film-breakdown', label: 'How to break down game film', ... },
    { href: '/for-coaches', ... },
    { href: '/scouting', ... },
    { href: '/free-alternative', ... },
    { href: '/vs-inbound-studio', ... },
    { href: '/hudl-alternatives', ... },
  ];
  ```
- `src/components/ui/RelatedGuides.astro:15` hides the current page by comparing `g.href !== current`. Each page passes `current` without a slash, so **if you change the hrefs you must change these props too**, or every guide page starts linking to itself:
  - `src/pages/hudl-alternatives.astro:178` `current="/hudl-alternatives"`
  - `src/pages/for-coaches.astro:94` `current="/for-coaches"`
  - `src/pages/film-breakdown.astro:115` `current="/film-breakdown"`
  - `src/pages/scouting.astro:94` `current="/scouting"`
  - `src/pages/vs-inbound-studio.astro:159` `current="/vs-inbound-studio"`
- One inline link: `src/pages/hudl-alternatives.astro:48` `<a href="/free-alternative" ...>`.
- JSON-LD in each guide page uses no-slash absolute URLs, both in the page's own `"url"` field and in the BreadcrumbList `"item"`:
  - `hudl-alternatives.astro:186` (`"url"`) and `:218` (`"item"`)
  - `for-coaches.astro:104` and `:113`
  - `scouting.astro:104` and `:113`
  - `vs-inbound-studio.astro:167` and `:199`
  - `film-breakdown.astro:125` and `:134`
  - `free-alternative.astro:150` and `:182`
  Leave `index.astro:401` and `BaseLayout.astro:106` alone. Those point at an image file, `/images/og-image.jpg`.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Install | `npm install` | exit 0 |
| Build | `npm run build` | exit 0, `dist/` written |
| Find no-slash internal hrefs in the output | `grep -rhoE 'href="/[a-z][a-z0-9-]*"' dist --include=*.html \| sort -u` | no output |
| Find no-slash absolute site URLs in the output | `grep -rhoE 'https://basketballvideoanalyzer\.com/[a-z][a-z0-9-]*"' dist --include=*.html \| sort -u` | no output |
| Sitemap URLs | `grep -oE '<loc>[^<]+</loc>' dist/sitemap-0.xml` | every page URL ends in `/` |

There are no test, lint or typecheck scripts in this repo, and `@astrojs/check` isn't installed. The build plus the greps over `dist/` are the verification.

## Scope

**In scope** (the only files you should modify):
- `astro.config.mjs`
- `vercel.json`
- `src/data/guides.ts`
- `src/pages/hudl-alternatives.astro`, `for-coaches.astro`, `film-breakdown.astro`, `scouting.astro`, `vs-inbound-studio.astro`, `free-alternative.astro` (only the hrefs, `current=` props and JSON-LD URLs listed above)

**Out of scope** (do NOT touch):
- `src/layouts/BaseLayout.astro`. The canonical logic is already right.
- Anchor links such as `/#download` in `Navbar.astro:50`. They point at the homepage, which is already `/`.
- External links (GitHub, releases) and image or asset URLs (`/images/...`, `/favicon.svg`).
- `public/llms.txt`. Plan 002 rewrites it.
- The page content and titles.

## Git workflow

- Branch: `fix/trailing-slash-urls`
- One commit is fine. Message style matches `git log` (conventional commits), e.g. `fix: give every page one URL, with the trailing slash`
- Do NOT push or open a PR unless the operator told you to. This repo merges through GitHub PRs.

## Steps

### Step 1: Tell Astro and Vercel which form is correct

In `astro.config.mjs`, add `trailingSlash: "always",` inside `defineConfig({...})` next to `site`. Keep the `redirects` block as it is.

In `vercel.json`, add `"trailingSlash": true` as a top-level key beside `"headers"`. With it, Vercel answers `/hudl-alternatives` with a 308 redirect to `/hudl-alternatives/`. Vercel leaves paths with a file extension alone, so `/llms.txt`, `/sitemap-index.xml` and `/robots.txt` keep resolving directly.

**Verify**: `node -e "JSON.parse(require('fs').readFileSync('vercel.json','utf8')).trailingSlash===true||process.exit(1)"` → exit 0, and `grep -n 'trailingSlash' astro.config.mjs` → one line with `"always"`.

### Step 2: Add the slash to the guide list and the `current` props

In `src/data/guides.ts`, change each `href` to end in `/` (`'/film-breakdown/'`, `'/for-coaches/'`, `'/scouting/'`, `'/free-alternative/'`, `'/vs-inbound-studio/'`, `'/hudl-alternatives/'`).

In the five pages that render `<RelatedGuides ... current="..." />`, add the trailing slash to `current` so it still matches the new href.

**Verify**: `grep -n "href: '/" src/data/guides.ts | grep -vc "/'," ` → `0`, and `grep -rn 'current="/' src/pages | grep -v '/"'` → no output.

### Step 3: Fix the inline link and the JSON-LD URLs

- `src/pages/hudl-alternatives.astro:48`: change `href="/free-alternative"` to `href="/free-alternative/"`.
- In each of the six guide pages, add the trailing slash to the page's own `"url"` value and to the BreadcrumbList position-2 `"item"` value (lines listed in Current state). Don't touch the position-1 `"item"`, which is already `https://basketballvideoanalyzer.com/`.

**Verify**: `grep -rnE 'basketballvideoanalyzer\.com/[a-z-]+"' src/pages` → no output.

### Step 4: Build and check the output

**Verify** (all three):
- `npm run build` → exit 0
- `grep -rhoE 'href="/[a-z][a-z0-9-]*"' dist --include=*.html | sort -u` → no output
- `grep -rhoE 'https://basketballvideoanalyzer\.com/[a-z][a-z0-9-]*"' dist --include=*.html | sort -u` → no output

Also confirm the redirects still exist: `ls dist/download/index.html dist/pricing/index.html` → both listed.

## Test plan

There is no test runner here, so the greps in Step 4 act as the regression check. After deploy, check the live behaviour by hand or have the operator run:
- `curl -sI https://basketballvideoanalyzer.com/hudl-alternatives | head -3` → `308` with `location: /hudl-alternatives/`
- `curl -sI https://basketballvideoanalyzer.com/hudl-alternatives/ | head -1` → `200`
- `curl -sI https://basketballvideoanalyzer.com/llms.txt | head -1` → `200` (no redirect)
- `curl -sI https://basketballvideoanalyzer.com/download | head -3` → a redirect, and following it (`curl -sL -o /dev/null -w '%{url_effective}' ...`) ends on the homepage.

## Done criteria

- [ ] `npm run build` exits 0
- [ ] Both `dist/` greps in Step 4 print nothing
- [ ] `grep -oE '<loc>[^<]+</loc>' dist/sitemap-0.xml` shows only URLs ending in `/`
- [ ] No guide page's "More guides" list links to itself. This prints nothing: `for s in hudl-alternatives for-coaches film-breakdown scouting vs-inbound-studio; do node -e "const h=require('fs').readFileSync('dist/$s/index.html','utf8');const n=h.split('aria-label=\"Related guides\"')[1]||'';if(n.split('</nav>')[0].includes('href=\"/$s/\"'))console.log('self-link: $s')"; done`
- [ ] `git status` shows changes only in the in-scope files
- [ ] `plans/README.md` row for 001 updated

## STOP conditions

Stop and report back if:

- The build fails after adding `trailingSlash: "always"`, especially an error about the `/download` or `/pricing` redirects.
- `dist/` contains a page other than the six guides, the homepage and 404, with an internal link the greps catch that isn't listed in this plan. Report the file instead of guessing a fix.
- After deploy, `/llms.txt`, `/robots.txt` or `/sitemap-index.xml` redirects to a slash URL.
- Any in-scope file differs from the excerpts above (drift).

## Maintenance notes

- A new guide page needs a slash href in `src/data/guides.ts`, a matching `current="/slug/"` prop, and slash URLs in its JSON-LD. The Step 4 greps catch a miss, so run them whenever a page is added.
- Google takes a few weeks to fold the no-slash URL into the slash one once it sees the 308. The Search Console page report should show the no-slash URL as "Page with redirect" after that.
- Plan 002 depends on this one, because the llms.txt links it adds use the slash form.
