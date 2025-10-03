import { Octokit } from "@octokit/rest";
import type {
  GitHubAsset,
  GitHubRelease,
  PlatformAsset,
  ReleaseInfo,
  Platform,
} from "@/types/github";
import { getArchitecture } from "./platform";

const octokit = new Octokit({
  auth: import.meta.env.GITHUB_TOKEN, // Optional for higher rate limits
});

const REPO_OWNER = "kauredo";
const REPO_NAME = "basketball-video-analyzer";

export class GitHubAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public rateLimitReset?: Date
  ) {
    super(message);
    this.name = "GitHubAPIError";
  }
}

function parseAssets(assets: GitHubAsset[]): PlatformAsset[] {
  const platformAssets: PlatformAsset[] = [];

  for (const asset of assets) {
    const filename = asset.name.toLowerCase();
    let platform: PlatformAsset["platform"];
    let fileType: PlatformAsset["fileType"];
    let architecture: PlatformAsset["architecture"] = "x64"; // Default

    // Determine platform and file type
    if (
      filename.includes(".exe") ||
      filename.includes("windows") ||
      filename.includes("win32")
    ) {
      platform = "windows";
      fileType = "exe";
    } else if (
      filename.includes(".dmg") ||
      filename.includes("darwin") ||
      filename.includes("macos")
    ) {
      platform = "macos";
      fileType = "dmg";
      // Check for Apple Silicon
      if (filename.includes("arm64") || filename.includes("apple-silicon")) {
        architecture = "arm64";
      }
    } else if (filename.includes(".deb")) {
      platform = "linux";
      fileType = "deb";
    } else if (filename.includes(".rpm")) {
      platform = "linux";
      fileType = "rpm";
    } else if (filename.includes(".zip")) {
      // Determine platform for zip files
      if (filename.includes("win")) {
        platform = "windows";
        fileType = "zip";
      } else if (filename.includes("mac") || filename.includes("darwin")) {
        platform = "macos";
        fileType = "zip";
      } else {
        platform = "linux";
        fileType = "zip";
      }
    } else {
      continue; // Skip unknown file types
    }

    platformAssets.push({
      platform,
      architecture,
      fileType,
      url: asset.browser_download_url,
      size: asset.size,
      filename: asset.name,
    });
  }

  return platformAssets;
}

export async function getLatestRelease(): Promise<ReleaseInfo | null> {
  try {
    const { data: release } = await octokit.rest.repos.getLatestRelease({
      owner: REPO_OWNER,
      repo: REPO_NAME,
    });

    return {
      version: release.tag_name.replace(/^v/, ""),
      releaseDate: new Date(release.published_at ?? 0),
      releaseNotes: release.body || "",
      platforms: parseAssets(release.assets),
      isPrerelease: release.prerelease,
      downloadCount: release.assets.reduce(
        (sum, asset) => sum + asset.download_count,
        0
      ),
    };
  } catch (error: any) {
    console.error("Failed to fetch latest release:", error);

    if (
      error.status === 403 &&
      error.response?.headers?.["x-ratelimit-remaining"] === "0"
    ) {
      const resetTime = new Date(
        parseInt(error.response.headers["x-ratelimit-reset"]) * 1000
      );
      throw new GitHubAPIError(
        "GitHub API rate limit exceeded",
        403,
        resetTime
      );
    }

    return null;
  }
}

export function getRecommendedDownload(
  platformAssets: PlatformAsset[],
  userPlatform: Platform
): PlatformAsset | null {
  const userArch = getArchitecture();

  // Filter by platform
  const platformOptions = platformAssets.filter(
    asset => asset.platform === userPlatform
  );

  if (platformOptions.length === 0) {
    return null;
  }

  // Prefer exact architecture match
  const archMatch = platformOptions.find(
    asset => asset.architecture === userArch
  );
  if (archMatch) {
    return archMatch;
  }

  // Fallback to first available option for the platform
  return platformOptions[0];
}

export async function getAllReleases(): Promise<ReleaseInfo[]> {
  try {
    const { data: releases } = await octokit.rest.repos.listReleases({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      per_page: 10,
    });

    return releases.map(release => ({
      version: release.tag_name.replace(/^v/, ""), // Strip leading 'v'
      releaseDate: new Date(release.published_at ?? 0),
      releaseNotes: release.body || "",
      platforms: parseAssets(release.assets),
      isPrerelease: release.prerelease,
      downloadCount: release.assets.reduce(
        (sum, asset) => sum + asset.download_count,
        0
      ),
    }));
  } catch (error) {
    console.error("Failed to fetch releases:", error);
    return [];
  }
}
