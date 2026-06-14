import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://benjaminbarnes.me',
  output: 'static',
  // Redirect retired/old routes to their new homes (OpenClaw and the old
  // writing-led structure are gone; photos now live at /album/[slug]).
  // Old per-album URLs (/gallery/<slug>) are handled by a redirect shim page.
  redirects: {
    '/writing': '/',
    '/openclaw': '/',
    '/thoughts': '/',
    '/thoughts/openclaw': '/',
    '/gallery': '/',
    '/projects': '/',
    '/projects/fitness': '/running',
    '/projects/thoughts': '/',
    '/projects/thoughts/openclaw-strava': '/',
    '/projects/thoughts/sauna': '/sauna',
    '/projects/thoughts/sauna/costs': '/sauna/costs',
    '/notepad': '/',
    '/notepad/hello-world': '/',
  },
});
