# Design system: Scorebook

The direction settled on 2026-09-07 by plan `027`, chosen from four independent
directions. This file records what the product uses. `design-system.md` is the
other half of the pair: it says who the product is for and what it should feel
like, and it does not change when tokens do.

Everything before this rewrite described a palette neither surface used.

## The direction

The whole interface is drawn in 1px hairlines on full-bleed ruled bands, like
the paper scorebook a keeper fills in by hand. Dark graphite in the app, warm
paper on the site. No cards, no shadows, no radii above 1px, and no fills that
are not functional.

Bands run edge to edge and each band does one job: video, scrub, transport,
hint, mark, timeline. The app reads as a stack of rows a coach fills in rather
than a set of floating panels. That is what lets it hold five control bands, a
three-lane timeline and two side panels at 1440x900 without feeling crowded.

## Colour

### The app, dark

| Hex | Name | Job |
|---|---|---|
| `#151319` | ink-900 | App background. Graphite with a faint plum cast, so it is not a blue-black. |
| `#1C1A21` | ink-800 | Chrome that holds controls: topbar, transport, mark row, timeline, right panel. |
| `#232028` | ink-700 | Sunken wells inside controls: button faces, input fields, chips. |
| `#0E0D11` | ink-950 | The video pillarbox surround. The only true black. |
| `#2C2834` | rule | The hairline. Every division in the app is this 1px line and nothing else. |
| `#443E51` | rule-2 | Second hairline weight, for control outlines and the pressed segment. |
| `#EDE9F2` | tx | Primary text. |
| `#A79FB4` | tx-2 | Labels, secondary text, inactive controls. |
| `#756D83` | tx-3 | Micro-labels and units. |
| `#E4DCCD` | bone | The playhead, and only the playhead. Warm off-white, so it never reads as accent. |

### The site, warm paper

| Hex | Name | Job |
|---|---|---|
| `#F6F2EA` | paper | Page ground. |
| `#EDE7DB` | paper-2 | Header and tail bands. |
| `#DED5C4` | rule | Hairline. |
| `#BFB39C` | rule-2 | Second hairline weight, and the court line work. |
| `#1B1813` | tx | Headline and body ink. |
| `#5C5648` | tx-2 | Secondary copy. |
| `#8B8272` | tx-3 | Micro-labels. |

**The site has no dark mode, and is not getting one.** It did not have one
before and the direction does not give it one. Dark belongs to the app, light
to the site. Paint every colour explicitly anyway, so a page holds whatever
ground the host paints behind it.

### The accent

| Hex | Name | Job |
|---|---|---|
| `#0B7972` | accent | The one accent, and the fill on both surfaces in both themes. |
| `#075450` | accent-lo | Its hover and pressed face. |
| `#3ED0C2` | accent-hi | The accent on a ground that is dark whatever the theme. In practice that is Present mode alone, whose backdrop is `--bg-black`: it carries the counter and, via a scoped override, the focus ring. The telestration toolbar looked like such a surface and is not, because it draws on `--bg-overlay`, which is near-white in the light theme. |

The first three rows are what shipped, and they are not what this file said
before implementation. Two measurements moved them. `#14A79A` cannot sit behind
white at all, at 2.99:1, so it could never be the fill. And `#0A6E68`, which
white does clear at 6.10:1, reads at only 2.85:1 against the app's own graphite
ground, under the 3.0 bar for identifying a control, so the button was legible
but its shape was not. `#0B7972` is inside the window that clears both: 5.26:1
behind white, 3.31:1 on graphite, 5.26:1 on paper.

Anything changing the accent again has to land in that window. It is narrow:
white needs the fill no lighter than L\* 0.183, and the graphite ground needs it
no darker than L\* 0.132.

**One accent, one job: the clip being cut right now.** The marked region on the
scrub bar, **both** `Mark In (Z)` and `Mark Out (M)`, the live Duration readout,
`Create clip`, and the site's primary CTA. Nothing decorative gets it.

The two marks take the two faces, `#0B7972` and the deeper `#075450`. They are
one operation with two ends, so they belong to one hue. `Mark Out` was on
`--color-danger` and the pair read as safe against destructive, which put a red
button under the coach's most-used key. Red is reserved for what actually
destroys, and nothing in the mark row qualifies: `Clear Marks` discards two
marks, not work, and stays muted. The old site spent the
accent on six different roles, including feature icons and link arrows, which
is why the button stopped being the loudest thing on the page.

Teal was chosen over the alternatives for two reasons that are worth keeping
written down. It is far from the orange band the category presets already own,
so "act here" can never be confused with "this is an offensive possession". And
it is legible in both themes without a fragile rule holding it up, unlike a
yellow accent that only works as a fill.

### Colours reserved for category identity

Category colour is data, not decoration, so the UI may not borrow from this
band. The Basketball preset seeds Offense `#FF5722`, Pick & Roll `#FF7043`,
Isolation `#FF8A65`, Fast Break `#FFAB91`, Post Up `#FFCCBC`, and the rest.

Two rules for anyone changing them, both from the audit:

- Every pair stays at ΔE 22 or above in CIELAB. Seven pairs currently fail, the
  worst being Rebounding against its own child Offensive Rebound at ΔE 9.0.
- Timeline markers carry colour as their only signal today. Any change has to
  keep the lanes separable in greyscale, or add a second signal.

Plan `023` covers both.

## Type

**Space Grotesk** for display. **IBM Plex Sans** for interface and body.
**IBM Plex Mono** for every number, keycap, timecode and micro-label.

Plex was drawn as a system family with Plex Mono as its sibling, so the mono
numbers and the sans labels share proportion and weight. That is what a ruled
ledger needs: `36:20 / 1:25:39` in the transport and `0:14` in the clip list sit
on the same tabular grid and the timecode does not jitter as it counts.

**Space Grotesk has no Greek.** `el.json` is the one locale of eleven that uses
Greek script; every other locale, Serbian included, is Latin. So Space Grotesk
is confined to the site and to two strings in the app, the project title and the
panel heading. Plex Sans carries everything else and ships Greek plus full Latin
Extended, which the 11 locale files need.

Both faces are self-hosted through `@fontsource-variable`. The app is offline
software and must never reach a font CDN at runtime.

### The site's scale

Six sizes render on the landing route. Five are the type scale; the sixth is a
control label.

| Step | Tailwind | Renders | Job |
|---|---|---|---|
| Display | `text-4xl sm:text-5xl lg:text-6xl` | 60px | The landing H1. The guide pages stop at `sm:text-5xl`, so theirs is 48px. |
| Section | `text-3xl sm:text-4xl` landing, `text-2xl sm:text-3xl` guides | 36px / 30px | Every `h2`. |
| Sub | `text-xl` | 20px | Step titles and the hero subhead. |
| Control | `.btn-lg` in `global.css` | 18px | Download button labels. Not part of the prose scale, but it renders. |
| Body | inherits `text-base` | 16px | Running prose, and the step ordinals. |
| Small | `text-sm` | 14px | Card copy, the platform line, footnotes. |

Two things still sit off this scale, both inside `RelatedGuides.astro`: its
heading at 24px and its links at 18px. Plan `033` owns that component.

The step ordinals in "How it works" were `text-5xl` bold, which drew a
decorative `1` at 48px above a 36px section heading. Folding them to the title's
own size and weight was worse, not better: two reviewers read `1 Load your game
tape` as one line of type, because size, family, weight, cap height and baseline
all matched and only the ink differed. An ordinal has to differ from the thing
it marks in more than colour. They are now 14px DM Sans medium in `warm-600`
against a 20px Space Grotesk semibold `warm-900` title, set on their own line so
ordinal, title and body copy all share one left edge.

**The measure, and why the obvious container width misses.** Character counts
below are the first rendered line of all 26 body paragraphs across the six guide
pages, at 1440px.

| Container | Text width at `lg` | Range | Average | Inside 60-75 |
|---|---|---|---|---|
| `max-w-3xl` (what shipped) | 704px | 87-107 | 99.4 | almost none |
| `max-w-2xl` | 608px | 75-99 | 89.0 | 1 of 26 |
| **`max-w-xl`** | **512px** | **60-84** | **67.7** | **25 of 26** |
| `max-w-lg` | 448px | 53-68 | 58.9 | 12 of 26 |
| `max-w-prose` | 647px | 87-107 | 94.7 | almost none |

Measure this in the browser and do not derive it. Container width and character
count do not track each other closely enough to extrapolate: DM Sans lays out at
about 7.3px per character at 16px measured glyph by glyph, but the marginal rate
between two container widths is nearer 6.2px, and using either constant to pick
a width lands about 20% wide. `max-w-prose` is the specific trap, because 65ch
sounds like 65 characters and resolves to 711px, which is 95.

**The comparison tables are not prose.** The three of them break out of the
reading column with `relative left-1/2 -translate-x-1/2 w-[min(100vw-2rem,44rem)]`,
one expression rather than a ramp of tuned negative margins. 44rem is the 704px
they had under `max-w-3xl`, and they hold it from 768px up; below that the
viewport caps them and they behave as they always did on a phone. Squeezed into
the 512px reading column they wrapped every platform cell onto three lines with
500px of page empty either side.

## Motion

The hero is a scroll stage. The basketball is the playhead: scrolling rolls it
along a track, the clock runs from `0:00` to `1:25:39`, and each possession
flips from a ghosted outline to a filled marker as the playhead passes it. By
the bottom of the hero, a visitor has watched a game get cut into clips without
reading a word.

Three rules that make it work rather than decorate:

- **At rest it reads `0:00`, nothing cut.** Every marker is already on screen as
  a ghost, so nothing is hidden waiting on an observer. The motion reveals, it
  does not create.
- **The ball rides the track.** Its centre, the fill and every marker share one
  x-axis, offset by the lane-name column. A playhead that does not line up with
  its own markers is worse than no playhead.
- **`prefers-reduced-motion` stops the rotation** and leaves the position, the
  clock and the markers working.

The old hero rotated a basketball because 3D objects rotate. It popped in at
620ms, cost a 939KB Three.js chunk plus 183KB of client runtime, sat opposite
the CTA competing for the eye, and was deleted entirely on phones. Whatever
replaces it earns its place by showing the product.

If the real 3D ball comes back on desktop, gate it behind
`client:media="(min-width: 640px)"` so a phone never downloads a chunk it
cannot render.

## Structure

The court is the page's geometry, not its wallpaper. The three-point arc and
the key belong to the hero. The key frames the three steps. The centre circle
sits under the closing CTA. All of it is SVG line work in `rule-2`, which costs
nothing at runtime and survives 393px.

It must be clipped to the section that owns it. The previous implementation put
the court on a `fixed inset-0` layer spanning the whole document, so it
reappeared 3000px down behind body copy and made that copy unreadable.

## Contrast

Measured, not estimated. Recompute after any accent change.

Every ratio below was recomputed against the shipped tokens, and the site rows
were read off rendered pixels rather than assumed backgrounds.

| Pair | Before | After |
|---|---|---|
| White on the site's Download button | 2.85:1 | **5.26:1** |
| White on the app's Export Clips and filter chips | 2.78:1 | **5.26:1** |
| White on the app's Mark In (Z) | 2.78:1 | **5.26:1** |
| White on the success toast, dark | 3.28:1 | **5.83:1** |
| The site's step ordinals, now 14px, bar 4.5 | 1.06:1 | **6.03:1** |
| The site's hero subhead over the court | 2.30:1 | **6.72:1** |
| "Now in 11 languages", now 14px | 2.96:1 | **6.34:1** |
| Landing body copy | 4.34:1 | **6.34:1** |
| The app's focus ring on graphite | n/a | **9.12:1** |
| The app's focus ring on paper | n/a | **5.26:1** |

Two corrections to the audit, worth keeping so nobody re-derives them. Mark In
was reported at 2.36:1 on `--color-primary-light`; it was actually on
`--color-success`, and `--color-primary-light` is never used as a fill. And the
step numerals measured 1.06:1, not 1.67:1.

Most of the site's failures below the fold had one cause, and it was structural
rather than a colour choice. The court is a `fixed inset-0` layer behind the
whole document, and the sections below the hero had translucent grounds
(`bg-warm-100/50`, `bg-warm-100/30`), so terracotta showed through behind body
copy thousands of pixels down. Those grounds are opaque now. The court belongs
to the hero.

The audit recorded that the six guide pages already passed at 6.34:1 and put
them out of scope. They did not: every one of them, plus the 404, the footer and
the navbar, used the same warm-600 body copy as the landing page, at 4.34:1.
They are all on warm-700 now, measured at 6.34:1.

Still failing, and not yet planned: white on the app's danger, warning and info
fills, at 3.68:1, 2.16:1 and 3.12:1.

One more was found on 2026-09-08 and fixed: the "Coaching guides" band drew on
`bg-warm-100/50`, so on the home page the hero's terracotta came through it and
the link ink fell from 4.65:1 at the start of a line to 4.29:1 by the end of it,
crossing the AA bar mid-sentence. The ground is opaque now and reads 6.03:1 the
whole way across. It was the last translucent ground on the site; the sweep that
made the others opaque missed this one because it lives in a component rather
than in `index.astro`.

## Focus

One ring, both surfaces: `outline: 2px solid` the accent's theme face, with
`outline-offset: 2px`, on `:focus-visible` only. `#3ED0C2` on graphite,
`#0B7972` on paper. Present mode overrides `--focus-ring-color` to the bright
face, because its backdrop is black in either theme.

Do not set `border-radius` alongside the outline. Browsers already follow the
element's own radius, and setting it changes the element's box while it holds
focus.

`outline` rather than `box-shadow`, because forced-colors mode drops shadows and
keyboard users on Windows lose the ring. `:focus-visible` rather than `:focus`,
so a mouse click does not draw one.

Note for anyone testing the app: an Electron window that does not hold OS focus
suppresses `:focus-visible` entirely. The ring is not missing, the window is not
focused. That misreading cost this project two false findings.

## Drift found on 2026-09-08, not yet fixed

An art-direction pass read the rendered pixels rather than this file and found
that most of what the colour table above specifies is not what the site paints.
Recording it here so the next person does not re-derive it, and so nobody treats
the table as describing the live site.

| Job | This file says | The site renders |
|---|---|---|
| Page ground | `#F6F2EA` paper | `#FDFBF7` and `#F9F5ED` |
| Headline ink | `#1B1813` tx | `#2C2418` |
| Secondary copy | `#5C5648` tx-2 | `#6E5A42` |
| Hairline | `#DED5C4` rule | nothing renders below the navbar |
| Accent | `#0B7972` | `#0B7972` |

Only the accent matches, and it matches exactly, which is what rules out a
colour-profile shift in the captures. The site is still on the original `warm-*`
scale from `tailwind.config.cjs`. The contrast table in this file agrees with the
pixels and not with the colour table: it records landing body copy at 6.34:1,
which is `#6E5A42` on `#FDFBF7`, not `#5C5648` on `#F6F2EA`.

Two further gaps in the same pass:

- **The ruled bands do not exist.** The direction's first line is that every
  division in the product is a 1px hairline. On the landing route the only
  horizontal rule is the navbar underline at 1.03:1, and the section boundaries
  are ground changes of 1.02:1. There are no hairlines to see.
- **The desktop hero still runs the 3D basketball** this file describes as
  deleted, in the position it describes as the problem, opposite the CTA. Plan
  `031` gated it behind `client:media` so phones no longer download it, which
  was that plan's scope. Desktop was left as it was.

Neither is planned yet. Both belong with `027`, which chose the direction, and
`026`, which is still open on the mark.
