export interface GitHubRelease {
  id: number;
  tag_name: string;        // e.g., "v1.0.0"
  name: string;            // Release title
  body: string;            // Release notes (Markdown)
  published_at: string;    // ISO date string
  assets: GitHubAsset[];   // Download files
  prerelease: boolean;     // Is this a pre-release?
  draft: boolean;          // Is this a draft?
}

export interface GitHubAsset {
  id: number;
  name: string;                    // e.g., "basketball-video-analyzer-1.0.0.dmg"
  browser_download_url: string;    // Direct download URL
  size: number;                    // File size in bytes
  download_count: number;          // Number of downloads
  content_type: string;            // MIME type
}

export interface PlatformAsset {
  platform: 'windows' | 'macos' | 'linux';
  architecture: 'x64' | 'arm64' | 'universal';
  fileType: 'exe' | 'dmg' | 'deb' | 'rpm' | 'zip';
  url: string;
  size: number;
  filename: string;
}

export interface ReleaseInfo {
  version: string;
  releaseDate: Date;
  releaseNotes: string;
  platforms: PlatformAsset[];
  isPrerelease: boolean;
  downloadCount: number;
}

export type Platform = 'windows' | 'macos' | 'linux' | 'unknown';
export type Architecture = 'x64' | 'arm64' | 'unknown';