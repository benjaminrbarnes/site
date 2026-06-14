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

## Structure

The site is photography-first: the homepage **is** the gallery, with a couple
of personal sections demoted to footnotes (footer + the hidden About page).

| Route | Page |
|---|---|
| `/` | Photo gallery — visible albums from `albums.ts` |
| `/album/[slug]` | Album viewer (masonry + keyboard lightbox) |
| `/contact` | Contact |
| `/running` | Races (parsed from `fitness.md`) — footer only |
| `/sauna` | Sauna photo dump — footer only |
| `/sauna/costs` | Itemized cost table |
| `/about` | Built but **unlinked** (not in nav/footer yet) |

Nav is **Photos · Contact**. Old routes (`/gallery/*`, `/projects/*`, `/notepad/*`,
`/writing`, `/openclaw`, `/thoughts/*`) redirect via `astro.config.mjs`.

```
src/
├── components/
│   └── Lightbox.astro   # Shared lightbox (the only client JS)
├── content/
│   └── projects/        # fitness.md (running), thoughts/sauna*, costs.md
├── data/
│   └── albums.ts        # Photo album definitions (source of truth)
├── layouts/
│   └── Layout.astro     # Header + footer + design tokens (global CSS)
└── pages/
    ├── index.astro      # Gallery homepage
    ├── album/[slug].astro
    ├── contact.astro
    ├── running.astro
    ├── sauna/{index,costs}.astro
    └── about.astro      # unlinked
```

## Image Infrastructure

- **S3 Bucket**: `benjaminbarnes.co/photos/`
- **Image Handler**: `https://d35s6fmxia7g6v.cloudfront.net`
- **CloudFront Distribution ID**: `E1CR178U2NK86M`

See `CLAUDE.md` for detailed instructions on adding new photos.

---

_Test update - 2026-02-06_
