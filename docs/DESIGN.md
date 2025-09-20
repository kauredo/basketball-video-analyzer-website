# Basketball Video Analyzer - Design System Documentation

## Visual Identity

### Brand Personality

- **Professional**: Trustworthy for educational and competitive environments
- **Athletic**: Energy and dynamism of basketball
- **Technical**: Sophisticated video analysis capabilities
- **Accessible**: Easy to understand for coaches of all technical levels

### Color Palette

#### Primary Colors

```css
/* Basketball Orange - Primary brand color */
--color-primary: #ff6b35; /* Vibrant basketball orange */
--color-primary-dark: #e55a2b; /* Darker shade for hover states */
--color-primary-light: #ff8a5c; /* Lighter shade for backgrounds */

/* Court Colors - Secondary palette */
--color-court-wood: #d4a574; /* Hardwood court color */
--color-court-line: #ffffff; /* Court line markings */
--color-net: #e8e8e8; /* Basketball net color */
```

#### Neutral Colors

```css
/* Professional grays for text and backgrounds */
--color-neutral-900: #1a1a1a; /* Darkest text */
--color-neutral-800: #2d2d2d; /* Dark text */
--color-neutral-600: #6b6b6b; /* Medium text */
--color-neutral-400: #a0a0a0; /* Light text */
--color-neutral-200: #e5e5e5; /* Borders */
--color-neutral-100: #f5f5f5; /* Light backgrounds */
--color-neutral-50: #fafafa; /* Lightest backgrounds */
```

#### Status Colors

```css
/* Semantic colors for UI states */
--color-success: #22c55e; /* Success states, downloads */
--color-warning: #f59e0b; /* Warnings, system requirements */
--color-error: #ef4444; /* Errors, unsupported platforms */
--color-info: #3b82f6; /* Information, tips */
```

### Typography

#### Font Stack

```css
/* Primary font for headings and important text */
--font-display: "Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif;

/* Secondary font for body text */
--font-body: "Inter", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif;

/* Monospace for code and technical specs */
--font-code: "JetBrains Mono", "SF Mono", "Monaco", "Cascadia Code", monospace;
```

#### Type Scale

```css
/* Heading sizes */
--text-5xl: 3rem; /* 48px - Hero headings */
--text-4xl: 2.25rem; /* 36px - Page headings */
--text-3xl: 1.875rem; /* 30px - Section headings */
--text-2xl: 1.5rem; /* 24px - Subsection headings */
--text-xl: 1.25rem; /* 20px - Component headings */
--text-lg: 1.125rem; /* 18px - Large body text */

/* Body text sizes */
--text-base: 1rem; /* 16px - Default body text */
--text-sm: 0.875rem; /* 14px - Small text */
--text-xs: 0.75rem; /* 12px - Captions, labels */
```

#### Font Weights

```css
--weight-light: 300; /* Light text */
--weight-normal: 400; /* Regular body text */
--weight-medium: 500; /* Emphasized text */
--weight-semibold: 600; /* Section headings */
--weight-bold: 700; /* Important headings */
--weight-black: 900; /* Hero text, major emphasis */
```

### Layout System

#### Spacing Scale

```css
/* Consistent spacing system based on 8px grid */
--space-1: 0.25rem; /* 4px */
--space-2: 0.5rem; /* 8px */
--space-3: 0.75rem; /* 12px */
--space-4: 1rem; /* 16px */
--space-5: 1.25rem; /* 20px */
--space-6: 1.5rem; /* 24px */
--space-8: 2rem; /* 32px */
--space-10: 2.5rem; /* 40px */
--space-12: 3rem; /* 48px */
--space-16: 4rem; /* 64px */
--space-20: 5rem; /* 80px */
--space-24: 6rem; /* 96px */
```

#### Container Sizes

```css
/* Max widths for content containers */
--container-sm: 640px; /* Small screens */
--container-md: 768px; /* Medium screens */
--container-lg: 1024px; /* Large screens */
--container-xl: 1280px; /* Extra large screens */
--container-2xl: 1536px; /* Maximum content width */
```

#### Breakpoints

```css
/* Responsive design breakpoints */
--breakpoint-sm: 640px; /* Small tablets */
--breakpoint-md: 768px; /* Large tablets */
--breakpoint-lg: 1024px; /* Small laptops */
--breakpoint-xl: 1280px; /* Large laptops */
--breakpoint-2xl: 1536px; /* Desktops */
```

### Component Patterns

#### Button Styles

```css
/* Primary action button - downloads, CTAs */
.btn-primary {
  background: var(--color-primary);
  color: white;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: var(--weight-semibold);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}

/* Secondary button - navigation, secondary actions */
.btn-secondary {
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  border-radius: 8px;
  padding: 10px 22px;
  font-weight: var(--weight-medium);
}

/* Ghost button - subtle actions */
.btn-ghost {
  background: transparent;
  color: var(--color-neutral-600);
  border: none;
  padding: 8px 16px;
  font-weight: var(--weight-medium);
}
```

#### Card Components

```css
/* Feature cards, testimonials, etc. */
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: var(--space-6);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.15);
}

/* Hero card for main download */
.card-hero {
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-primary-dark) 100%
  );
  color: white;
  border-radius: 16px;
  padding: var(--space-8);
}
```

### Basketball-Themed Elements

#### Court Pattern

```css
/* Basketball court texture for backgrounds */
.court-pattern {
  background-image: linear-gradient(
      90deg,
      var(--color-court-line) 1px,
      transparent 1px
    ), linear-gradient(var(--color-court-line) 1px, transparent 1px);
  background-size: 50px 50px;
  background-color: var(--color-court-wood);
  opacity: 0.1;
}
```

#### Basketball Icon Integration

- Use basketball, hoop, and court iconography sparingly
- Integrate with video play buttons (basketball-shaped play buttons)
- Court lines as decorative elements in section dividers
- Basketball texture in hero background (subtle)

### Animation Guidelines

#### Micro-interactions

```css
/* Subtle hover animations */
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
}

/* Download button pulse effect */
.download-pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
```

#### Page Transitions

- Fade-in on scroll for sections
- Stagger animations for feature lists
- Smooth scroll behavior
- Loading states for GitHub API calls

### Accessibility

#### Color Contrast

- All text meets WCAG AA standards (4.5:1 ratio minimum)
- Interactive elements meet AAA standards (7:1 ratio)
- Color is never the only indicator of state

#### Interactive Elements

- Focus indicators for keyboard navigation
- Sufficient touch targets (44px minimum)
- Clear hover and active states
- Screen reader friendly labels

### Mobile-First Design

#### Responsive Strategy

1. **Mobile (320px+)**: Single column, stacked content
2. **Tablet (768px+)**: Two-column layouts, larger touch targets
3. **Desktop (1024px+)**: Multi-column layouts, hover effects
4. **Large (1280px+)**: Maximum content width, optimal line lengths

#### Mobile Optimizations

- Larger download buttons for touch
- Simplified navigation
- Compressed hero sections
- Touch-friendly carousel controls

## Implementation Notes

### CSS Architecture

- Use CSS custom properties for theming
- Utility-first approach with component classes
- Minimal specificity conflicts
- Progressive enhancement

### Asset Guidelines

- Basketball imagery should be high-quality and professional
- Screenshots must be current with latest app version
- Icons should be consistent stroke width and style
- Optimize all images for web (WebP with fallbacks)

### Brand Voice

- **Professional but approachable**: "Enhance your team's performance"
- **Action-oriented**: "Cut, organize, analyze, improve"
- **Basketball-focused**: Use relevant terminology naturally
- **Benefit-driven**: Focus on outcomes, not just features
