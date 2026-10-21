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
of personal sections accessible through the ETC dropdown.

| Route | Page |
|---|---|
| `/` | Photo gallery — visible albums from `albums.ts` |
| `/album/[slug]` | Album viewer (masonry + keyboard lightbox) |
| `/contact` | Contact |
| `/running` | Races (parsed from `fitness.md`) |
| `/tennis` | Live match history from the versioned S3 JSON |
| `/home-gym` | Home gym build photos, grouped by capture month |
| `/sauna` | Sauna build photos, grouped by capture month |
| `/sauna/costs` | Itemized cost table |

Nav is **Photos · ETC · Contact**. ETC includes Running, Sauna, Home Gym, and Tennis.
Old routes (`/gallery/*`, `/projects/*`, `/notepad/*`,
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
```

## Image Infrastructure

- **S3 Bucket**: `benjaminbarnes.co/photos/`
- **Image Handler**: `https://d35s6fmxia7g6v.cloudfront.net`
- **CloudFront Distribution ID**: `E1CR178U2NK86M`

See `CLAUDE.md` for detailed instructions on adding new photos.

Project galleries use `ProjectGallery.astro` with ordered capture-date manifests
in `src/data/home-gym-photos.json` and `src/data/sauna-photos.json`. Images stay in
S3 at full exported resolution; AWS generates 800px gallery/1600px lightbox views.
Do not group by upload date or add undated photos to a guessed month. Grouping and
chronology tests: `node --test tests/projectGallery.test.mjs`.

Ordinary AWS work uses the isolated website-maintainer identity, not root. See
`docs/website-aws-access.md` for setup and recovery boundaries.

---

_Test update - 2026-02-06_
