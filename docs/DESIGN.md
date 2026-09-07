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
| `#14A79A` | accent | The one accent. |
| `#3ED0C2` | accent-hi | Its dark-theme face. |
| `#0A6E68` | accent-lo | Its light-theme face, and the CTA fill. |
| `#0E3B37` | act-face | The tint behind the armed Mark In button. |

**One accent, one job: the clip being cut right now.** The marked region on the
scrub bar, the armed `Mark In (Z)`, the live Duration readout, `Create clip`,
and the site's primary CTA. Nothing decorative gets it. The old site spent the
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

| Pair | Ratio | Bar |
|---|---|---|
| White on `#0A6E68` (site CTA) | 6.5:1 | passes AA |
| White on `#14A79A` | 2.9:1 | **fails**, so the accent is never a fill behind white at this face |
| `#1B1813` on `#F6F2EA` (body) | 15.4:1 | passes |
| `#5C5648` on `#F6F2EA` (secondary) | 6.6:1 | passes |
| `#8B8272` on `#F6F2EA` (micro) | 3.4:1 | large or non-essential text only |

The four failures the audit found were all white on a mid-tone fill: the old
site button at 2.85:1, the app's Export Clips at 2.84:1, Mark In at 2.36:1, and
the step numerals at 1.67:1. Plan `021` fixes them against these tokens.

## Focus

One ring, both surfaces: `outline: 2px solid` the accent's theme face, with
`outline-offset: 2px`, on `:focus-visible` only.

`outline` rather than `box-shadow`, because forced-colors mode drops shadows and
keyboard users on Windows lose the ring. `:focus-visible` rather than `:focus`,
so a mouse click does not draw one.

Note for anyone testing the app: an Electron window that does not hold OS focus
suppresses `:focus-visible` entirely. The ring is not missing, the window is not
focused. That misreading cost this project two false findings.
