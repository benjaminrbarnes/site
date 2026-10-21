import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { groupProjectPhotos } from '../src/data/projectGallery.ts';

const data = name => JSON.parse(readFileSync(new URL(`../src/data/${name}`, import.meta.url), 'utf8'));
const gym = data('home-gym-photos.json');
const sauna = data('sauna-photos.json');
const photo = (file, date, extra = {}) => ({ file, date, width: 3000, height: 4000, ...extra });

test('Home Gym includes every exported photograph in the verified capture months', () => {
  assert.equal(gym.length, 132);
  assert.deepEqual(groupProjectPhotos(gym).map(s => [s.label, s.photos.length]), [
    ['September 2022', 2], ['July 2026', 30], ['August 2026', 68],
    ['September 2026', 24], ['October 2026', 8],
  ]);
});

test('Sauna preserves its exact 93-photo sequence and skipped file 12', () => {
  const expected = [...Array.from({length: 11}, (_, i) => `${i + 1}.jpg`),
    ...Array.from({length: 82}, (_, i) => `${i + 13}.jpg`)];
  assert.deepEqual(sauna.map(p => p.file), expected);
  assert.deepEqual(groupProjectPhotos(sauna).flatMap(s => s.photos.map(p => p.file)), expected);
});

test('Sauna month dividers use original capture metadata, not S3 upload dates', () => {
  assert.deepEqual(groupProjectPhotos(sauna).map(s => [s.label, s.photos.length]), [
    ['December 2024', 41], ['January 2025', 16], ['February 2025', 2],
    ['March 2025', 2], ['August 2025', 5], ['November 2025', 26], ['Finished sauna', 1],
  ]);
  assert.equal(sauna.at(-1).date, null);
});

test('Sauna proportions agree within one pixel of the existing tiny 32px CDN probes', () => {
  const ratios = data('aspectRatios.json').__sauna;
  sauna.forEach((p, i) => assert.ok(Math.abs(32 / (p.width / p.height) - 32 / ratios[i]) <= 1,
    `${p.file}: unexpected orientation or aspect ratio`));
});

test('Month grouping preserves same-day photograph order and local calendar month', () => {
  const photos = [photo('001.jpg', '2026-07-31'), photo('002.jpg', '2026-07-31'), photo('003.jpg', '2026-08-01')];
  assert.deepEqual(groupProjectPhotos(photos).map(s => [s.label, s.photos.map(p => p.file)]), [
    ['July 2026', ['001.jpg', '002.jpg']], ['August 2026', ['003.jpg']],
  ]);
});

test('Grouping rejects duplicate files, impossible dates, and incorrect chronology', () => {
  assert.throws(() => groupProjectPhotos([photo('1.jpg', '2026-07-01'), photo('1.jpg', '2026-08-01')]), /duplicate/);
  assert.throws(() => groupProjectPhotos([photo('1.jpg', '2026-02-30')]), /date/);
  assert.throws(() => groupProjectPhotos([photo('1.jpg', '2026-08-01'), photo('2.jpg', '2026-07-31')]), /oldest/);
  assert.throws(() => groupProjectPhotos([photo('1.jpg', null), photo('2.jpg', '2026-07-31')]), /oldest/);
});

test('Grouping rejects invalid dimensions and unsafe paths', () => {
  assert.throws(() => groupProjectPhotos([photo('../1.jpg', '2026-07-01')]), /Invalid/);
  assert.throws(() => groupProjectPhotos([photo('1.jpg', '2026-07-01', {width: 0})]), /dimensions/);
});
