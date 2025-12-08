# Ben Barnes - Personal Website

A photo portfolio and personal website built with [Astro](https://astro.build).

## Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

The site is deployed via AWS Amplify. Pushing to `master` triggers an automatic deployment.

**Amplify build settings:**
- Build command: `npm run build`
- Output directory: `dist`

## Project Structure

```
src/
├── data/
│   └── albums.ts      # Photo album data (titles, images, thumbnails)
├── layouts/
│   └── Layout.astro   # Main layout with nav
└── pages/
    ├── index.astro    # Gallery home page
    ├── contact.astro  # Contact info
    ├── notepad.astro  # Link to Notion
    └── photos/
        └── [album].astro  # Dynamic photo album pages
```

## Adding New Photo Albums

1. Upload photos to S3 bucket (`benjaminbares.co/photos/[folder-name]/md/`)
2. Make photos public
3. Edit `src/data/albums.ts`:
   - Add new album object with `slug`, `title`, `description`, `thumbnail`, `folder`, `images`, `ext`
   - Set `visible: true` to show in gallery
4. Commit and push - Amplify will auto-deploy

## Photo Preparation

1. Download photos from source
2. Rotate and color correct as needed
3. Rename with sequential numbering: `img1.jpg`, `img2.jpg`, etc.
4. Create `md` folder with web-optimized versions (30 DPI)
5. Upload to S3 and make public
