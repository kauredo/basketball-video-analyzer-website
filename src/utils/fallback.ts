import type { ReleaseInfo } from "@/types/github";

const RELEASES_URL =
  "https://github.com/kauredo/basketball-video-analyzer/releases/latest";

// Asset file names carry the version, so these point at the releases page
// instead of a file URL that goes stale with the next release.
export const fallbackReleaseData: ReleaseInfo = {
  version: "1.13.0",
  releaseDate: new Date("2026-11-09"),
  releaseNotes: "",
  platforms: [
    {
      platform: "windows",
      architecture: "x64",
      fileType: "exe",
      url: RELEASES_URL,
      size: 223512576,
      filename: "BasketballVideoAnalyzer-1.13.0.Setup.exe",
    },
    {
      platform: "macos",
      architecture: "arm64",
      fileType: "dmg",
      url: RELEASES_URL,
      size: 218045867,
      filename: "BasketballVideoAnalyzer.dmg",
    },
    {
      platform: "linux",
      architecture: "x64",
      fileType: "deb",
      url: RELEASES_URL,
      size: 201257428,
      filename: "basketball-video-analyzer_1.13.0_amd64.deb",
    },
  ],
  isPrerelease: false,
  downloadCount: 0,
};
