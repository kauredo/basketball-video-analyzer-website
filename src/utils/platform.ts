import type { Platform, Architecture, PlatformAsset } from "@/types/github";

export function detectPlatform(): Platform {
  if (typeof window === "undefined") {
    return "unknown"; // Server-side rendering
  }

  const userAgent = window.navigator.userAgent.toLowerCase();
  const platform = window.navigator.platform.toLowerCase();

  // macOS detection
  if (platform.includes("mac") || userAgent.includes("mac os")) {
    return "macos";
  }

  // Windows detection
  if (platform.includes("win") || userAgent.includes("windows")) {
    return "windows";
  }

  // Linux detection
  if (platform.includes("linux") || userAgent.includes("linux")) {
    return "linux";
  }

  return "unknown";
}

export function getArchitecture(): Architecture {
  if (typeof window === "undefined") {
    return "unknown";
  }

  const userAgent = window.navigator.userAgent.toLowerCase();

  // Arm Linux browsers say so ("Linux aarch64"); Mac browsers never do.
  if (userAgent.includes("aarch64") || userAgent.includes("arm64")) {
    return "arm64";
  }

  // Default to x64 for most platforms
  return "x64";
}

export function getPlatformDisplayName(platform: Platform): string {
  switch (platform) {
    case "macos":
      return "macOS";
    case "windows":
      return "Windows";
    case "linux":
      return "Linux";
    default:
      return "Unknown";
  }
}

export function getDownloadLabel(platform: Platform): string {
  const name = getPlatformDisplayName(platform);
  return platform === "macos" ? `${name} (Apple Silicon)` : name;
}

export function formatFileSize(bytes: number): string {
  const sizes = ["Bytes", "KB", "MB", "GB"];
  if (bytes === 0) return "0 Bytes";

  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = (bytes / Math.pow(1024, i)).toFixed(1);

  return `${size} ${sizes[i]}`;
}

/** The Intel Mac DMG, when a release has one. */
export function getIntelMacDownload(platformAssets: PlatformAsset[]): PlatformAsset | null {
  return (
    platformAssets.find(
      asset => asset.platform === "macos" && asset.fileType === "dmg" && asset.architecture === "x64"
    ) ?? null
  );
}

export function getRecommendedDownload(
  platformAssets: PlatformAsset[],
  userPlatform: Platform
): PlatformAsset | null {
  // Every Mac browser reports "Intel Mac OS X", Apple Silicon included, so
  // the user agent cannot tell them apart. Most Macs now are Apple Silicon:
  // offer that build, and the button links the Intel one beside it.
  const userArch = userPlatform === "macos" ? "arm64" : getArchitecture();

  const platformAssetsForUser = platformAssets.filter(
    asset => asset.platform === userPlatform
  );
  // Installers first: a Mac with a DMG gets the DMG, never a zip.
  const installers = platformAssetsForUser.filter(
    asset => asset.fileType === "dmg"
  );
  const platformOptions = (
    userPlatform === "macos" && installers.length > 0
      ? installers
      : platformAssetsForUser
  ).sort((a, b) => Number(a.fileType === "zip") - Number(b.fileType === "zip"));

  if (platformOptions.length === 0) {
    return null;
  }

  const archMatch = platformOptions.find(
    asset => asset.architecture === userArch
  );
  if (archMatch) {
    return archMatch;
  }

  return platformOptions[0];
}
