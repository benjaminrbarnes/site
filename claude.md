# Claude Reference: Ben Barnes Portfolio Site

## Project Overview
Personal photography portfolio website built with Astro. Static site showcasing photo galleries organized by time periods/events.

## Tech Stack
- **Framework**: Astro 5.x
- **Build**: Static site generation
- **Styling**: Hand-rolled CSS in `Layout.astro` (design tokens + EB Garamond, no framework)
- **Images**: AWS Serverless Image Handler (`d35s6fmxia7g6v.cloudfront.net`), `fit-in/{W}x0` resizing — 800px thumbnails, 1600px in the lightbox
- **Deployment**: AWS Amplify (auto-deploy on push to master)

## Information Architecture
Photography-first: the homepage **is** the gallery. Nav is **Photos · Contact**.
Running + Sauna are footnotes (footer + the hidden About page).

| Route | Page |
|---|---|
| `/` | Gallery — visible albums, file order (newest first) |
| `/album/[slug]` | Album viewer (masonry + keyboard lightbox) — all albums, incl. hidden |
| `/contact` | Contact |
| `/running` | Races — parsed from `fitness.md` |
| `/sauna` · `/sauna/costs` | Sauna photo dump + cost table |
| `/about` | Built but **unlinked** (not in nav/footer) |

Old routes (`/gallery/*`, `/projects/*`, `/notepad/*`, `/writing`, `/openclaw`,
`/thoughts/*`) redirect to their new homes via `redirects` in `astro.config.mjs`.

## Directory Structure
```
src/
├── components/
│   └── Lightbox.astro    # Shared lightbox: wires up every .masonry on the page
├── content/
│   └── projects/         # fitness.md, thoughts/sauna.md, thoughts/sauna/costs.md
├── data/
│   └── albums.ts         # Album data: titles, images, thumbnails, visibility
├── layouts/
│   └── Layout.astro      # Header + footer + design tokens (global CSS)
└── pages/
    ├── index.astro       # Gallery home
    ├── album/[slug].astro
    ├── gallery/[album].astro  # redirect shim -> /album/[slug]
    ├── contact.astro · running.astro · about.astro
    └── sauna/{index,costs}.astro
public/
├── manifest.json         # PWA manifest
└── robots.txt
```

## Key Files
| File | Purpose |
|------|---------|
| `src/data/albums.ts` | All album metadata and image lists (source of truth) |
| `src/pages/album/[slug].astro` | Dynamic photo album template |
| `src/pages/index.astro` | Gallery grid showing visible albums |
| `src/components/Lightbox.astro` | Keyboard/swipe lightbox, 800→1600 URL swap |
| `src/layouts/Layout.astro` | Global design tokens, header, footer |
| `astro.config.mjs` | Astro config + route redirects |

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
  slug: 'p26',                    // URL: /album/p26
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
https://d35s6fmxia7g6v.cloudfront.net/fit-in/800x0/filters:quality(90)/photos/[folder]/md/img[N].[ext]
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
