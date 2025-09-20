import { useEffect, useState } from 'react';
import { detectPlatform, getPlatformDisplayName, formatFileSize } from '@/utils/platform';
import { getRecommendedDownload } from '@/utils/github';
import { getCachedLatestRelease } from '@/utils/cache';
import { fallbackReleaseData } from '@/utils/fallback';
import type { ReleaseInfo, PlatformAsset, Platform } from '@/types/github';

interface DownloadButtonProps {
  className?: string;
  size?: 'md' | 'lg';
  showVersion?: boolean;
  showSize?: boolean;
}

export function DownloadButton({
  className = '',
  size = 'lg',
  showVersion = true,
  showSize = true
}: DownloadButtonProps) {
  const [release, setRelease] = useState<ReleaseInfo>(fallbackReleaseData);
  const [loading, setLoading] = useState(true);
  const [userPlatform, setUserPlatform] = useState<Platform>('unknown');
  const [recommendedDownload, setRecommendedDownload] = useState<PlatformAsset | null>(null);

  useEffect(() => {
    // Detect user platform
    const platform = detectPlatform();
    setUserPlatform(platform);

    // Fetch latest release data
    getCachedLatestRelease()
      .then(latestRelease => {
        if (latestRelease) {
          setRelease(latestRelease);
        }
      })
      .catch(error => {
        console.error('Failed to fetch release data:', error);
        // Fallback data is already set
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (release && userPlatform !== 'unknown') {
      const recommended = getRecommendedDownload(release.platforms, userPlatform);
      setRecommendedDownload(recommended);
    }
  }, [release, userPlatform]);

  const handleDownload = () => {
    if (recommendedDownload) {
      // Track download event
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as any).gtag('event', 'download', {
          event_category: 'engagement',
          event_label: `${userPlatform}-${release.version}`,
          platform: userPlatform,
          version: release.version,
          file_type: recommendedDownload.fileType,
        });
      }

      // Trigger download
      window.open(recommendedDownload.url, '_blank');
    }
  };

  // Platform icons
  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case 'windows':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.851" />
          </svg>
        );
      case 'macos':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
        );
      case 'linux':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00.043.139c.026.06.063.117.11.162.09.086.208.125.302.235.19.218.47.319.692.231.437-.173.795-.458.795-.458.174-.112.467-.05.573.175.067.14.118.3.118.3.055.184.366.919.366.919.14.328.574.474.915.359.271-.091.429-.419.648-.548.282-.166.596-.268.896-.268.26-.003.52.061.763.164.395.167.79.353 1.207.353.417 0 .812-.186 1.207-.353.243-.103.503-.167.763-.164.3 0 .614.102.896.268.219.129.377.457.648.548.341.115.775-.031.915-.359 0 0 .311-.735.366-.919 0 0 .051-.16.118-.3.106-.225.399-.287.573-.175 0 0 .358.285.795.458.224.088.502-.013.692-.231.094-.11.212-.149.302-.235.047-.045.084-.102.11-.162a.424.424 0 00.043-.139c.123-.805-.009-1.657-.287-2.489-.59-1.771-1.831-3.47-2.716-4.521-.75-1.067-.974-1.928-1.05-3.02-.065-1.491 1.056-5.965-3.17-6.298-.165-.013-.325-.021-.48-.021zm-.764 3.108c.13-.001.257.012.379.041.505.121 1.023.435 1.414.96.495.666.684 1.531.388 2.291-.296.76-.895 1.353-1.622 1.524-.727.171-1.508-.089-2.003-.755-.495-.666-.684-1.531-.388-2.291.221-.567.65-1.056 1.193-1.372.272-.158.569-.246.864-.264.074-.005.148-.007.221-.007l.554-.127zm2.516 3.515c-.132-.001-.261.013-.386.042-.505.12-1.023.434-1.414.96-.495.666-.684 1.531-.388 2.291.296.76.895 1.353 1.622 1.524.727.171 1.508-.089 2.003-.755.495-.666.684-1.531.388-2.291-.221-.567-.65-1.056-1.193-1.372-.272-.158-.569-.246-.864-.264-.074-.005-.148-.007-.221-.007l-.547-.128z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div className={`download-btn ${size === 'lg' ? 'btn-lg' : ''} ${className}`}>
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-5 h-5 bg-white/30 rounded"></div>
          <div className="w-32 h-4 bg-white/30 rounded"></div>
        </div>
      </div>
    );
  }

  if (!recommendedDownload) {
    return (
      <div className={`btn btn-secondary ${size === 'lg' ? 'btn-lg' : ''} ${className}`}>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        Download Available
        {showVersion && <span className="text-sm opacity-80">{release.version}</span>}
      </div>
    );
  }

  return (
    <button
      onClick={handleDownload}
      className={`download-btn ${size === 'lg' ? 'btn-lg' : ''} ${className}`}
      type="button"
    >
      {getPlatformIcon(userPlatform)}
      <span className="flex flex-col items-start">
        <span className="font-semibold">
          Download for {getPlatformDisplayName(userPlatform)}
        </span>
        {(showVersion || showSize) && (
          <span className="text-sm opacity-90 font-normal">
            {showVersion && release.version}
            {showVersion && showSize && ' • '}
            {showSize && formatFileSize(recommendedDownload.size)}
          </span>
        )}
      </span>
      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </button>
  );
}