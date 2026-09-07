# Design audit: Basketball Video Analyzer, 2026-09-07

Both surfaces were captured. The marketing site came from production at
basketballvideoanalyzer.com, all 7 routes. The Electron app came from a local
boot of `app/` at v1.7.2, driven through Playwright against an isolated
user-data directory seeded with one project, 15 categories, 6 players and 8
clips, 13 states. Nothing was left unreached.

Two things the local boot did to the app captures, told to every critic up
front so they would not read them as design defects: the loaded video is a
generated placeholder (dark green, the words PLACEHOLDER FOOTAGE, a running
timecode), and the clip titles, categories and player names are seeded scouting
data rather than product copy.

## Scores

| Dimension | Score |
|---|---|
| Mark | 2/10 |
| Brand | 4/10 |
| Colour | 4/10 |
| Type | 6/10 |
| Composition | 5/10 |
| Copy | 7/10 |
| Interaction | 4/10 |
| States | 4/10 |

## The verdict

**Rebrand the product.**

The rule that produced it: the brand critic returned a mark verdict of START
OVER, and you answered that the product has a few early users rather than daily
ones. Under those two conditions the audit routes to `build-ui` from step 1
with the direction hunt included, plus `ui-ux-pro-max:design` for the mark
itself.

Read the word "rebrand" narrowly here. The expensive, genuinely broken parts
are the mark and the fact that the site and the app share no accent, no
typeface and no name. The site's typography and its writing are the two best
things in this audit, and they are on the keep-list below, not on the table.

### Keep-list

These came out of the flavour test. A rebrand that carries them forward beats
one that starts from nothing, and a fix that drops any of them is a regression.

- **Z and M as a two-key vocabulary**, printed into the controls themselves:
  "Mark In (Z)", "Mark Out (M)", and the hint "Press Z to mark the start of a
  clip, M to mark the end."
- **The `└` branch glyph in category chips.** Nested tags render as
  `└ Pick & Roll`, `└ Zone Defense`, each outlined in its parent's colour.
- **Per-category timeline swimlanes**, one lane per category with coloured
  markers.
- **The quarter row in Create Clip**: Q1 Q2 Q3 Q4 OT, with "Shot location
  (optional)" beneath it.
- **The voice.** "I got tired of scrubbing through game tapes in VLC, so I
  built this. Mark plays, organize clips, export folders. That's it." And
  "This isn't a Hudl replacement, and I won't pretend it is." And "Those are
  real features. If you need them, pay for them." And, under the comparison
  table, "A couple of rows say 'check their feature list' where I couldn't
  confirm the current state from the outside, and I'd rather say that than
  guess."
- **"This relies on YouTube's service and may not always work."** The best
  string in the desktop app. It names the dependency and admits the failure
  mode.
- **Space Grotesk on warm paper.** The site's type pairing is a real choice and
  it reads as a considered indie tool, which is what this is.
- **The Select Project screen.** Dashed green create affordance, solid card for
  import, muted card for YouTube. The app's best colour work.

## The one thing

**Collapse the two identities into one accent and one typeface.**

The site's accent is basketball orange `#FF6B35` (`website/tailwind.config.cjs`,
`primary.500`). The app's is green `#4CAF50`
(`app/src/renderer/styles/variables.css:5`). Both do the identical job, the
primary action. The site loads Space Grotesk and DM Sans; the app declares no
face at all and falls back to `-apple-system, BlinkMacSystemFont, "Segoe UI",
"Roboto"` at `app/src/renderer/index.html:11`, so the same wordmark renders as
SF Pro on a Mac, Segoe UI on Windows and Roboto on Linux.

It outranks the other four top changes for two reasons. Four of the five
critics reached it independently from different evidence, which none of the
other findings managed. And every other fix in this audit lives inside one
surface, while this one is the only defect that exists *between* them, at the
exact moment a coach clicks Download and opens what looks like different
software.

Testing on a Mac hides half of it, because SF Pro and the site's faces are
close enough to pass a glance.

## Per dimension

### Mark, 2/10, START OVER

The site header mark is a 24×24 viewBox at `stroke-width: 1.5`, one circle path
plus three seam arcs, inline in `website/src/components/ui/Navbar.astro`. That
is the standard construction of a stock 24px icon-set basketball, set next to
"Basketball Analyzer" in Space Grotesk Semibold. Assembled, and the two halves
come from different shelves.

There is a second mark. `app/assets/icon.png` is a heavy black filled
basketball, byte-identical to `website/public/favicon.png` and
`website/public/images/icon.png`. So the navbar shows a thin outline ball while
the browser tab beside it shows a heavy filled ball. Two basketballs, visible
at the same moment.

At 16px it fails. The seams merge into the rim and it renders as a grey
smudged circle with a vertical bar. At 512px it is legible and anonymous.

The failure type is the stock-cutlery one. The product cuts film into
categorised clips; the mark says "basketball" and stops. It would sit equally
well on a league scheduler or a scores app. The app already owns a better idea
and does not use it: two keys bracketing a moment, drawn as a green Mark In pin
and a red Mark Out pin.

Change that moves it: draw one mark from the product's gesture rather than its
category noun, the in/out bracket around a moment, and ship it as a single
asset used by `Navbar.astro`, the favicon set and the Electron header.

### Brand, 4/10

Nothing shared crosses the boundary between the two repos. Accent, typeface and
name all differ, covered above and in the routing table.

Four names for one product. The navbar says "Basketball Analyzer"
(`Navbar.astro:16`). Page titles and the app header say "Basketball Video
Analyzer". The comparison table on `/vs-inbound-studio` labels its own column
"This tool". And every product screenshot on the home page shows a titlebar
reading **"Basketball Clip Cutter"**, an older build with an older category
tree. The site's proof images advertise a product name that no longer exists.

Two visual systems on one site. Home is illustrated: 3D basketball, faint court
lines, display type at 60px. The six SEO routes are a plain warm-white
document, one centred column, no imagery and no product shot. Six of seven
routes carry no identity below the navbar icon.

Change that moves it: settle on "Basketball Video Analyzer" everywhere, then
reshoot the screenshots.

### Colour, 4/10

The accent plays six roles on the landing page: primary CTA fill, three feature
icons (`index.astro:80,92,104`), the `→` arrows in
`ui/RelatedGuides.astro:27`, link hover, the focus ring (`global.css:35`), and
a tinted drop glow under the button (`global.css:36,40`). Only the first is
"act here."

Inside the app two colour systems collide. Category colour is identity;
green is primary action. `--color-primary` and `--color-success` are the same
hex, `#4caf50`, at `variables.css:5` and `:11`, so the app cannot distinguish
"do this" from "that worked." The light-theme block at `:119` redefines
`--color-primary` to `#2e7d32` and leaves `--color-success` at `#4caf50`.
Sampled from the captures, the selected "All (8)" filter chip and the
Transition category are both `#54A44B`; the Mark Out button and the Turnovers
category are both `#E44A34`.

Category colours also fail at separating categories. Seven of 45 pairs measured
under ΔE 22, with Rebounding `#8926A4` against Offensive Rebound `#9940B1` at
ΔE 9.0. Five of ten categories sit in the orange band. Scanning a timeline for
one category is the app's core visual task.

Contrast, measured and independently recomputed:

| Ratio | Where |
|---|---|
| 2.85:1 | white label on the site's primary button `#FF6B35` |
| 2.84:1 | white on the app's `#4caf50` (Export Clips, selected filter chips) |
| 2.36:1 | white on `#66bb6a`, the **Mark In (Z)** button |
| 1.67:1 | the "1 / 2 / 3" step numerals, warm-200 on the court peach |
| 2.21:1 | hero subhead `#8B7355` on the darker court peach |
| 2.96:1 | the "Now in 11 languages" line, `text-xs text-warm-500` |
| 4.34:1 | landing body copy, warm-600 on warm-50, just under AA |
| 6.34:1 | sub-page body copy, warm-700, a different brown from the home page |

Changes that move it: give the accent one job and split
`--color-primary` from `--color-success`; then darken the orange to about
`#D9481B` for a 4.5:1 white label and add `--color-success` to the light-theme
block.

### Type, 6/10

The site's pairing does real work. The app made no typographic choice at all,
covered in The one thing.

The landing route runs nine size steps, three weights, two families and six
text colours, which is at least 11 rendered styles. Five cover the page. The
six sub-pages set `max-w-3xl`, and a line of the LongoMatch paragraph on
`hudl-alternatives` measures 82 characters. Those are the pages people actually
read.

Changes that move it: declare DM Sans and Space Grotesk in the app; fold the
landing route to six styles and drop the sub-pages to `max-w-2xl`.

### Composition, 5/10

**The app.** `workspace.png` is the screen every user lives in, and the film
gets 325px of a 900px window, about 36%. Below it sit five separate full-width
bands, each with its own background: scrub bar, transport row, hint banner,
mark row, bottom panel header. The eye crosses four horizontal edges to travel
from the film to the clip list. Pressing Z stacks a second banner under the
first without removing it, and the video pane drops from 325px to 217px, so one
keystroke costs a third of the film height and the layout jumps.

Clip titles truncate mid-word with no ellipsis ("Corner three off the wea", cut
at x=340) while the timeline to their right has room to spare. The Clip
Creator, Statistics and Settings modals are all sliced by the 900px window, and
Create Clip's commit button sits below the fold with no sticky footer. The
Settings "Theme" row puts its label at x=152 and its button at x=1148 with
750px of nothing between them. `shortcuts.png` is the best-composed screen in
the set.

**The site.** The home page's first 900px hold a heading, a lede, one button
and a rendered ball. The app screenshot starts at y≈1078, so the strongest
asset on the page sits below the fold. "Okay, a few more things" is a 2×2 of
four heading-and-paragraph blocks with no images and no size variation, and it
demotes present mode, telestration, player tagging and the stats dashboard to
body copy after three other features each got a full pinned section. "Coaching
guides" is six text links, and the footer immediately below repeats the same
six. It is also the only section on the page that changes axis, jumping from
x=176 to x≈367.

Not one of the six sub-pages shows the product. `free-alternative` argues for
the app in a comparison table with three columns of "Yes" while the app is
never pictured.

On the phone the two layouts diverge. The mobile hero drops the court gradient
and the ball, replacing them with 310px of empty above the heading and 335px
below the platform line. The art reappears about 3000px down, where "One click
exports all your clips into category-based folders" runs across the ball's dark
seam and is close to unreadable. The home page is 8685 CSS px on a phone.

Changes that move it: rebuild the workspace's vertical budget so the film gets
roughly 55%, and design the phone hero and the shared footer as their own
layouts.

### Copy, 7/10

The site's copy is the least model-shaped in the portfolio. No "beautiful", no
"seamless", no "See how it works". The CTA carries a version number and a file
size instead of an adjective. Sub-pages argue for the competitor. The app's
strings did not get the same pass and pull the score down.

What survived the rewrite: the rule of three four times in one scroll ("Mark
plays, organize clips, export folders", "cut, tag, export", "No subscriptions,
no feature gates, no data collection", "offense, defense, transitions"); em
dashes in every `<title>` tag; and one aphoristic closer, "Built because
coaches deserve better tools."

The worst string is factual rather than stylistic. The home feature card and
the `/film-breakdown` keycap table both teach `I` for in-point and `O` for
out-point. The app ships `z` and `m`, seeded into `key_bindings` at first run,
and the landing page's own hero screenshot shows buttons reading "Mark In (Z)"
and "Mark Out (M)". The copy contradicts the image beside it, and a coach who
follows the guide presses a key that does nothing.

Inside the app: "No Projects Yet" and "Create your first project to get started
with video analysis" repeat an affordance sitting 400px above. Settings →
Category Presets runs two sentences of "reusable templates", "scenarios" and a
quoted three-item list with "etc." to explain a save button. "Session" and
"Project" name the same thing on one screen. The "Stats" button opens a modal
titled "Statistics". Title Case drifts through "No Projects Yet", "Selected
Clip", "Switched to Light Mode" while the rest of the app is sentence case.

The three to rewrite first: the `I`/`O` keys, the four product names, and
"Built because coaches deserve better tools."

Locale was not assessable. Every captured string on both surfaces is English
and Settings showed Language: English, while the app ships 11 locales. Eleven
shipped locales with no register review is where that class of bug lives.

### Interaction, 4/10

The site's header Download button darkens `#FF6B35` to `#E55A2B` on hover, a
delta of 26 of 255, and does not grow, lift or gain a shadow. That is too quiet
for the only hover in the header.

The site's focus ring is Chrome's default, `rgb(0, 95, 204)` at zero offset, on
a page whose palette is warm cream and orange. The system blue belongs to
nothing on the page.

At 393px the top 120 CSS px of all 7 routes contain zero non-background pixels.
There is no wordmark, no Download button and no menu trigger, because
`Navbar.astro` contains no mobile-menu markup and its GitHub link is
`hidden sm:block`. The only route to the other six pages on a phone is the
footer list at the bottom of a 5,790px page, and that footer's last row does
not wrap, so it is clipped at both edges.

The three motion frames show text on white at 120ms, then 91.6% of the frame
changing at 620ms as the court gradient and the ball appear at once, then only
the ball rotating. The pop-in is a load artifact rather than choreography, and
it carries a 995KB Three.js chunk opposite the CTA.

Changes that move it: build a mobile header and let the footer wrap, which
fixes navigation and the 17px overflow together; then define one focus-ring
token in the brand accent and apply it as `outline` with `outline-offset` on
both surfaces.

### States, 4/10

`marks-set` is the best state in the product. Mark In fills to 0:00, Clear
Marks flips from disabled to enabled, the scrub bar shows green progress, the
playhead moves on all three timeline tracks, and a second banner says "Start
marked. Now press M where the play ends to create the clip." That is a state
teaching the next step. Two flaws: the first banner stays and now contradicts
itself, and the stack pushes the video up by 57px.

Statistics drops zero rows rather than showing them.
`StatsDashboard.tsx:110` filters categories through `tally.has(cat.id)` and
`:135` filters quarters through `counts.has(q)`, so "Clips by quarter" lists Q1
through Q3 and omits Q4 and OT, and "Clips by category" omits Defense and
Special Plays even though the side panel shows both as `(0)`. A coach who
tagged nothing in Q4 cannot tell that apart from Q4 not existing.

The "Switched to Light Mode" toast lands on top of the toolbar, covering Stats
and Settings. `Toast.module.css:4-7` anchors the toast `position: fixed` at
`top: var(--spacing-lg); right: var(--spacing-lg)` with `z-index: 2000`, which
is exactly where the header keeps its action buttons.

The first-run empty state reports rather than guides. It never says what file
types work, and "get started with video analysis" would fit any app.

Changes that move it: cap modals at `min(90vh, content)` with a scrolling body
and a sticky action bar, and show zero rows in Statistics instead of dropping
them.

## Four critic claims I checked and corrected

Recorded here so no plan gets written against them.

1. **"The app's focus ring is missing, or is a border-color change."** Two
   critics said this, both misled by a stale note in my own capture record. The
   ring is real. Measured with the Electron window holding OS focus,
   `el.matches(':focus-visible')` is true and the computed shadow is
   `rgb(102, 187, 106) 0 0 0 2px`, which is `--focus-ring: 0 0 0 2px
   var(--color-primary-light)`. An unfocused window suppresses
   `:focus-visible`, which is what the first reading caught. The underlying
   recommendation still holds, because `box-shadow` is dropped in forced-colors
   mode the same way a border change would be, so `outline` plus
   `outline-offset` is still the right construction.
2. **"Only one element on the site responds to the pointer."** True of the
   header button, false of the hero CTA, which was never captured under the
   pointer. Measured live: background `#FF6B35` to `#E55A2B`, shadow from
   `0 4px 14px rgba(255,107,53,.25)` to `0 8px 24px rgba(255,107,53,.35)`, and
   `translateY(-2px)`. The hero CTA has a designed hover.
3. **"There is no progress, error or success state for file operations."**
   False, and it is my capture's fault rather than the critic's. I never
   triggered a long operation. `ClipLibrary.tsx` holds `isExporting` with a
   spinner at `:500` and `showSuccess(exportSuccess, {count, dir})` at `:292`
   and `:368`, with `showError` on the failure paths.
   `YouTubeImport.tsx` holds a `role="progressbar"` with `aria-valuenow`, a
   disabled state, and two distinct error messages for an invalid URL and a
   failed download. No plan should build these; they exist.
4. **"Light theme leaves the app header dark."** False, and again my capture's
   fault. The first light-theme shot caught a mid-transition frame. Measured
   after the theme settles, `document.documentElement` carries
   `data-theme="light"` and the header computes to `rgb(245, 245, 245)`, which
   is `--bg-secondary` doing its job. Only the letterbox around the video stays
   dark, and that is the video element's own backdrop. What survives from this
   finding is the toast overlap alone.

## Measured

From `capture.json`. Desktop is 1440 wide, phone is an iPhone 14 Pro profile at
393 CSS px.

| Route | Desktop height | Phone height | Phone overflow | Clipped |
|---|---|---|---|---|
| `/` | 5753 | 5790 | 17px | `<a>Contact`, cut 17 |
| `/for-coaches` | 2162 | 2767 | 17px | `<a>Contact`, cut 17 |
| `/scouting` | 2188 | 2721 | 17px | `<a>Contact`, cut 17 |
| `/film-breakdown` | 2606 | 3201 | 17px | `<a>Contact`, cut 17 |
| `/free-alternative` | 2385 | 3110 | 17px | `<a>Contact`, cut 17 |
| `/hudl-alternatives` | 3102 | 4095 | 17px | `<a>Contact`, cut 17 |
| `/vs-inbound-studio` | 2783 | 3694 | 17px | `<a>Contact`, cut 17 |

`stillHiddenAfterScroll` was 0 on every route and every viewport, so no
scroll-triggered content was captured at opacity 0.

The overflow has one cause on all 7 routes.
`website/src/components/ui/Footer.astro:30` sets
`<div class="flex items-center gap-6">` on the row holding "Basketball Stats
App", "GitHub" and "Contact". Measured live, that row is 428px inside a 361px
content box.

Desktop app, all 13 states at 1440×900: overflow 0, clipped 0,
`stillHiddenAfterScroll` 0.

Control, stripe.com through the identical recipe at 393px: overflow 0, which is
the number that matters, so the recipe is sound. It also reported one clipped
button with empty text cut by 74px and 28 elements still under 0.05 opacity
after the scroll. Both belong to stripe's own page rather than to the harness.

Two findings measured outside the harness:

- `Navbar.astro:33` points the Download button at `#download`. That id exists
  only in `index.astro`. Checked live on all 7 routes: present on `/`, absent
  on the other six, so the site's primary action does nothing on six of seven
  pages.
- GitHub's latest release is `v1.7.2`, published 2026-07-13. The deployed home
  page's server-rendered HTML contains `1.6.0`. `website/src/utils/github.ts`
  reads the version from the GitHub API at build time and has no hardcoded
  fallback, so the site has not been rebuilt in two releases. Coaches are
  downloading the build from before the Windows startup fix and before the
  auto-update repair.
- `ClipLibrary.module.css:7` sets `container-type: inline-size` on
  `.clipLibrary`. That makes it the containing block for `position: fixed`
  descendants, and `PresentMode` renders inside it. The overlay is
  `position: fixed; inset: 0; z-index: 2500` and measures 359×808 at (1081, 76)
  in a 1440×900 window. No ancestor carries a transform, filter,
  backdrop-filter, contain or will-change, so the container query is the whole
  cause.

## Not seen

- **Long-running operations.** Export, video load and YouTube download were
  never triggered, so their progress, error and success states are absent from
  the captures even though the code has them. Worth a second capture pass that
  drives an export end to end.
- **Delete confirmation.** `ConfirmDialog` exists and the trash icons are
  visible, but nothing in the run opened one.
- **Any locale other than English.** The app ships 11 locale files
  (`app/src/i18n/locales/`). Register and locale conventions in `pt.json` and
  the other ten are unreviewed.
- **Telestration and the shot chart.** `TelestrationLayer.tsx`,
  `AnnotationReplayLayer.tsx` and `Court.tsx` render on top of video and need a
  real clip playing, which placeholder footage does not usefully provide.
- **Windows and Linux.** Everything here was captured on macOS. The typeface
  finding in particular is worse on the other two platforms and invisible here.

## Where each fix goes

Every row is a vetted finding with the element and the file named. Rows routed
to `/ship` are bugs with evidence attached.

| # | Fix | Where | Route |
|---|---|---|---|
| 1 | Present mode renders in a 359px side-panel strip instead of full screen. Portal it to `document.body`, or drop the container query if nothing uses it | `app/src/renderer/styles/ClipLibrary.module.css:7`, `components/PresentMode.tsx`, `components/ClipLibrary.tsx:951` | `/ship` |
| 2 | The navbar Download button targets `#download`, which exists only on the home page. Dead on six routes | `website/src/components/ui/Navbar.astro:33`, `src/pages/index.astro` | `/ship` |
| 3 | The footer meta row does not wrap and pushes 17px of overflow on all 7 routes | `website/src/components/ui/Footer.astro:30` | `/ship` |
| 4 | The deployed site advertises 1.6.0 while the latest release is v1.7.2. Redeploy, and add a build-time check that the fetched version is non-null | `website/src/utils/github.ts:100`, deploy config | `/ship` |
| 5 | Statistics drops categories and quarters with zero clips instead of showing them at zero | `app/src/renderer/components/StatsDashboard.tsx:110,135` | `/harden` |
| 6 | The site teaches `I` and `O`; the app's defaults are `z` and `m` | `website/src/pages/index.astro` feature card, `src/pages/film-breakdown.astro` keycap table | `/clarify` |
| 7 | Four names for one product: "Basketball Analyzer", "Basketball Video Analyzer", "This tool", "Basketball Clip Cutter". Settle on one | `website/src/components/ui/Navbar.astro:16`, `src/pages/vs-inbound-studio.astro` table header | `/clarify` |
| 8 | Every embedded product screenshot shows an older build under a dead name, with a three-button header the shipped app no longer has | `website/src/assets/screenshots/` (5 files) | real screenshots via the `screenshots` skill |
| 9 | Two accents doing one job across the two surfaces. Pick one and carry it across | `website/tailwind.config.cjs` `primary.500`, `app/src/renderer/styles/variables.css:5` | `/improve plan` then `/ship` |
| 10 | `--color-primary` and `--color-success` are the same hex, and the light theme redefines only primary | `app/src/renderer/styles/variables.css:5,11,119` | `/improve plan` then `/ship` |
| 11 | The app declares no typeface and inherits the platform's. Load the site's two faces and add them as tokens | `app/src/renderer/index.html:11`, `styles/variables.css:113` | `/improve plan` then `/ship` |
| 12 | Contrast failures: white on `#FF6B35` at 2.85:1, white on `#4caf50` at 2.84:1, white on `#66bb6a` (Mark In) at 2.36:1, step numerals at 1.67:1, hero subhead at 2.21:1 | `website/src/styles/global.css`, `tailwind.config.cjs`, `app/src/renderer/styles/variables.css` | `/harden` |
| 13 | The site's focus ring is the browser default blue. Define one token in the brand accent, applied as `outline` with `outline-offset` on both surfaces | `website/src/styles/global.css:35`, `app/src/renderer/styles/variables.css:109` | `/harden` |
| 14 | Category colours: seven of 45 pairs under ΔE 22, Rebounding against Offensive Rebound at ΔE 9.0, and timeline markers carry colour as their only signal | `app/src/renderer/components/CategoryManager.tsx` `colorPresets`, `components/Timeline.tsx` | `/harden` |
| 15 | `.modalContent` already caps at `90vh` and scrolls, but the commit button scrolls out of view with it. Pin the action row in a sticky footer so Create Clip, Statistics and Settings always show their primary action | `app/src/renderer/styles/App.module.css:346-357`, `App.tsx` modal shells | `/harden` |
| 16 | The toast is anchored top-right over the header's action buttons, so a confirmation covers Stats, Settings and help while it is up | `app/src/renderer/styles/Toast.module.css:4-7` | `/harden` |
| 17 | The mark is a stock icon-set basketball beside a Google font, illegible at 16px, and the product ships two different basketballs at once | `website/src/components/ui/Navbar.astro` inline SVG, `website/public/favicon*.png`, `app/assets/icon.png` | `ui-ux-pro-max:design`, then `/critique` |
| 18 | The identity itself, per the verdict, seeded with the keep-list above | both repos | `/build-ui` from step 1, direction hunt included |
| 19 | The workspace gives the film 36% of the window across five stacked bands. Merge the control strip and return roughly 180px to the video | `app/src/renderer/App.tsx`, `styles/App.module.css`, `components/VideoPlayer.tsx` | `/build-ui` from step 2 |
| 20 | Marking in stacks a second hint banner under the first and costs the video 108px. Swap one line's text on state change instead | `app/src/renderer/App.tsx` hint banner, `components/ContextualHint.tsx` | `/simplify` |
| 21 | No mobile navigation at all: no header content in the top 120px on any route, and the six sub-pages are reachable only from a clipped footer | `website/src/components/ui/Navbar.astro` | `/adapt` |
| 22 | The phone hero drops the court and the ball, leaving ~645px of empty, and the art reappears 3000px down behind body copy | `website/src/pages/index.astro`, `src/components/3d/` | `/adapt` |
| 23 | The six sub-pages never show the product they argue for | `website/src/pages/{for-coaches,scouting,film-breakdown,free-alternative,hudl-alternatives,vs-inbound-studio}.astro` | `/build-ui` from step 2, after row 8 |
| 24 | "Coaching guides" duplicates the footer's six links and is the only section that breaks the page's left axis | `website/src/pages/index.astro`, `src/components/ui/RelatedGuides.astro` | `/simplify` |
| 25 | "Okay, a few more things" is a 2×2 leftovers drawer demoting four real features to body copy | `website/src/pages/index.astro` | `/build-ui` from step 2 |
| 26 | The landing route runs 11 rendered type styles where six would do, and the sub-pages run an 82-character measure at `max-w-3xl` | `website/src/pages/index.astro`, the six sub-pages | `/simplify` |
| 27 | Eyebrows restate the H1 on all six sub-pages | the six sub-page `.astro` files | `/clarify` |
| 28 | App copy drift: "Session" against "Project", "Stats" against "Statistics", Title Case against sentence case, a duplicated Create Clip heading, and a two-sentence marketing paragraph in Settings | `app/src/i18n/locales/en.json` and the other ten, `components/ClipCreator.tsx`, `components/ProjectSelector.tsx` | `/clarify` |
| 29 | "Built because coaches deserve better tools", plus the em dashes in every `<title>` and the rule of three used four times in one scroll | `website/src/pages/index.astro`, all 7 route `<title>` tags | `/clarify` |

## The bar

No reference images were supplied, so each critic ranked against memory. Treat
every score as a band rather than a number.

One caveat on independence. The command hands critics images and the rubric and
nothing else, so that they cannot see the reasoning behind a choice and agree
with it. Three of the five went further and read source files. Their factual
claims are stronger for it, and I verified the load-bearing ones myself, but
their aesthetic judgments had more context than the method intends. The scores
for Brand, Colour and Type carry that caveat; Composition and Copy do not.
