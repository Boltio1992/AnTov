import fs from 'fs';
import path from 'path';

const C = path.join(process.cwd(), 'content');

export function getUniverses() {
  return JSON.parse(fs.readFileSync(path.join(C, 'universes.json'), 'utf8'));
}

export function getSeriesAll() {
  const dir = path.join(C, 'series');
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
}

export function getSeries(id) {
  return getSeriesAll().find(s => s.id === id) || null;
}
