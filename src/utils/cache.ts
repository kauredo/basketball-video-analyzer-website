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

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  size(): number {
    return this.cache.size;
  }
}

export const apiCache = new APICache();

// Cache-aware GitHub API wrapper
import { getLatestRelease } from './github';
import type { ReleaseInfo } from '@/types/github';

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