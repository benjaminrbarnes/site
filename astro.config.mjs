import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://benjaminbarnes.me',
  output: 'static',
  build: {
    format: 'file',
  },
  trailingSlash: 'never',
});
