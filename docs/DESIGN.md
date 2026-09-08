# Design system: Scorebook

The direction settled on 2026-09-07 by plan `027`, chosen from four independent
directions. `design-system.md` is the other half of the pair: it says who the
product is for and what it should feel like, and it does not change when tokens
do.

**Read the tables below as the shipped values, and the section at the end as the
part of the direction still on paper.** That split matters, because for a year
this file claimed to record what the product used while specifying a palette
neither surface had ever painted. It was rewritten once on 2026-09-07 and got
the same thing wrong again: the new tables were the direction's proposal, and
implementation went a different way without coming back to the file. An
art-direction pass on 2026-09-08 read the rendered pixels and found that of the
seventeen neutrals specified here, none shipped. Only the accent matched.

So: hexes below are read from `tailwind.config.cjs` and
`app/src/renderer/styles/variables.css`. Anything not yet built is under
"Chosen but not built", with what it would cost.

## The direction

The whole interface is drawn in 1px hairlines on full-bleed ruled bands, like
the paper scorebook a keeper fills in by hand. Dark graphite in the app, warm
paper on the site. No cards, no shadows, no radii above 1px, and no fills that
are not functional.

Bands run edge to edge and each band does one job: video, scrub, transport,
hint, mark, timeline. The app reads as a stack of rows a coach fills in rather
than a set of floating panels. That is what lets it hold five control bands, a
three-lane timeline and two side panels at 1440x900 without feeling crowded.

Of that paragraph and the one above it, what is built today is the band
structure in the app, which predates the direction, and the hairlines on the
site, added 2026-09-08. The rest of the sentence, the graphite and paper
palettes and "no cards, no shadows, no radii above 1px", is not built. The app
ships 173 `border-radius` and 92 `box-shadow` declarations. See the end of this
file.

## Colour

### The app, dark

Read from `app/src/renderer/styles/variables.css`. Neutral greys, no hue cast.

| Token | Dark | Light | Job |
|---|---|---|---|
| `--bg-primary` | `#1a1a1a` | `#ffffff` | App background. |
| `--bg-secondary` | `#2a2a2a` | `#f5f5f5` | Chrome that holds controls, and card grounds. |
| `--bg-tertiary` | `#333333` | `#eeeeee` | Sunken wells: button faces, input fields, chips. |
| `--bg-quaternary` | `#444444` | `#e0e0e0` | The lightest ground in dark, the darkest in light. Contrast for anything drawn as ink is measured here, because it is the worst case in both themes. |
| `--bg-black` | `#000000` | `#000000` | Present mode's backdrop. Theme-independent. |
| `--border-color` | `#444444` | `#d0d0d0` | Divisions and control outlines. |
| `--track` | `#787878` | `#868686` | What states a progress track's extent, as a fill in the transport and a 1px outline on the stats bars. Split out because `--bg-tertiary` reads 1.38:1 against the transport row and 1.14:1 against a stats card, both under the 3.0 bar for identifying a control. |
| `--text-primary` | `#ffffff` | `#212121` | Primary text. |
| `--text-secondary` | `#cccccc` | `#616161` | Labels and secondary text. |
| `--text-tertiary` | `#aaaaaa` | `#757575` | Micro-labels and units. |
| `--text-white` | `#ffffff` | `#ffffff` | Text on a fill. Theme-independent, so a rule that paints on a coloured button does not flip ink with the theme. |

### The app's semantic colour

Each of these is two tokens, not one, and the split is the whole point. A fill
sits behind white text and has to clear 4.5:1 against white. The same idea drawn
as text or a border sits on the app's own grounds and has to clear 4.5:1 against
those, which pulls the hex the other way. One value cannot do both.

| Job | Fill | Ink, dark | Ink, light |
|---|---|---|---|
| Danger | `#d32f2f` (`-dark` `#c62828`) | `#ef9a9a` | `#b3261e` |
| Warning | `#ff9800` | `#ffb74d` | `#a04100` |
| Info | `#2196f3` | `#4fc3f7` | `#1257a8` |
| Success | `#2e7d32` (`-dark` `#1b5e20`) | n/a | n/a |

Warning and info have no fill behind text anywhere, so their fill values stay
bright and are used for borders and toast rails only. Do not put white on
either: `#ff9800` reads 2.16:1 behind it.

### The site, warm paper

The `warm-*` scale from `tailwind.config.cjs`. The site never left it.

| Class | Hex | Job |
|---|---|---|
| `warm-50` | `#FDFBF7` | Page ground, and the odd bands. |
| `warm-100` | `#F9F5ED` | The even bands. The two grounds differ by 1.05:1, which is a tint, not a division. The rule does the dividing. |
| `warm-200` | `#F0E8D8` | Fills that are not functional: table stripes, inline code. |
| `warm-300` | `#E3D5BD` | The hairline. Every band edge on the landing route carries one. |
| `warm-400` | `#C9B494` | Second hairline weight, and the court line work. |
| `warm-700` | `#6E5A42` | Body copy and secondary copy. 6.34:1 on `warm-50`. |
| `warm-900` | `#2C2418` | Headline ink. |

`warm-600` `#8B7355` survives in three places and is below the AA bar for body
copy at 4.34:1. It is not a body-copy colour; check before adding a fourth.

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

## The mark

A basketball, drawn from measurements rather than from memory.

The audit scored the old mark 2/10 with a verdict of START OVER: a stock glyph
from an icon library set beside the product name. Four abstract replacements
were drawn and rejected, then three "drawn ball" attempts, then three more that
tried to encode clip in-points into the seams. The operator's verdict on the
last of those settled it: "they both look broken, the dashes don't look
intentional." Removing a segment from a line reads as damage, and no amount of
tuning gap widths changes that. A 64px ball cannot carry a timeline.

Then the more useful correction: "we need to first start with a good
representation of a basketball. accurate lines and perspective." Every mark up
to that point had drawn the seams by eye.

**What a basketball's seams actually are.** Two great circles meeting at 90
degrees at the poles, plus two closed cheek loops. Six crossings, twelve edges,
eight panels, which is the panel count every source agrees on. The cheek seam is
**not a wave**: it runs at constant longitude for most of its length and turns
hard near the pole, reaching to about 15 degrees of colatitude. Four independent
readings across two photographs put that turn at 15.5, 14.9, 15.2 and 16.9
degrees.

That flat-sided lobe is the whole difference between a basketball and a
volleyball. Modelled as a series it needs one correction term,
`57.82 + 15.46 cos2psi + 2.63 cos4psi`; a pure cosine puts the 45-degree point
at 60.46 where the photographs say 55.19. An independent fit reached the same
shape by a different route, a tanh-flattened sinusoid, and concluded that no
cosine of any amplitude produces it.

Two more measured facts worth keeping:

- **Face-on, a real ball shows three seams, not four.** The fourth great circle
  lies in the horizon plane and projects onto the silhouette. The familiar
  vertical-plus-horizontal-plus-two-arcs icon is a stylisation of a pole-on view
  at roughly double the real seam amplitude. Do not draw the ball face-on.
- **Seams meet the silhouette tangentially**, measured at 73 degrees rising
  toward 90. The exception is a great circle seen edge-on, which meets
  near-perpendicular at 21 to 23 degrees from radial.

**What shipped.** A three-quarter view, stroke 2.2 on a 64 viewBox with a radius
of 29, which is 3.79% of the diameter against 2.2% in life. Single flat colour
through `currentColor`, so the mark takes the colour of whatever it sits in: the
site's ink in the navbar, near-white in the app's header, the accent on an icon.

**The 16px cut is a different drawing, and that is deliberate.** Four seam
strands do not fit in sixteen pixels; three separate passes reached that
conclusion independently. The favicon drops the upper cheek and thickens the
rest to 2.6. Thinning the stroke instead produces grey mush. `mark.svg` and
`mark-small.svg` are both in `src/assets/brand/`.

`favicon.svg` carries a `prefers-color-scheme` swap to the bright face, which
the PNG fallbacks cannot do.

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

The real 3D ball is still on desktop, gated behind
`client:media="(min-width: 640px)"` by `031` so a phone never downloads a chunk
it cannot render, and confined to the hero's own box by the fix above. The
scroll stage described in this section is not built; the ball still rotates
because 3D objects rotate. That is `026`'s remaining scope, and it is the one
place in this file where the gap is a feature nobody has written rather than a
value nobody has changed.

## Structure

The court is the page's geometry, not its wallpaper. The three-point arc and
the key belong to the hero. The key frames the three steps. The centre circle
sits under the closing CTA. All of it is SVG line work in `rule-2`, which costs
nothing at runtime and survives 393px.

It must be clipped to the section that owns it. The previous implementation put
the court on a `fixed inset-0` layer spanning the whole document, so it
reappeared 3000px down behind body copy and made that copy unreadable.

The desktop hero did it a second time. `FullScreenBasketball3D` was `fixed
inset-0` across the whole document, so any section below the hero that did not
paint its own opaque ground got terracotta and basketball behind its body copy.
The sections that existed when `021` swept for translucent grounds were fine; a
section added on 2026-09-08 reproduced the bug the day it was written. That is
what a rule enforced by a comment gets you.

It is `absolute inset-0` inside the hero now, and the component is
`HeroBasketball3D`. Sections below the hero no longer have to paint a ground,
though they all still do. **Anything full-bleed on this site is clipped to the
section that owns it.** Two implementations have been caught breaking that;
there is no third reading of it.

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

Fixed on 2026-09-08, and the fix was structural. White on the app's danger,
warning and info fills measured 3.68:1, 2.16:1 and 3.12:1, and the reason was
that each idea had one token doing two jobs. Splitting fill from ink moved
seven pairs at once, all measured against `--bg-quaternary`, which is the
lightest ground in the dark theme and the darkest in the light one:

| Pair | Before | After |
|---|---|---|
| White on danger | 3.68:1 | **4.98:1** |
| Danger as ink, dark | 3.90:1 | **4.53:1** |
| Danger as ink, light | 3.68:1 | **4.95:1** |
| Warning as ink, dark | 4.52:1 | **5.63:1** |
| Warning as ink, light | 1.63:1 | **4.89:1** |
| Info as ink, dark | 3.12:1 | **4.86:1** |
| Info as ink, light | 2.37:1 | **5.38:1** |

The light-theme numbers were the worse half and the audit never had them,
because it read the dark theme only. `#ff9800` on light paper at 1.63:1 was the
worst pair in the app.

Two more found while measuring. `.deletePresetBtn:hover` was declared twice in
`CategoryManager.module.css` and the later one won, painting `#f44336` on
`#ef5350`, about 1.3:1, so the delete icon disappeared under the pointer. And
the danger buttons took `--text-primary`, which is `#212121` in the light theme,
so one rule painted white text in one theme and near-black in the other. They
take `--text-white` now.

The stats bars had the same shape of problem as the scrub track before them.
`.barTrack` drew on `--bg-tertiary`, 1.14:1 against its card, so the track was
invisible and a short bar had nothing to be short against. It carries a 1px
`--track` outline now.

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

## Chosen but not built

The direction was chosen on 2026-09-07 and implemented in parts. What follows is
the part still on paper, with what adopting it would cost. It is here so nobody
reads the tables above as aspirational, and nobody re-derives this by
screenshotting the site again.

### Both neutral palettes

The direction specified seventeen neutrals across the two surfaces. None of them
shipped. The site is on the `warm-*` scale it has always used; the app is on
neutral greys with no hue cast. The proposal was:

| Job | Proposed, app | Proposed, site |
|---|---|---|
| Ground | `#151319` ink-900, plum-cast graphite | `#F6F2EA` paper |
| Chrome | `#1C1A21` ink-800 | `#EDE7DB` paper-2 |
| Wells | `#232028` ink-700 | n/a |
| Pillarbox | `#0E0D11` ink-950 | n/a |
| Hairline | `#2C2834` rule | `#DED5C4` rule |
| Hairline, 2 | `#443E51` rule-2 | `#BFB39C` rule-2 |
| Primary ink | `#EDE9F2` tx | `#1B1813` tx |
| Secondary ink | `#A79FB4` tx-2 | `#5C5648` tx-2 |
| Micro-labels | `#756D83` tx-3 | `#8B8272` tx-3 |
| Playhead | `#E4DCCD` bone | n/a |

The site half is close to what ships: `#DED5C4` against `warm-300` `#E3D5BD` is
within a shade, which is why the hairlines built on 2026-09-08 use `warm-300`
and look right. Adopting the rest is a token swap in `tailwind.config.cjs` plus
a contrast re-measure of every row in the table above, because moving the ground
moves every ratio measured against it.

The app half is a different size of job. The plum cast is a visible change to
every surface in the product, and the ink values would need the whole semantic
ink table re-derived, since those are measured against `--bg-quaternary`.

Neither is planned. Both belong with `027`, which chose the direction.

### No cards, no shadows, no radii above 1px

This is the direction's structural rule and the app contradicts it 265 times:
173 `border-radius` declarations and 92 `box-shadow` ones, plus a five-step
shadow scale in `variables.css` that exists to be used. The site keeps
`rounded-xl` on the product shots and `shadow-2xl` under them.

This one is worth a decision rather than a migration. Stripping radius and
shadow from a dense desktop tool removes the depth cue that separates a floating
panel from the band behind it, and the direction's answer to that is the
hairline. That trade is real and has not been tested at 1440x900 with both
panels open. Prototype before committing.

### Fixed on 2026-09-08

Two items that were in this section and are not any more, kept so the record
reads straight:

- **The ruled bands.** On the landing route the only horizontal rule was the
  navbar underline at 1.03:1, and section boundaries were ground changes of
  1.05:1. Every band edge carries a 1px `warm-300` rule now. Two edges
  deliberately do not: More features continues Present mode rather than
  dividing from it, and that is what the `pb-12`/`pt-12` pairing is for.
- **The document-wide 3D layer.** The hero scene was `fixed inset-0`, so it was
  not the hero's backdrop, it was a layer over the whole document. Every section
  below had to paint an opaque ground or render its body copy on the
  basketball, and one section did not paint one. It is `absolute inset-0` inside
  the hero now, measuring 900px against a 5493px document, and the component is
  called `HeroBasketball3D` rather than `FullScreenBasketball3D`. The standing
  rule that every section must paint its own ground is gone with it. This is
  the second time a `fixed inset-0` court layer caused a contrast failure on
  this site; see the note under Contrast about the translucent grounds.
