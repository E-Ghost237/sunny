// Assembles mock-server/db.json for json-server out of the per-domain files in
// mock-server/data/ (one file per extraction phase: products.json now, stores.json /
// articles.json / pages.json as later phases land). Re-run whenever an extraction
// script updates a data/ file.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';

const dataDir = join(import.meta.dirname, 'data');
const outFile = join(import.meta.dirname, 'db.json');

const db = {};
for (const file of readdirSync(dataDir)) {
  if (!file.endsWith('.json')) continue;
  const key = basename(file, '.json');
  db[key] = JSON.parse(readFileSync(join(dataDir, file), 'utf-8'));
}

writeFileSync(outFile, JSON.stringify(db, null, 2));
console.log(`Wrote ${outFile} with keys: ${Object.keys(db).join(', ')}`);
