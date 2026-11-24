import { Octokit } from "@octokit/rest";
import type { ReleaseInfo } from "@/types/github";
import { parseAssets } from "@/utils/assets";

const octokit = new Octokit({
  auth: import.meta.env.GITHUB_TOKEN, // Optional for higher rate limits
});

const REPO_OWNER = "kauredo";
const REPO_NAME = "basketball-video-analyzer";

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
  } catch (error) {
    console.error("Failed to fetch latest release:", error);
    return null;
  }
}
