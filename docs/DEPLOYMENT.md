# Deployment Guide - Basketball Video Analyzer Website

## Deployment Platforms

### Recommended: Vercel (Primary Choice)

**Why Vercel:**
- Optimized for Astro applications
- Automatic deployments from Git
- Edge functions for API routes
- Excellent performance and CDN
- Simple environment variable management

**Setup Steps:**
1. Connect GitHub repository to Vercel
2. Configure build settings (auto-detected for Astro)
3. Add environment variables
4. Deploy

**Build Configuration:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

### Alternative: Netlify

**Why Netlify:**
- Great for static sites
- Built-in form handling
- Edge functions available
- Generous free tier

**Setup with `netlify.toml`:**
```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### GitHub Pages (Budget Option)

**Setup with GitHub Actions:**
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build site
        run: npm run build

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

## Environment Configuration

### Production Environment Variables

```bash
# Required for GitHub API integration
GITHUB_OWNER=kauredo
GITHUB_REPO=basketball-video-analyzer
GITHUB_TOKEN=ghp_your_token_here

# Site configuration
SITE_URL=https://basketballvideoanalyzer.com
CONTACT_EMAIL=contact@basketballvideoanalyzer.com

# Analytics (optional)
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
MICROSOFT_CLARITY_ID=xxxxxxxxxx

# Contact form service (if using)
CONTACT_FORM_ENDPOINT=https://formspree.io/f/your-form-id

# Environment
NODE_ENV=production
```

### Vercel Configuration

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm ci",
  "framework": "astro",
  "env": {
    "GITHUB_OWNER": "kauredo",
    "GITHUB_REPO": "basketball-video-analyzer"
  }
}
```

## Domain Setup

### Custom Domain Configuration

**DNS Records for `basketballvideoanalyzer.com`:**
```
Type    Name    Value                       TTL
A       @       76.76.19.61                300
AAAA    @       2606:4700:90:0:f22e:fbec:5bed:a9b9  300
CNAME   www     basketballvideoanalyzer.com.        300
```

**SSL Certificate:**
- Automatically provisioned by hosting platform
- Let's Encrypt or platform-managed certificates
- Ensure HTTPS redirect is enabled

### Subdomain Strategy

```
www.basketballvideoanalyzer.com     → Main website
docs.basketballvideoanalyzer.com    → Documentation (future)
api.basketballvideoanalyzer.com     → API endpoints (future)
blog.basketballvideoanalyzer.com    → Blog/news (future)
```

## Performance Optimization

### Build Optimization

```javascript
// astro.config.mjs - Production optimizations
import { defineConfig } from 'astro/config';

export default defineConfig({
  build: {
    inlineStylesheets: 'auto',
    minify: true,
    rollupOptions: {
      output: {
        entryFileNames: '[name].[hash].js',
        chunkFileNames: '[name].[hash].js',
        assetFileNames: '[name].[hash].[ext]'
      }
    }
  },
  compressHTML: true,
  vite: {
    build: {
      cssMinify: 'lightningcss',
      rollupOptions: {
        external: ['sharp'] // Exclude from bundle if not needed
      }
    }
  }
});
```

### Image Optimization

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import image from '@astrojs/image';

export default defineConfig({
  integrations: [
    image({
      serviceEntryPoint: '@astrojs/image/sharp',
      logLevel: 'info'
    })
  ]
});
```

### CDN Configuration

**Vercel Edge Functions:**
```javascript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Add security headers
  const response = NextResponse.next();

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}
```

## SEO and Meta Configuration

### Sitemap Generation

```javascript
// astro.config.mjs
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://basketballvideoanalyzer.com',
  integrations: [
    sitemap({
      customPages: [
        'https://basketballvideoanalyzer.com/download',
        'https://basketballvideoanalyzer.com/features',
        'https://basketballvideoanalyzer.com/docs'
      ]
    })
  ]
});
```

### robots.txt

```
# public/robots.txt
User-agent: *
Allow: /

Sitemap: https://basketballvideoanalyzer.com/sitemap-index.xml
```

### Meta Tags Template

```astro
---
// src/layouts/BaseLayout.astro
export interface Props {
  title: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
}

const {
  title,
  description = 'Professional video analysis tool for basketball coaches. Cut, organize, and export game footage for team scouting and player development.',
  image = '/images/og-image.png',
  type = 'website'
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
const socialImage = new URL(image, Astro.site);
---

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <!-- Primary Meta Tags -->
  <title>{title} | Basketball Video Analyzer</title>
  <meta name="title" content={title} />
  <meta name="description" content={description} />
  <link rel="canonical" href={canonicalURL} />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content={type} />
  <meta property="og:url" content={canonicalURL} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={socialImage} />
  <meta property="og:site_name" content="Basketball Video Analyzer" />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content={canonicalURL} />
  <meta property="twitter:title" content={title} />
  <meta property="twitter:description" content={description} />
  <meta property="twitter:image" content={socialImage} />

  <!-- Favicon -->
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
</head>
```

## Monitoring and Analytics

### Google Analytics 4

```typescript
// src/utils/analytics.ts
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export function initAnalytics(measurementId: string) {
  if (typeof window === 'undefined') return;

  // Load gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.gtag = window.gtag || function() {
    (window.gtag as any).q = (window.gtag as any).q || [];
    (window.gtag as any).q.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    page_title: document.title,
    page_location: window.location.href,
  });
}

export function trackDownload(platform: string, version: string) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'download', {
      event_category: 'engagement',
      event_label: `${platform}-${version}`,
      value: 1,
    });
  }
}
```

### Performance Monitoring

```typescript
// src/utils/performance.ts
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return;

  // Core Web Vitals
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  });

  // GitHub API performance
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name.includes('api.github.com')) {
        console.log('GitHub API timing:', entry.duration);
      }
    }
  });

  observer.observe({ entryTypes: ['resource'] });
}
```

## Security Configuration

### Content Security Policy

```javascript
// Add to hosting platform headers
const csp = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.github.com https://www.google-analytics.com;
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
  upgrade-insecure-requests;
`;

// Vercel - vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com"
        }
      ]
    }
  ]
}
```

### Environment Security

```bash
# Production security checklist
- [ ] GitHub token has minimal required permissions
- [ ] Environment variables are not exposed in client code
- [ ] API endpoints implement rate limiting
- [ ] HTTPS is enforced
- [ ] Security headers are configured
- [ ] Dependencies are regularly updated
```

## Backup and Recovery

### Automated Backups
- Git repository serves as primary backup
- Deploy from multiple branches for testing
- Database not required (static site)
- Asset backup through Git LFS if needed

### Disaster Recovery
1. **DNS Failover**: Point domain to backup hosting
2. **Static Fallback**: Serve cached version during API outages
3. **Rollback Strategy**: Deploy previous Git commit
4. **Monitoring**: Alert on site downtime or API failures

## Maintenance Schedule

### Daily
- Monitor site uptime and performance
- Check GitHub API rate limits
- Review error logs

### Weekly
- Update dependencies with security patches
- Review analytics and download metrics
- Test download links functionality

### Monthly
- Performance audit and optimization
- SEO analysis and improvements
- Content updates and screenshots
- Security dependency updates

### Quarterly
- Full security audit
- Infrastructure cost review
- User feedback analysis
- Major feature updates

## Launch Checklist

### Pre-Launch
- [ ] Domain configured and SSL active
- [ ] All environment variables set
- [ ] Analytics and monitoring configured
- [ ] SEO meta tags complete
- [ ] Performance optimized (Lighthouse 90+)
- [ ] Cross-browser testing complete
- [ ] Mobile responsiveness verified
- [ ] Download links tested on all platforms

### Post-Launch
- [ ] Monitor initial traffic and downloads
- [ ] Set up alerts for downtime
- [ ] Submit sitemap to search engines
- [ ] Social media announcement
- [ ] Coach community outreach
- [ ] Gather initial user feedback

### Ongoing
- [ ] Weekly performance reviews
- [ ] Monthly content updates
- [ ] Quarterly feature enhancements
- [ ] Annual infrastructure review