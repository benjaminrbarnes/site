// One-time (re-runnable) generator: probes every gallery image at a tiny size,
// reads its aspect ratio (width/height), and writes src/data/aspectRatios.json.
// Pages use these ratios to reserve each photo's space before it loads, which
// eliminates layout shift in the masonry. Re-run after adding albums:
//   node scripts/gen-aspect-ratios.mjs
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';
import { albums, getImageUrls } from '../src/data/albums.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '../src/data/aspectRatios.json');
const PROBE_WIDTH = 32;          // tiny — preserves aspect ratio, ~10KB each
const CONCURRENCY = 24;
const FALLBACK = 1.5;            // 3:2 landscape, used if a probe fails

const IMAGE_HANDLER = 'https://d35s6fmxia7g6v.cloudfront.net';
const probeUrl = (full) => full.replace(/\/fit-in\/\d+x0\//, `/fit-in/${PROBE_WIDTH}x0/`);

// Sauna build photo dump (folder 2025/sauna, image 12 skipped) — mirrors sauna page.
const saunaNums = [...Array.from({ length: 11 }, (_, i) => i + 1), ...Array.from({ length: 82 }, (_, i) => i + 13)];
const saunaUrls = saunaNums.map(
  (n) => `${IMAGE_HANDLER}/fit-in/${PROBE_WIDTH}x0/filters:quality(90)/photos/2025/sauna/${n}.jpg`
);

// Build the flat task list: { key, index, url }
const tasks = [];
for (const album of albums) {
  getImageUrls(album, 800).forEach((full, index) => {
    tasks.push({ key: album.slug, index, url: probeUrl(full) });
  });
}
saunaUrls.forEach((url, index) => tasks.push({ key: '__sauna', index, url }));

console.log(`Probing ${tasks.length} images at ${PROBE_WIDTH}px (concurrency ${CONCURRENCY})...`);

const result = {};
let done = 0, failed = 0;

async function ratioOf(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const { width, height } = await sharp(buf).metadata();
  if (!width || !height) throw new Error('no dimensions');
  return +(width / height).toFixed(4);
}

async function worker(queue) {
  for (const task of queue) {
    (result[task.key] ??= [])[task.index] = await ratioOf(task.url).catch(() => {
      failed++;
      console.warn(`  ! ${task.key}[${task.index}] ${task.url} — using fallback`);
      return FALLBACK;
    });
    if (++done % 100 === 0) console.log(`  ${done}/${tasks.length}`);
  }
}

// Round-robin tasks into CONCURRENCY queues, run all queues in parallel.
const queues = Array.from({ length: CONCURRENCY }, () => []);
tasks.forEach((t, i) => queues[i % CONCURRENCY].push(t));
await Promise.all(queues.map(worker));

writeFileSync(OUT, JSON.stringify(result) + '\n');
console.log(`\nWrote ${OUT} (${Object.keys(result).length} albums, ${tasks.length} images, ${failed} fallbacks)`);
