import type { ReleaseInfo } from "@/types/github";

export const fallbackReleaseData: ReleaseInfo = {
  version: "v1.0.0",
  releaseDate: new Date("2024-12-20"),
  releaseNotes: `# Basketball Video Analyzer v1.0.0

## 🎉 Initial Release

Professional video analysis tool for basketball coaches to cut, organize, and export game footage.

### ✨ Key Features
- **Time Search**: Jump to specific times using HH:MM:SS format
- **Multiple Presets**: Create and manage category templates
- **Project Organization**: Separate projects for different games
- **Hierarchical Categories**: Parent-child categories with unlimited depth
- **Advanced Video Cutting**: Frame-by-frame navigation with keyboard shortcuts
- **Export System**: Organized clip libraries with folder structure
- **Multi-Language**: English and Portuguese support
- **Cross-Platform**: Windows, macOS, and Linux support

### 🏀 Perfect for
- Basketball coaches and video analysts
- Educational institutions with basketball programs
- Individual coaches and player development
- Team scouting and game analysis

### 🛠️ Technical
- Built with Electron, React, and TypeScript
- SQLite database for high performance
- FFmpeg integration for video processing
- Modern, intuitive user interface`,
  platforms: [
    {
      platform: "windows",
      architecture: "x64",
      fileType: "exe",
      url: "https://github.com/kauredo/basketball-video-analyzer/releases/latest/download/basketball-video-analyzer-setup.exe",
      size: 85000000, // ~85MB
      filename: "basketball-video-analyzer-setup.exe",
    },
    {
      platform: "macos",
      architecture: "x64",
      fileType: "dmg",
      url: "https://github.com/kauredo/basketball-video-analyzer/releases/latest/download/basketball-video-analyzer.dmg",
      size: 95000000, // ~95MB
      filename: "basketball-video-analyzer.dmg",
    },
    {
      platform: "linux",
      architecture: "x64",
      fileType: "deb",
      url: "https://github.com/kauredo/basketball-video-analyzer/releases/latest/download/basketball-video-analyzer.deb",
      size: 80000000, // ~80MB
      filename: "basketball-video-analyzer.deb",
    },
  ],
  isPrerelease: false,
  downloadCount: 1250,
};
