#!/usr/bin/env node
/**
 * Walks every text node on every built page and checks it against the ground
 * it actually renders on.
 *
 * This exists because reading the CSS does not find these. Everything it
 * caught on 2026-09-08 was invisible in the source:
 *
 *   - the 404 page used warm-400, the hairline colour, as 14px body copy
 *     at 2.00:1
 *   - BaseLayout's critical-CSS block hardcoded the pre-Scorebook near-white,
 *     so that page kept the old ground after the palette moved
 *   - a "Coaching guides" band drew on bg-warm-100/50, so the hero's
 *     terracotta came through and link ink fell from 4.65:1 at the start of a
 *     line to 4.29:1 by the end of it
 *
 * The ground is resolved by walking up for the first non-transparent
 * background, which is the only way to catch a translucent band over a
 * fixed layer. A computed colour cannot be reasoned about from a stylesheet.
 *
 * Usage:  npm run check:contrast          (builds and serves, then checks)
 *         npm run check:contrast -- --url https://example.com
 */
import { chromium } from "playwright";
import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const AA_NORMAL = 4.5;
const AA_LARGE = 3.0; // >=24px, or >=18.66px at weight 700

const arg = name => {
  const i = process.argv.indexOf(name);
  return i === -1 ? null : process.argv[i + 1];
};
const BASE = arg("--url") ?? "http://localhost:4321";

/** Every route the build produced, from dist/. */
function routes(dir = "dist", prefix = "/") {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...routes(full, `${prefix}${entry}/`));
    else if (entry === "index.html") out.push(prefix);
    else if (entry === "404.html") out.push("/404");
  }
  return [...new Set(out)].sort();
}

const IN_PAGE = () => {
  const lin = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const L = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const contrast = (a, b) => { const [hi, lo] = [L(a), L(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };
  const parse = s => { const m = (s || "").match(/[\d.]+/g); return m ? m.slice(0, 3).map(Number) : null; };

  // The first ancestor that actually paints. A translucent band over a fixed
  // layer is the case this exists for, so anything with alpha keeps walking.
  const groundOf = el => {
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
      const bg = getComputedStyle(n).backgroundColor;
      if (bg && bg !== "rgba(0, 0, 0, 0)" && !/,\s*0(\.\d+)?\)$/.test(bg)) return bg;
    }
    return getComputedStyle(document.body).backgroundColor;
  };

  const out = [];
  for (const el of document.querySelectorAll("body *")) {
    const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(" ").trim();
    if (own.length < 2) continue;
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4 || s.visibility === "hidden" || s.opacity === "0") continue;
    const fg = parse(s.color), bg = parse(groundOf(el));
    if (!fg || !bg) continue;
    const size = parseFloat(s.fontSize), weight = parseInt(s.fontWeight) || 400;
    out.push({ text: own.slice(0, 46), size, weight, ratio: contrast(fg, bg), fg: s.color, bg: groundOf(el) });
  }
  return out;
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const failures = [];
const paths = arg("--url") ? ["/"] : routes();

for (const path of paths) {
  const res = await page.goto(BASE + path, { waitUntil: "networkidle" }).catch(() => null);
  // The 404 page answers with 404, which is correct and must not be a skip.
  // Skipping it is how the first version of this check missed the very bug it
  // was written for: warm-400, the hairline colour, used as 14px body copy
  // there at 2.00:1.
  const ok = res && (res.status() < 400 || path === "/404");
  if (!ok) { console.error(`  skipped ${path} (${res ? res.status() : "no response"})`); continue; }
  // Walk the page so anything that reveals on scroll has revealed.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 90)); }
    window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 400));
  });
  for (const row of await page.evaluate(IN_PAGE)) {
    const large = row.size >= 24 || (row.size >= 18.66 && row.weight >= 700);
    const bar = large ? AA_LARGE : AA_NORMAL;
    if (row.ratio < bar)
      failures.push(`${path}  ${row.ratio.toFixed(2)} against ${bar}  ${row.size}px/${row.weight}  "${row.text}"\n      ${row.fg} on ${row.bg}`);
  }
}
await browser.close();

const unique = [...new Set(failures)];
if (unique.length) {
  console.error(`\n${unique.length} contrast failure(s):\n`);
  for (const f of unique) console.error(`  ${f}`);
  console.error("");
  process.exit(1);
}
console.log(`${paths.length} route(s): no AA failures`);
