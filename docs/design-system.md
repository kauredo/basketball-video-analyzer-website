# Design context

The input to design work on Basketball Video Analyzer. Written 2026-09-07 from
the evidence in `design-audit-2026-09-07.md` and from the product itself,
rather than from an interview, because the audit had already answered every
question an interview would ask.

`DESIGN.md` is the other half of this pair. This file says who the product is
for and what it should feel like; that one records the tokens a direction
settled on. At the time of writing `DESIGN.md` is stale and describes a palette
neither surface uses.

## What the product is

A free, offline desktop app that cuts basketball game film into categorised
clips, plus the marketing site that gives it away. One person built it because
he got tired of scrubbing through game tapes in VLC.

Two surfaces:

- **`app/`**, an Electron desktop tool. A 1440x900 window holding a video pane,
  a scrub bar, a transport row, a hint line, a mark row, a timeline with
  per-category swimlanes, and two collapsible panels. This is the harder
  surface and the one that decides whether a direction works.
- **`website/`**, an Astro marketing site. One landing page and six guide and
  comparison pages that carry the search traffic.

## Audience

Basketball coaches at club and school level, working alone, on their own
laptop, usually the evening after a game. Not analysts with a budget. Not
teams with a video coordinator. The people who would otherwise be scrubbing
through a two-hour recording in VLC at 2am looking for the six possessions
worth showing the team on Monday.

Two things follow. They are not impressed by software, so the interface has to
be legible rather than clever. And they are choosing this against Hudl and
Inbound Studio, so the site has to be honest about what it does not do.

## Personality, in three words

**Plain. Specific. Unimpressed.**

The product's own voice is the reference: "I got tired of scrubbing through
game tapes in VLC, so I built this. Mark plays, organize clips, export folders.
That's it." And "Those are real features. If you need them, pay for them."
Nothing in the design should be louder than that voice.

## The keep-list

Binding on any direction. These are the only things in the product that no
competitor could have, and a redesign that drops them is a regression:

- **Z and M as a two-key vocabulary**, printed into the controls themselves:
  `Mark In (Z)`, `Mark Out (M)`, and the hint "Press Z to mark the start of a
  clip, M to mark the end."
- **The `└` branch glyph in category chips.** Nested tags render as
  `└ Pick & Roll`, `└ Zone Defense`, each outlined in its parent's colour.
- **Per-category timeline swimlanes**, one lane per category, coloured markers.
- **The quarter row in Create Clip**: Q1 Q2 Q3 Q4 OT, with "Shot location
  (optional)" beneath it.
- **The first-person voice**, above.
- **"This relies on YouTube's service and may not always work."** The best
  string in the app: it names the dependency and admits the failure mode.
- **Space Grotesk on warm paper.** The site's type pairing is a real choice and
  the highest-scoring thing in the audit alongside the copy.
- **The Select Project screen**: dashed green create affordance, solid card for
  import, muted card for YouTube.

## Aesthetic direction

The subject supplies the material, and it is specific: hardwood, court line
markings, a scoreboard, a shot clock, the green banners hung in a club gym, a
timeline of possessions, jersey numbers. Film-room vernacular, not sports-brand
vernacular.

Two properties the direction has to have:

- **It survives density.** The app is a working tool with five stacked control
  bands and two panels at once. A direction that only looks good with generous
  whitespace will fail there, and the app is where users spend their time.
- **It reads at a glance in a dark room.** Coaches use this in a film session
  with the lights down, and again on a bright laptop screen. Both themes have
  to be designed, not inverted.

## Anti-references

- **Sports-brand loud.** Not Nike, not ESPN, not a broadcast lower-third.
  Angled shapes, italic condensed caps and motion blur belong to a different
  product.
- **The generated-landing-page look.** The audit found several already:
  accent-tinted glow under the CTA, giant ghost numerals behind step headings,
  a 2x2 of identical cards, an eyebrow restating the heading.
- **Material Design defaults.** The app's current palette is the 2014 swatches
  taken unmodified. Any direction that lands back on `#4caf50` / `#f44336` /
  `#ff9800` / `#2196f3` has not chosen anything.
- **Analytics-dashboard chrome.** Hero metric rows, KPI tiles, sparkline
  furniture. This is a cutting tool, not a stats product.

## Hard constraints

- **The category palette owns the orange band.** The Basketball preset seeds
  Offense `#FF5722`, Pick & Roll `#FF7043`, Isolation `#FF8A65`, Fast Break
  `#FFAB91`, Post Up `#FFCCBC`. Whatever colour means "act here" cannot sit in
  that band unless the presets are re-hued first.
- **Category colour is identity, not decoration.** Ten default categories have
  to stay separable at chip size and in greyscale, because timeline markers
  currently carry colour as their only signal.
- **The app ships to Windows, macOS and Linux.** It currently declares no
  typeface and inherits the platform's. Roughly half the downloads are Windows,
  so a direction tested only on a Mac is untested.
- **Offline.** No webfont CDN at runtime; faces are self-hosted.
- **11 locale files.** Any string-length assumption has to survive German and
  Greek.
