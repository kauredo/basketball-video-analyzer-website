#!/usr/bin/env node
// Regenerates every icon from the two brand marks.
//
// This script exists because the icons were hand-made and one of them was made
// from the wrong source. `mark-small.svg` is a different drawing: it drops the
// upper cheek seam so that three strands rather than four have to survive
// sixteen pixels. That reduction is correct at 16px and wrong everywhere else,
// and it had been baked into `favicon.svg`, which is the one asset with no
// fixed size at all. Browsers render an SVG favicon at whatever size they need,
// including a large bookmark tile, so the mark shipped to production with a
// seam visibly missing.
//
// The rule, and it is the whole point of the file: the reduced cut is used at
// 16px and nowhere else. Every other raster, and every scalable asset, gets the
// full mark.
import sharp from "sharp";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const ACCENT = "#0B7972"; // accent, from DESIGN.md
const ACCENT_HI = "#3ED0C2"; // accent-hi, for a dark host
const PAPER = "#F6F2EA"; // warm-50. Opaque icons sit on the site's own ground.

const full = readFileSync("src/assets/brand/mark.svg", "utf8");
const small = readFileSync("src/assets/brand/mark-small.svg", "utf8");

const inked = (svg) => Buffer.from(svg.replace(/stroke="currentColor"/, `stroke="${ACCENT}"`));

// Transparent rasters, for a favicon that sits on whatever the browser paints.
const clear = [
  ["public/favicon-16x16.png", small, 16],
  ["public/favicon-32x32.png", full, 32],
  ["public/favicon.png", full, 512],
];
// Opaque rasters, for home screens and app tiles, which have no ground of
// their own and look like a hole punched in the wallpaper without one.
const opaque = [
  ["public/apple-touch-icon.png", full, 180],
  ["public/icon-192.png", full, 192],
  ["public/icon-512.png", full, 512],
];

for (const [out, svg, size] of clear) {
  await sharp(inked(svg), { density: 384 }).resize(size, size).png().toFile(out);
  console.log(`  ${out}  ${size}px  transparent`);
}
for (const [out, svg, size] of opaque) {
  await sharp({ create: { width: size, height: size, channels: 4, background: PAPER } })
    .composite([{ input: await sharp(inked(svg), { density: 384 }).resize(size, size).png().toBuffer() }])
    .flatten({ background: PAPER })
    .png()
    .toFile(out);
  console.log(`  ${out}  ${size}px  on ${PAPER}`);
}

// favicon.svg is scalable, so it takes the full mark and carries the dark-host
// swap the PNG fallbacks cannot do.
writeFileSync(
  "public/favicon.svg",
  full
    .replace(/stroke="currentColor"/, `stroke="${ACCENT}"`)
    .replace("</svg>", `  <style>@media (prefers-color-scheme:dark){circle,path{stroke:${ACCENT_HI}}}</style>\n</svg>`)
);
console.log(`  public/favicon.svg  scalable  full mark`);

// icon.ico carries three frames. Only the 16 is the reduced cut.
const tmp = mkdtempSync(join(tmpdir(), "bva-ico-"));
const frames = [];
for (const [size, svg] of [[16, small], [32, full], [48, full]]) {
  const f = join(tmp, `${size}.png`);
  await sharp(inked(svg), { density: 384 }).resize(size, size).png().toFile(f);
  frames.push(f);
}
execFileSync("magick", [...frames, "public/icon.ico"]);
console.log(`  public/icon.ico  16(reduced) 32 48`);
