# Claude Reference: Ben Barnes Portfolio Site

## Project Overview
Personal photography portfolio website built with Astro. Static site showcasing photo galleries organized by time periods/events.

## Tech Stack
- **Framework**: Astro 4.x
- **Build**: Static site generation
- **Styling**: Bootstrap 4.3.1 (CDN)
- **Images**: AWS CloudFront CDN (`d3dsxdu5t5tqsc.cloudfront.net`)
- **Deployment**: AWS Amplify (auto-deploy on push to master)

## Directory Structure
```
src/
├── data/
│   └── albums.ts         # Album data: titles, images, thumbnails, visibility
├── layouts/
│   └── Layout.astro      # Main layout with nav header
└── pages/
    ├── index.astro       # Gallery home (shows visible albums)
    ├── contact.astro     # Contact info page
    ├── notepad.astro     # Link to Notion
    └── photos/
        └── [album].astro # Dynamic route for all photo albums
public/
├── manifest.json         # PWA manifest
└── robots.txt
```

## Key Files
| File | Purpose |
|------|---------|
| `src/data/albums.ts` | All album metadata and image lists |
| `src/pages/photos/[album].astro` | Dynamic photo album template |
| `src/pages/index.astro` | Gallery grid showing visible albums |
| `astro.config.mjs` | Astro configuration |

## Commands
```bash
npm install     # Install dependencies
npm run dev     # Dev server at localhost:4321
npm run build   # Production build to ./dist
npm run preview # Preview production build
```

## Adding New Photo Albums

Edit `src/data/albums.ts`:

```typescript
{
  slug: 'p26',                    // URL: /photos/p26
  title: 'Month Year',
  description: 'Event description',
  thumbnail: `${CDN_BASE}/folder/md/imgN.jpg`,
  folder: 'folder-name',          // S3 folder path
  images: range(1, 37),           // Or explicit array for gaps
  ext: 'jpg',                     // or 'JPG'
  visible: true,                  // Show in gallery
}
```

## Image URL Pattern
```
https://d3dsxdu5t5tqsc.cloudfront.net/photos/[folder]/md/img[N].[ext]
```

## Uploading Photos to S3
Photos are stored in the `benjaminbarnes.co` S3 bucket, partitioned by year:
```
s3://benjaminbarnes.co/photos/[YEAR]/[folder]/
```
- **2025**: `s3://benjaminbarnes.co/photos/2025/[folder]/`
- **2026+**: Update the year in the path accordingly

**Upload command** (parallel sync):
```bash
aws s3 sync . s3://benjaminbarnes.co/photos/2025/[folder]/ --exclude "*" --include "*.jpg"
```

**IMPORTANT - Strip GPS data before uploading** (iPhone photos contain location):
```bash
exiftool -gps:all= -overwrite_original *.jpg
```

## Album Visibility
- `visible: true` - Shows in gallery grid
- `visible: false` - Hidden from gallery but still accessible via direct URL
- Currently hidden: p20-p25 (2023 albums)

## Amplify Build Settings
- Build command: `npm run build`
- Output directory: `dist`
- Node version: 18+
