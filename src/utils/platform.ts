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

  // Apple Silicon detection
  if (userAgent.includes("mac") && userAgent.includes("arm64")) {
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

export function formatFileSize(bytes: number): string {
  const sizes = ["Bytes", "KB", "MB", "GB"];
  if (bytes === 0) return "0 Bytes";

  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = (bytes / Math.pow(1024, i)).toFixed(1);

  return `${size} ${sizes[i]}`;
}

export function getRecommendedDownload(
  platformAssets: PlatformAsset[],
  userPlatform: Platform
): PlatformAsset | null {
  const userArch = getArchitecture();

  const platformOptions = platformAssets.filter(
    asset => asset.platform === userPlatform
  );

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
