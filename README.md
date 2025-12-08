# Ben Barnes - Personal Website

A photo portfolio and personal website built with [Astro](https://astro.build).

## Development

```bash
npm install
npm run dev    # http://localhost:4321
npm run build  # Production build
```

## Deployment

Push to `master` triggers AWS Amplify deployment.

## Project Structure

```
src/
├── content/
│   ├── projects/     # Markdown files for projects
│   └── notepad/      # Markdown files for blog posts
├── data/
│   └── albums.ts     # Photo album definitions
├── layouts/
│   └── Layout.astro  # Main layout with nav
└── pages/
    ├── index.astro   # Homepage
    ├── photos/       # Photo gallery
    ├── projects/     # Projects section
    └── notepad/      # Blog/notepad section
```

## Image Infrastructure

- **S3 Bucket**: `benjaminbarnes.co/photos/`
- **Image Handler**: `https://d35s6fmxia7g6v.cloudfront.net`
- **CloudFront Distribution ID**: `E1CR178U2NK86M`

See `CLAUDE.md` for detailed instructions on adding new photos.
