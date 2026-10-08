// The Angular dev server snapshots public/ when it starts, so images generated
// while it runs return 404. This watcher touches src/main.ts whenever public/
// changes, which makes the dev server rebuild and re-index the assets.
import { watch, utimesSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const publicDir = join(root, 'public');
const trigger = join(root, 'src', 'main.ts');
let timer = null;

watch(publicDir, { recursive: true }, () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    const now = new Date();
    utimesSync(trigger, now, now);
    console.log(`[watch-public] public/ changed, refreshing dev server (${now.toISOString()})`);
  }, 500);
});
console.log('[watch-public] watching public/ for new or changed assets');
