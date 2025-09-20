# Basketball Video Analyzer Website - Setup Guide

## Prerequisites

### Required Software
- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher (comes with Node.js)
- **Git**: For version control
- **VS Code**: Recommended editor with Astro extension

### Recommended VS Code Extensions
```json
{
  "recommendations": [
    "astro-build.astro-vscode",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "unifiedjs.vscode-mdx"
  ]
}
```

## Project Setup

### 1. Initialize Astro Project
```bash
# Create new Astro project
npm create astro@latest basketball-video-analyzer-website

# Choose options:
# - Template: "Just the basics"
# - TypeScript: Yes
# - Integrations: None (we'll add them manually)
```

### 2. Install Dependencies
```bash
cd basketball-video-analyzer-website
npm install

# Add additional dependencies
npm install @astrojs/tailwind @astrojs/react @astrojs/sitemap
npm install tailwindcss @tailwindcss/typography
npm install @types/node
npm install @octokit/rest  # For GitHub API integration
```

### 3. Configure Astro
```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://basketballvideoanalyzer.com',
  integrations: [
    tailwind({
      config: { path: './tailwind.config.cjs' }
    }),
    react(),
    sitemap()
  ],
  vite: {
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }
  }
});
```

### 4. Configure Tailwind CSS
```javascript
// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Basketball-themed color palette
        primary: {
          50: '#FFF4ED',
          100: '#FFE6D5',
          200: '#FFD0AA',
          300: '#FFB274',
          400: '#FF8A5C',
          500: '#FF6B35', // Main brand color
          600: '#E55A2B',
          700: '#CC4A1F',
          800: '#B33E17',
          900: '#99340F',
        },
        court: {
          wood: '#D4A574',
          line: '#FFFFFF',
          net: '#E8E8E8',
        },
        neutral: {
          950: '#0A0A0A',
        }
      },
      fontFamily: {
        display: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
        body: ['Inter', 'SF Pro Text', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s infinite',
        'bounce-gentle': 'bounce 2s infinite',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
```

### 5. TypeScript Configuration
```json
// tsconfig.json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/layouts/*": ["src/layouts/*"],
      "@/utils/*": ["src/utils/*"],
      "@/types/*": ["src/types/*"]
    }
  }
}
```

## Development Environment

### Environment Variables
Create `.env` file in project root:
```bash
# GitHub API Configuration
GITHUB_OWNER=kauredo
GITHUB_REPO=basketball-video-analyzer
GITHUB_TOKEN=your_github_token_here  # Optional, for higher rate limits

# Analytics (optional)
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID

# Contact Form (if using a service like Formspree)
CONTACT_FORM_ENDPOINT=your_form_endpoint_here
```

### Development Scripts
Add to `package.json`:
```json
{
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "type-check": "astro check",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx,.astro",
    "format": "prettier --write .",
    "test": "vitest",
    "test:ui": "vitest --ui"
  }
}
```

### VS Code Workspace Settings
Create `.vscode/settings.json`:
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "astro.typescript.allowArbitraryAttributes": true,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[astro]": {
    "editor.defaultFormatter": "astro-build.astro-vscode"
  }
}
```

## Project Structure

### Directory Organization
```
basketball-video-analyzer-website/
├── docs/                      # Documentation (current)
├── public/                    # Static assets
│   ├── images/               # Screenshots, icons, logos
│   ├── icons/                # Favicon and app icons
│   └── downloads/            # Any local download files
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Basic UI elements (Button, Card, etc.)
│   │   ├── layout/          # Layout components (Header, Footer)
│   │   ├── sections/        # Page sections (Hero, Features)
│   │   └── features/        # Feature-specific components
│   ├── layouts/             # Page layouts
│   │   ├── BaseLayout.astro # Main layout template
│   │   └── DocsLayout.astro # Documentation layout
│   ├── pages/               # Website pages
│   │   ├── index.astro      # Homepage
│   │   ├── features.astro   # Features page
│   │   ├── download.astro   # Download page
│   │   ├── docs/           # Documentation pages
│   │   └── api/            # API endpoints
│   ├── styles/              # CSS files
│   │   ├── global.css      # Global styles
│   │   └── components.css  # Component-specific styles
│   ├── utils/               # Utility functions
│   │   ├── github.ts       # GitHub API integration
│   │   ├── platform.ts     # OS detection
│   │   └── analytics.ts    # Analytics helpers
│   └── types/               # TypeScript type definitions
│       ├── github.ts       # GitHub API types
│       └── app.ts          # Application types
├── astro.config.mjs         # Astro configuration
├── tailwind.config.cjs      # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

## GitHub Integration Setup

### Personal Access Token
1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate new token with `public_repo` scope
3. Add to `.env` file as `GITHUB_TOKEN`

### API Rate Limits
- **Unauthenticated**: 60 requests per hour
- **Authenticated**: 5,000 requests per hour
- **Caching**: Implement caching to reduce API calls

## Development Workflow

### 1. Start Development Server
```bash
npm run dev
# Server starts at http://localhost:3000
```

### 2. Build for Production
```bash
npm run build
# Outputs to dist/ directory
```

### 3. Preview Production Build
```bash
npm run preview
# Serves the built site locally
```

### 4. Type Checking
```bash
npm run type-check
# Validates TypeScript and Astro files
```

## Content Management

### Screenshots and Assets
- Store all app screenshots in `/public/images/screenshots/`
- Use WebP format with PNG fallbacks
- Optimize images with tools like Squoosh or ImageOptim
- Create responsive image variants

### Documentation
- Write docs in Markdown with frontmatter
- Use consistent headings and structure
- Include code examples with syntax highlighting
- Add screenshots where helpful

## Performance Optimization

### Image Optimization
```javascript
// Use Astro's built-in image optimization
import { Picture } from '@astrojs/image/components';

<Picture
  src="/images/hero-screenshot.png"
  alt="Basketball Video Analyzer interface"
  widths={[320, 640, 1280]}
  formats={['webp', 'png']}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### Bundle Optimization
- Use Astro's partial hydration for interactive components
- Code-split large dependencies
- Implement lazy loading for below-the-fold content

### SEO Setup
- Configure meta tags in layout components
- Generate sitemap with `@astrojs/sitemap`
- Add structured data for better search results
- Optimize images with alt text

## Deployment

### Recommended Platforms
1. **Vercel**: Optimal for Astro, automatic deployments
2. **Netlify**: Great for static sites, form handling
3. **GitHub Pages**: Free option with GitHub integration

### Environment Setup
- Production environment variables
- Custom domain configuration
- SSL certificate setup
- CDN optimization

## Next Steps

After completing this setup:
1. Complete the documentation phase (current)
2. Implement the design system
3. Build core components and layouts
4. Integrate GitHub API functionality
5. Add content and screenshots
6. Optimize and deploy

See `DESIGN.md` for visual design guidelines and `API.md` for GitHub integration details.