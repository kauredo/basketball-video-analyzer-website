import type { GitHubAsset, PlatformAsset } from "@/types/github";

function detectArchitecture(
  filename: string,
  platform: PlatformAsset["platform"],
): PlatformAsset["architecture"] {
  if (/arm64|aarch64|apple-silicon/.test(filename)) return "arm64";
  if (/x64|x86_64|amd64/.test(filename)) return "x64";
  // The Apple Silicon DMG has no architecture in its name; the Intel one is
  // BasketballVideoAnalyzer-x64.dmg.
  return platform === "macos" ? "arm64" : "x64";
}

export function parseAssets(assets: GitHubAsset[]): PlatformAsset[] {
  const platformAssets: PlatformAsset[] = [];

  for (const asset of assets) {
    const filename = asset.name.toLowerCase();
    let platform: PlatformAsset["platform"];
    let fileType: PlatformAsset["fileType"];

    if (filename.endsWith(".exe")) {
      platform = "windows";
      fileType = "exe";
    } else if (filename.endsWith(".dmg")) {
      platform = "macos";
      fileType = "dmg";
    } else if (filename.endsWith(".deb")) {
      platform = "linux";
      fileType = "deb";
    } else if (filename.endsWith(".rpm")) {
      platform = "linux";
      fileType = "rpm";
    } else if (filename.endsWith(".zip")) {
      fileType = "zip";
      if (filename.includes("darwin") || filename.includes("mac")) {
        platform = "macos";
      } else if (filename.includes("win")) {
        platform = "windows";
      } else {
        platform = "linux";
      }
    } else {
      continue; // update manifests, nupkg and other files
    }

    platformAssets.push({
      platform,
      architecture: detectArchitecture(filename, platform),
      fileType,
      url: asset.browser_download_url,
      size: asset.size,
      filename: asset.name,
    });
  }

  return platformAssets;
}
