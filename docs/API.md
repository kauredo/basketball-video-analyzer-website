# GitHub API Integration Documentation

## Overview

The Basketball Video Analyzer website integrates with GitHub's REST API to automatically fetch release information, display download links, and show version information in real-time.

## API Endpoints Used

### 1. Latest Release
```
GET /repos/kauredo/basketball-video-analyzer/releases/latest
```

**Purpose**: Fetch the most recent release for download buttons and version display.

**Response Structure**:
```typescript
interface GitHubRelease {
  id: number;
  tag_name: string;        // e.g., "v1.0.0"
  name: string;            // Release title
  body: string;            // Release notes (Markdown)
  published_at: string;    // ISO date string
  assets: GitHubAsset[];   // Download files
  prerelease: boolean;     // Is this a pre-release?
  draft: boolean;          // Is this a draft?
}

interface GitHubAsset {
  id: number;
  name: string;                    // e.g., "basketball-video-analyzer-1.0.0.dmg"
  browser_download_url: string;    // Direct download URL
  size: number;                    // File size in bytes
  download_count: number;          // Number of downloads
  content_type: string;            // MIME type
}
```

### 2. All Releases
```
GET /repos/kauredo/basketball-video-analyzer/releases
```

**Purpose**: Show release history, changelog, and version comparison.

### 3. Repository Information
```
GET /repos/kauredo/basketball-video-analyzer
```

**Purpose**: Display repository stats, stars, watchers, and general information.

## Implementation

### API Client Setup

```typescript
// src/utils/github.ts
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: import.meta.env.GITHUB_TOKEN, // Optional for higher rate limits
});

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
```

### Fetch Latest Release

```typescript
export async function getLatestRelease(): Promise<ReleaseInfo | null> {
  try {
    const { data: release } = await octokit.rest.repos.getLatestRelease({
      owner: 'kauredo',
      repo: 'basketball-video-analyzer',
    });

    return {
      version: release.tag_name,
      releaseDate: new Date(release.published_at),
      releaseNotes: release.body || '',
      platforms: parseAssets(release.assets),
      isPrerelease: release.prerelease,
      downloadCount: release.assets.reduce((sum, asset) => sum + asset.download_count, 0),
    };
  } catch (error) {
    console.error('Failed to fetch latest release:', error);
    return null;
  }
}
```

### Parse Release Assets

```typescript
function parseAssets(assets: GitHubAsset[]): PlatformAsset[] {
  const platformAssets: PlatformAsset[] = [];

  for (const asset of assets) {
    const filename = asset.name.toLowerCase();
    let platform: PlatformAsset['platform'];
    let fileType: PlatformAsset['fileType'];
    let architecture: PlatformAsset['architecture'] = 'x64'; // Default

    // Determine platform and file type
    if (filename.includes('.exe') || filename.includes('windows') || filename.includes('win32')) {
      platform = 'windows';
      fileType = 'exe';
    } else if (filename.includes('.dmg') || filename.includes('darwin') || filename.includes('macos')) {
      platform = 'macos';
      fileType = 'dmg';
      // Check for Apple Silicon
      if (filename.includes('arm64') || filename.includes('apple-silicon')) {
        architecture = 'arm64';
      }
    } else if (filename.includes('.deb')) {
      platform = 'linux';
      fileType = 'deb';
    } else if (filename.includes('.rpm')) {
      platform = 'linux';
      fileType = 'rpm';
    } else if (filename.includes('.zip')) {
      // Determine platform for zip files
      if (filename.includes('win')) {
        platform = 'windows';
        fileType = 'zip';
      } else if (filename.includes('mac') || filename.includes('darwin')) {
        platform = 'macos';
        fileType = 'zip';
      } else {
        platform = 'linux';
        fileType = 'zip';
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
```

## Platform Detection

### Browser-Based OS Detection

```typescript
// src/utils/platform.ts
export type Platform = 'windows' | 'macos' | 'linux' | 'unknown';

export function detectPlatform(): Platform {
  if (typeof window === 'undefined') {
    return 'unknown'; // Server-side rendering
  }

  const userAgent = window.navigator.userAgent.toLowerCase();
  const platform = window.navigator.platform.toLowerCase();

  // macOS detection
  if (platform.includes('mac') || userAgent.includes('mac os')) {
    return 'macos';
  }

  // Windows detection
  if (platform.includes('win') || userAgent.includes('windows')) {
    return 'windows';
  }

  // Linux detection
  if (platform.includes('linux') || userAgent.includes('linux')) {
    return 'linux';
  }

  return 'unknown';
}

export function getArchitecture(): 'x64' | 'arm64' | 'unknown' {
  if (typeof window === 'undefined') {
    return 'unknown';
  }

  const userAgent = window.navigator.userAgent.toLowerCase();

  // Apple Silicon detection
  if (userAgent.includes('mac') && userAgent.includes('arm64')) {
    return 'arm64';
  }

  // Default to x64 for most platforms
  return 'x64';
}
```

### Smart Download Recommendation

```typescript
export function getRecommendedDownload(
  platformAssets: PlatformAsset[],
  userPlatform: Platform
): PlatformAsset | null {
  const userArch = getArchitecture();

  // Filter by platform
  const platformOptions = platformAssets.filter(asset => asset.platform === userPlatform);

  if (platformOptions.length === 0) {
    return null;
  }

  // Prefer exact architecture match
  const archMatch = platformOptions.find(asset => asset.architecture === userArch);
  if (archMatch) {
    return archMatch;
  }

  // Fallback to first available option for the platform
  return platformOptions[0];
}
```

## Caching Strategy

### Client-Side Caching

```typescript
// src/utils/cache.ts
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class APICache {
  private cache = new Map<string, CacheEntry<any>>();

  set<T>(key: string, data: T, ttlMinutes: number = 10): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const apiCache = new APICache();
```

### Cached Release Fetching

```typescript
export async function getCachedLatestRelease(): Promise<ReleaseInfo | null> {
  const cacheKey = 'latest-release';

  // Try cache first
  let release = apiCache.get<ReleaseInfo>(cacheKey);
  if (release) {
    return release;
  }

  // Fetch from API
  release = await getLatestRelease();
  if (release) {
    // Cache for 10 minutes
    apiCache.set(cacheKey, release, 10);
  }

  return release;
}
```

## Error Handling

### Rate Limit Handling

```typescript
export class GitHubAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public rateLimitReset?: Date
  ) {
    super(message);
    this.name = 'GitHubAPIError';
  }
}

export async function handleAPICall<T>(
  apiCall: () => Promise<T>
): Promise<T | null> {
  try {
    return await apiCall();
  } catch (error: any) {
    if (error.status === 403 && error.response?.headers?.['x-ratelimit-remaining'] === '0') {
      const resetTime = new Date(
        parseInt(error.response.headers['x-ratelimit-reset']) * 1000
      );

      throw new GitHubAPIError(
        'GitHub API rate limit exceeded',
        403,
        resetTime
      );
    }

    console.error('GitHub API error:', error);
    return null;
  }
}
```

### Fallback Data

```typescript
// src/data/fallback.ts
export const fallbackReleaseData: ReleaseInfo = {
  version: 'v1.0.0',
  releaseDate: new Date('2024-01-01'),
  releaseNotes: 'Latest stable release with video cutting and organization features.',
  platforms: [
    {
      platform: 'windows',
      architecture: 'x64',
      fileType: 'exe',
      url: '#',
      size: 85000000, // ~85MB
      filename: 'basketball-video-analyzer-setup.exe',
    },
    {
      platform: 'macos',
      architecture: 'x64',
      fileType: 'dmg',
      url: '#',
      size: 95000000, // ~95MB
      filename: 'basketball-video-analyzer.dmg',
    },
    {
      platform: 'linux',
      architecture: 'x64',
      fileType: 'deb',
      url: '#',
      size: 80000000, // ~80MB
      filename: 'basketball-video-analyzer.deb',
    },
  ],
  isPrerelease: false,
  downloadCount: 0,
};
```

## Usage in Components

### React Component Example

```tsx
// src/components/DownloadButton.tsx
import { useEffect, useState } from 'react';
import { getCachedLatestRelease, detectPlatform, getRecommendedDownload } from '@/utils';
import type { ReleaseInfo, PlatformAsset } from '@/utils/github';

export function DownloadButton() {
  const [release, setRelease] = useState<ReleaseInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [userPlatform] = useState(() => detectPlatform());

  useEffect(() => {
    getCachedLatestRelease()
      .then(setRelease)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (!release) {
    return <div>Download information unavailable</div>;
  }

  const recommendedDownload = getRecommendedDownload(release.platforms, userPlatform);

  if (!recommendedDownload) {
    return <div>No download available for your platform</div>;
  }

  return (
    <a
      href={recommendedDownload.url}
      className="btn-primary inline-flex items-center gap-2"
      download
    >
      <DownloadIcon />
      Download for {userPlatform === 'macos' ? 'macOS' :
                   userPlatform === 'windows' ? 'Windows' : 'Linux'}
      <span className="text-sm opacity-80">
        {release.version} • {formatFileSize(recommendedDownload.size)}
      </span>
    </a>
  );
}
```

### Astro Component Example

```astro
---
// src/components/ReleaseInfo.astro
import { getCachedLatestRelease } from '@/utils/github';
import { fallbackReleaseData } from '@/data/fallback';

const release = await getCachedLatestRelease() ?? fallbackReleaseData;
---

<div class="release-info">
  <h3>Latest Release: {release.version}</h3>
  <p>Released {release.releaseDate.toLocaleDateString()}</p>
  <p>Total Downloads: {release.downloadCount.toLocaleString()}</p>

  {release.isPrerelease && (
    <span class="badge-warning">Pre-release</span>
  )}
</div>
```

## Security Considerations

### API Token Security
- Store GitHub token in environment variables only
- Use minimal required permissions (`public_repo` scope)
- Implement rate limiting on the client side
- Never expose tokens in client-side code

### Content Security
- Sanitize release notes content (Markdown)
- Validate download URLs before redirecting
- Implement HTTPS-only download links
- Monitor for malicious releases (if accepting community contributions)

## Performance Optimization

### Bundle Size
- Import only needed parts of Octokit
- Use dynamic imports for GitHub functionality
- Implement code splitting for release pages

### API Efficiency
- Cache responses aggressively
- Use conditional requests with ETags
- Implement pagination for release lists
- Minimize API calls during static generation

## Monitoring and Analytics

### Track Download Events
```typescript
export function trackDownload(platform: string, version: string, fileType: string) {
  // Google Analytics 4
  if (typeof gtag !== 'undefined') {
    gtag('event', 'download', {
      platform,
      version,
      file_type: fileType,
    });
  }
}
```

### Monitor API Health
- Track API response times
- Monitor rate limit usage
- Alert on API failures
- Log download conversion rates