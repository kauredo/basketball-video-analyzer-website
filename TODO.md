# Basketball Video Analyzer Website - TODO

## High Priority (for a professional launch)

### 1. Real App Screenshots
Replace the 5 empty placeholder files with actual Basketball Video Analyzer screenshots:

**Files to add:**
- `/public/images/screenshots/video-cutting-interface.jpg` - Screenshot of the main video cutting interface with timeline
- `/public/images/screenshots/project-organization.jpg` - Screenshot showing the hierarchical category organization
- `/public/images/screenshots/clip-library-browser.jpg` - Screenshot of the clip library with visual browser and filtering
- `/public/images/screenshots/category-management.jpg` - Screenshot of the category management interface
- `/public/images/screenshots/batch-export.jpg` - Screenshot showing export options and batch processing

**Recommended dimensions:** 800x600px minimum, high quality JPG or PNG format

### 2. OG Image for Social Sharing
Add a social media preview image for when the website is shared:

**File to add:**
- `/public/images/og-image.png` - Social sharing preview image (1200x630px recommended)

**Content suggestions:** Basketball Video Analyzer logo + tagline + basketball-themed background

### 3. User Testimonials
Add coach testimonials to the homepage to build credibility:

**Files that need modification:**
- `/src/pages/index.astro` - Add testimonials section with coach quotes

**Content needed:**
- 3-5 testimonials from coaches who use the software
- Coach names, titles, and team/organization names
- Optional: Coach headshot photos in `/public/images/testimonials/`

**Suggested testimonial format:**
```
"This software has revolutionized how we analyze game footage..."
- Coach Name, Head Coach at [Team/School Name]
```

### 4. Video Demo
Add an embedded video demonstration of the app in action:

**Files that need modification:**
- `/src/pages/index.astro` - Add video demo section (likely after hero section)
- `/src/pages/features.astro` - Consider adding video demos for specific features

**Content needed:**
- Demo video file uploaded to YouTube/Vimeo/other hosting service
- Video should show key features: importing video, cutting clips, organizing categories, exporting

**Implementation options:**
- YouTube embed (recommended for bandwidth)
- Self-hosted video file in `/public/videos/demo.mp4`
- Interactive video player component

## Implementation Notes

### For Screenshots:
- Capture screenshots at 2x resolution for crisp display on retina screens
- Show realistic basketball footage (not copyrighted content)
- Include UI elements that highlight key features
- Consistent color scheme and branding

### For OG Image:
- Include the basketball icon from the site
- Use the same color palette (primary oranges/browns)
- Include the tagline: "Professional video analysis tool for basketball coaches"
- Make text readable at small sizes

### For Testimonials:
- Get permission from coaches before using their quotes
- Mix different levels (high school, college, professional if possible)
- Focus on specific benefits the software provides
- Include diversity in coaching backgrounds

### For Video Demo:
- Keep video under 2-3 minutes for engagement
- Show the complete workflow: import → cut → organize → export
- Include narration explaining each step
- End with clear call-to-action to download

## Current Status
- ✅ Website structure complete
- ✅ All pages functional
- ✅ Donation links working
- ✅ SEO optimized
- ✅ Analytics ready
- ⏳ Needs visual content (screenshots, images, video)
- ⏳ Needs social proof (testimonials)

## Optional Enhancements (Nice to Have)
- Blog/News section for updates
- Changelog page showing version history
- Community showcase featuring teams using the software
- Live GitHub stats integration
- API documentation (if applicable)