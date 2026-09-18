# Plan 002: llms.txt lists the guides, and every production deploy pings IndexNow

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report, do not improvise. When done, update the status row for this plan
> in `plans/README.md`, unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat efd5c70..HEAD -- public/llms.txt package.json scripts src/data/guides.ts`
> Plan 001 changes `src/data/guides.ts` on purpose (slash hrefs). Any other
> change to an in-scope file since `efd5c70`: compare against the excerpts
> below, and on a mismatch treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/001-one-url-per-page-trailing-slash.md
- **Category**: direction
- **Planned at**: commit `efd5c70`, 2026-09-18

## Why this matters

ChatGPT sends this site more visits than any other project in the portfolio (126 sessions in 90 days), so answer engines already read it. The file they read first, `public/llms.txt`, describes the app but never links the six guide pages, which are the pages written to answer coach questions ("Hudl alternatives", "how to break down game film"). The repo also has an IndexNow key file in `public/` with no code that uses it, so Bing (which feeds ChatGPT search and Copilot) learns about changes only when it gets around to recrawling. After this plan, llms.txt points at the guides, and each production build tells IndexNow about every sitemap URL.

## Current state

- Astro 5 static site on Vercel. `package.json` scripts: `dev`, `build` (`astro build`), `preview`, `astro`, `check:contrast`. No test, lint or typecheck scripts.
- `@astrojs/sitemap` writes `dist/sitemap-index.xml` plus `dist/sitemap-0.xml`. The URLs are in `sitemap-0.xml` (a site this size has only one shard).
- `public/llms.txt` (38 lines) has sections: summary, `## Key Features`, `## Languages`, `## Links` (line 25: website, GitHub, releases, issues), `## Technical Details`. It has no guide links.
- `public/11333e70cd5f792b4bc1448d6d453d0b.txt` is the IndexNow key file. Under the IndexNow protocol the key is the filename stem, and the file sits at the site root so the engines can check it. No script reads it.
- `src/data/guides.ts` is the one list of guide pages (`href`, `label`, `blurb`). After plan 001 the hrefs end in `/`, for example `/hudl-alternatives/`.
- `scripts/` holds `build-icons.mjs` and `check-contrast.mjs`, both plain Node ES modules.
- A sibling project already runs the same ping. Its file is `basketball-stats-app/web/basketball-stats-web/scripts/indexnow-ping.mjs` (a different repo, for reference only). Its shape, copied from that file:
  ```js
  import { readFileSync } from "fs";
  import { resolve, dirname } from "path";
  import { fileURLToPath } from "url";

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const DIST_DIR = resolve(__dirname, "../dist");

  const HOST = "www.basketballstatsapp.com";
  const KEY = "<filename stem of the key file in public/>";
  const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

  async function main() {
    if (process.env.VERCEL_ENV !== "production") {
      console.log("indexnow-ping: skipping (not production)");
      return;
    }
    const sitemap = readFileSync(resolve(DIST_DIR, "sitemap.xml"), "utf-8");
    const urlList = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
    });
    console.log(`indexnow-ping: submitted ${urlList.length} URLs, status ${response.status}`);
  }

  try {
    await main();
  } catch (err) {
    console.error("indexnow-ping: failed, continuing build:", err.message);
  }
  ```

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Install | `npm install` | exit 0 |
| Build | `npm run build` | exit 0; last line includes `indexnow-ping: skipping (not production)` |
| Ping dry path | `VERCEL_ENV=preview node scripts/indexnow-ping.mjs` | prints the skipping line, exit 0 |

## Scope

**In scope**:
- `public/llms.txt`
- `scripts/indexnow-ping.mjs` (create)
- `package.json` (only the `build` script)

**Out of scope**:
- `public/11333e70cd5f792b4bc1448d6d453d0b.txt`. Don't rename, move or edit the key file.
- `public/robots.txt`. It already allows the AI crawlers.
- The basketball-stats-app repo. It's reference only.
- Any Google ping. Google doesn't take part in IndexNow and retired its sitemap ping endpoint.

## Git workflow

- Branch: `feat/llms-guides-indexnow`
- Commits in conventional style, e.g. `feat: list the guides in llms.txt` and `feat: ping IndexNow after production builds`
- Do NOT push or open a PR unless told to.

## Steps

### Step 1: Add a Guides section to llms.txt

Insert a `## Guides` section in `public/llms.txt` directly before `## Links` (line 25). Add one bullet per entry in `src/data/guides.ts`, in the same order, using the absolute slash URL and the entry's `blurb`:

```
## Guides

- [How to break down game film](https://basketballvideoanalyzer.com/film-breakdown/): Three passes through a game: load it, mark the plays, export the folders.
```

Copy labels and blurbs from `guides.ts` as they are. Don't write new copy.

**Verify**: `grep -c 'https://basketballvideoanalyzer.com/[a-z-]*/)' public/llms.txt` → `6`

### Step 2: Create the ping script

Create `scripts/indexnow-ping.mjs` following the reference shape above, with these differences:
- `HOST = "basketballvideoanalyzer.com"` (this site has no www; `https://www.basketballvideoanalyzer.com/` 308-redirects to the apex).
- `KEY` is the filename stem of the key file in `public/`. Read it at runtime so the value isn't duplicated in code: list `public/`, take the one file whose name matches `/^[0-9a-f]{32}\.txt$/`, strip `.txt`. If there isn't exactly one match, log a message and return (don't throw).
- Read `dist/sitemap-0.xml` instead of `sitemap.xml`.
- Keep the production-only guard and the catch-all `try/catch`. The build must never fail because of the ping.

**Verify**: `VERCEL_ENV=preview node scripts/indexnow-ping.mjs; echo "exit $?"` → `indexnow-ping: skipping (not production)` then `exit 0`

### Step 3: Run it after the build

Change `package.json` `build` from `astro build` to `astro build && node scripts/indexnow-ping.mjs`. Leave `check:contrast` alone. It calls `astro build` directly, so it won't ping.

**Verify**: `npm run build` → exit 0, and the output includes `indexnow-ping: skipping (not production)`

## Test plan

This repo has no test runner, and adding one for a 40-line script isn't worth it. Check by hand:
- Step 2 and Step 3 verifications (the non-production path).
- Error path: `VERCEL_ENV=production node -e "globalThis.fetch=()=>Promise.reject(new Error('offline'));import('./scripts/indexnow-ping.mjs')"` → prints `indexnow-ping: failed, continuing build: offline`, exit 0. Before running it, make sure `dist/sitemap-0.xml` exists (run the build first).
- After the first production deploy, the Vercel build log shows `indexnow-ping: submitted N URLs, status 200` or `202`, where N is the number of `<loc>` entries in `dist/sitemap-0.xml` (7 at the time of writing).

## Done criteria

- [ ] `grep -c '## Guides' public/llms.txt` → `1`, and the 6 guide URLs from Step 1 are present
- [ ] `scripts/indexnow-ping.mjs` exists and has no hard-coded 32-character hex string: `grep -cE '[0-9a-f]{32}' scripts/indexnow-ping.mjs` → `0`
- [ ] `npm run build` exits 0 and prints the skipping line
- [ ] `git status` shows only the three in-scope paths changed
- [ ] `plans/README.md` row for 002 updated

## STOP conditions

- `dist/sitemap-0.xml` doesn't exist after the build (the sitemap integration renamed or split its output). Report the files in `dist/` matching `sitemap*`.
- Plan 001 hasn't landed (`grep -c "/'," src/data/guides.ts` is not 6). The llms.txt URLs would point at redirecting URLs, so wait for 001.
- The production build log shows a 403 or 422 from IndexNow. That means the key file isn't being served at the site root; report it instead of changing the key.

## Maintenance notes

- A new guide page belongs in `src/data/guides.ts` and in the `## Guides` section of `llms.txt`. The two lists are kept in sync by hand. If they drift more than once, generate llms.txt at build time from `guides.ts`.
- IndexNow accepts up to 10,000 URLs per request, far above this site's size.
- The same key file is used by other portfolio sites (fpb-calendar, bitola). That's allowed: IndexNow checks the key per host.
