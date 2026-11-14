import { test } from "node:test";
import assert from "node:assert/strict";
import { parseAssets } from "./assets.ts";

const names = [
  "basketball-video-analyzer-1.13.0-1.x86_64.rpm",
  "basketball-video-analyzer_1.13.0_amd64.deb",
  "BasketballVideoAnalyzer-1.13.0-full.nupkg",
  "BasketballVideoAnalyzer-1.13.0.Setup.exe",
  "BasketballVideoAnalyzer-darwin-arm64-1.13.0.zip",
  "BasketballVideoAnalyzer.dmg",
  "latest-linux.yml",
  "latest-mac.yml",
  "latest.yml",
  "RELEASES",
];

const parsed = parseAssets(
  names.map((name, id) => ({
    id,
    name,
    browser_download_url: `https://example.test/${name}`,
    size: 1,
    download_count: 0,
    content_type: "application/octet-stream",
  })),
);
const byName = (n: string) => parsed.find((a) => a.filename === n);

test("the macOS DMG is an Apple Silicon build", () => {
  assert.deepEqual(
    [
      byName("BasketballVideoAnalyzer.dmg")?.platform,
      byName("BasketballVideoAnalyzer.dmg")?.fileType,
      byName("BasketballVideoAnalyzer.dmg")?.architecture,
    ],
    ["macos", "dmg", "arm64"],
  );
});

test("the darwin zip is a zip, not a dmg", () => {
  const zip = byName("BasketballVideoAnalyzer-darwin-arm64-1.13.0.zip");
  assert.equal(zip?.platform, "macos");
  assert.equal(zip?.fileType, "zip");
  assert.equal(zip?.architecture, "arm64");
});

test("Windows and Linux files keep x64", () => {
  for (const [n, p, t] of [
    ["BasketballVideoAnalyzer-1.13.0.Setup.exe", "windows", "exe"],
    ["basketball-video-analyzer_1.13.0_amd64.deb", "linux", "deb"],
    ["basketball-video-analyzer-1.13.0-1.x86_64.rpm", "linux", "rpm"],
  ]) {
    const a = byName(n);
    assert.deepEqual(
      [a?.platform, a?.fileType, a?.architecture],
      [p, t, "x64"],
    );
  }
});

test("manifests and nupkg are skipped", () => {
  assert.equal(parsed.length, 5);
});
