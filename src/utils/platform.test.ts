import { test } from "node:test";
import assert from "node:assert/strict";
import { parseAssets } from "./assets.ts";
import { getRecommendedDownload, getIntelMacDownload } from "./platform.ts";

const release = (names: string[]) =>
  parseAssets(
    names.map((name, id) => ({
      id,
      name,
      browser_download_url: `https://example.test/${name}`,
      size: 1,
      download_count: 0,
      content_type: "application/octet-stream",
    })),
  );

const both = release([
  "BasketballVideoAnalyzer-x64.dmg",
  "BasketballVideoAnalyzer.dmg",
  "BasketballVideoAnalyzer-darwin-x64-1.14.0.zip",
  "BasketballVideoAnalyzer-darwin-arm64-1.14.0.zip",
]);

test("a Mac gets the Apple Silicon DMG even when an Intel one ships", () => {
  assert.equal(getRecommendedDownload(both, "macos")?.filename, "BasketballVideoAnalyzer.dmg");
});

test("the Intel DMG is found when it ships, and only then", () => {
  assert.equal(getIntelMacDownload(both)?.filename, "BasketballVideoAnalyzer-x64.dmg");
  assert.equal(getIntelMacDownload(release(["BasketballVideoAnalyzer.dmg"])), null);
});

const withUserAgent = (ua: string, run: () => void) => {
  (globalThis as any).window = { navigator: { userAgent: ua, platform: "Linux" } };
  try {
    run();
  } finally {
    delete (globalThis as any).window;
  }
};

test("Linux picks the package for its own architecture", () => {
  const linux = release([
    "basketball-video-analyzer_1.14.0_arm64.deb",
    "basketball-video-analyzer_1.14.0_amd64.deb",
  ]);
  withUserAgent("Mozilla/5.0 (X11; Linux x86_64)", () =>
    assert.equal(getRecommendedDownload(linux, "linux")?.architecture, "x64"),
  );
  withUserAgent("Mozilla/5.0 (X11; Linux aarch64)", () =>
    assert.equal(getRecommendedDownload(linux, "linux")?.architecture, "arm64"),
  );
});
