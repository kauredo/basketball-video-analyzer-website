import { Octokit } from "@octokit/rest";
import type { ReleaseInfo } from "@/types/github";
import { parseAssets } from "@/utils/assets";

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
