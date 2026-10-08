// DeLight dev API: JSON collections stored in mock-server/data/*.json, plus the
// order / payment-proof workflow and image uploads. No dependencies.
//
// Every request reads the data files from disk, so edits made in the back-office
// (or by hand in the data folder) show up immediately without restarting anything.
//
// NOTE: this is a development stand-in for a real backend. It has no authentication;
// the back-office sign-in is a client-side gate only. Replace before going live.
import http from 'node:http';
import { readFile, writeFile, rename, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = join(root, 'mock-server', 'data');
const uploadRoot = join(root, 'public', 'assets', 'img', 'uploads');
const PORT = Number(process.env.PORT ?? 3001);
const MAX_BODY = 12 * 1024 * 1024;

const COLLECTIONS = new Set([
  'products', 'stores', 'brands', 'articles', 'pages', 'core-pages',
  'category-filters', 'payment-methods', 'orders',
]);

const ORDER_STATUSES = [
  'awaiting-payment', 'proof-submitted', 'proof-rejected', 'approved', 'dispatched', 'completed', 'cancelled',
];

// Admin transitions. Customers upload proof through /orders/:id/proof instead.
const TRANSITIONS = {
  'proof-submitted': ['approved', 'proof-rejected', 'cancelled'],
  'proof-rejected': ['cancelled'],
  'awaiting-payment': ['cancelled'],
  approved: ['dispatched', 'cancelled'],
  dispatched: ['completed'],
};

const UPLOAD_FOLDERS = new Set(['products', 'stores', 'proofs']);
const IMAGE_TYPES = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif' };
const PROOF_TYPES = { ...IMAGE_TYPES, 'application/pdf': 'pdf' };

// ---------- storage helpers ----------

let writeQueue = Promise.resolve();
function withWriteLock(fn) {
  const run = writeQueue.then(fn, fn);
  writeQueue = run.catch(() => {});
  return run;
}

async function readCollection(name) {
  const file = join(dataDir, `${name}.json`);
  if (!existsSync(file)) return [];
  return JSON.parse(await readFile(file, 'utf8'));
}

function writeCollection(name, items) {
  return withWriteLock(async () => {
    const file = join(dataDir, `${name}.json`);
    const tmp = `${file}.tmp`;
    await writeFile(tmp, JSON.stringify(items, null, 2) + '\n', 'utf8');
    await rename(tmp, file);
  });
}

function nextNumericId(items) {
  const max = items.reduce((m, i) => {
    const n = Number(i.id);
    return Number.isFinite(n) && n > m ? n : m;
  }, 0);
  return max + 1;
}

function newOrderId(existing) {
  for (;;) {
    const id = `DL-${Math.floor(10000 + Math.random() * 90000)}`;
    if (!existing.some((o) => o.id === id)) return id;
  }
}

// ---------- HTTP helpers ----------

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(body === undefined ? '' : JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY) {
        reject(new HttpError(413, 'Upload is too large (12 MB limit).'));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => {
      if (!chunks.length) return resolve({});
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch {
        reject(new HttpError(400, 'Request body must be JSON.'));
      }
    });
    req.on('error', reject);
  });
}

// ---------- collection routes ----------

async function handleCollection(req, res, name, id, url) {
  if (!COLLECTIONS.has(name)) throw new HttpError(404, `Unknown collection "${name}".`);
  const items = await readCollection(name);

  if (req.method === 'GET') {
    if (id) {
      const found = items.find((i) => String(i.id) === id);
      if (!found) throw new HttpError(404, 'Not found.');
      return send(res, 200, found);
    }
    const filtered = items.filter((item) =>
      [...url.searchParams.entries()]
        .filter(([k]) => !k.startsWith('_'))
        .every(([k, v]) => String(item[k] ?? '') === v),
    );
    return send(res, 200, filtered);
  }

  const body = await readBody(req);

  if (req.method === 'POST' && !id) {
    let record;
    if (name === 'orders') {
      const now = new Date().toISOString();
      record = {
        id: newOrderId(items),
        ...body,
        status: 'awaiting-payment',
        proof: null,
        tracking: null,
        rejectionNote: null,
        placedAt: now,
        history: [{ status: 'awaiting-payment', at: now, note: 'Order placed. Awaiting payment proof.' }],
      };
    } else {
      // Payment methods are keyed by a readable id chosen by the back-office.
      if (name === 'payment-methods') {
        const pid = String(body.id ?? '').trim();
        if (!pid) throw new HttpError(400, 'A payment method needs an id.');
        if (items.some((i) => String(i.id) === pid)) throw new HttpError(409, 'A payment method with that id already exists.');
        record = { ...body, id: pid };
      } else {
        record = { ...body, id: nextNumericId(items) };
      }
    }
    await writeCollection(name, [...items, record]);
    return send(res, 201, record);
  }

  if (!id) throw new HttpError(405, 'Method not allowed.');
  const index = items.findIndex((i) => String(i.id) === id);
  if (index === -1) throw new HttpError(404, 'Not found.');

  if (req.method === 'DELETE') {
    const next = items.filter((_, i) => i !== index);
    await writeCollection(name, next);
    return send(res, 204);
  }
  if (req.method === 'PUT' || req.method === 'PATCH') {
    const updated = { ...items[index], ...body, id: items[index].id };
    const next = [...items];
    next[index] = updated;
    await writeCollection(name, next);
    return send(res, 200, updated);
  }
  throw new HttpError(405, 'Method not allowed.');
}

// ---------- order workflow ----------

async function handleOrderAction(req, res, id, action) {
  const orders = await readCollection('orders');
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) throw new HttpError(404, 'Order not found.');
  const order = orders[index];
  const now = new Date().toISOString();

  if (action === 'proof' && req.method === 'POST') {
    if (!['awaiting-payment', 'proof-rejected'].includes(order.status)) {
      throw new HttpError(409, `Proof cannot be uploaded while the order is "${order.status}".`);
    }
    const body = await readBody(req);
    const saved = await saveUpload('proofs', `proof-${id}`, body.fileName, body.dataUrl, PROOF_TYPES);
    const updated = {
      ...order,
      status: 'proof-submitted',
      proof: { path: saved.path, fileName: saved.fileName, uploadedAt: now },
      rejectionNote: null,
      history: [...order.history, { status: 'proof-submitted', at: now, note: 'Payment proof uploaded.' }],
    };
    orders[index] = updated;
    await writeCollection('orders', orders);
    return send(res, 200, updated);
  }

  if (action === 'transition' && req.method === 'POST') {
    const body = await readBody(req);
    const allowed = TRANSITIONS[order.status] ?? [];
    if (!ORDER_STATUSES.includes(body.to) || !allowed.includes(body.to)) {
      throw new HttpError(409, `Cannot move an order from "${order.status}" to "${body.to}".`);
    }
    if (body.to === 'proof-rejected' && !body.note?.trim()) {
      throw new HttpError(400, 'Give the customer a reason for rejecting the proof.');
    }
    const note = (body.note ?? '').trim() || defaultNote(body.to);
    const updated = {
      ...order,
      status: body.to,
      rejectionNote: body.to === 'proof-rejected' ? note : order.rejectionNote,
      tracking: body.to === 'dispatched' ? (body.tracking ?? '').trim() || order.tracking : order.tracking,
      history: [...order.history, { status: body.to, at: now, note }],
    };
    orders[index] = updated;
    await writeCollection('orders', orders);
    return send(res, 200, updated);
  }

  throw new HttpError(404, 'Unknown order action.');
}

function defaultNote(status) {
  return {
    approved: 'Payment confirmed by our team.',
    'proof-rejected': 'Payment proof rejected.',
    dispatched: 'Order dispatched.',
    completed: 'Order completed.',
    cancelled: 'Order cancelled.',
  }[status] ?? status;
}

// ---------- uploads ----------

async function saveUpload(folder, baseName, fileName, dataUrl, allowed) {
  const match = /^data:([a-z/+-]+);base64,([A-Za-z0-9+/=\s]+)$/.exec(dataUrl ?? '');
  if (!match) throw new HttpError(400, 'Upload must be a base64 data URL.');
  const ext = allowed[match[1]];
  if (!ext) throw new HttpError(415, `File type ${match[1]} is not allowed here.`);
  const safeBase = String(baseName).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'file';
  const name = `${safeBase}-${randomBytes(3).toString('hex')}.${ext}`;
  const dir = join(uploadRoot, folder);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, name), Buffer.from(match[2].replace(/\s/g, ''), 'base64'));
  return { path: `/assets/img/uploads/${folder}/${name}`, fileName: String(fileName ?? name).slice(0, 200) };
}

async function handleUpload(req, res) {
  if (req.method !== 'POST') throw new HttpError(405, 'Method not allowed.');
  const body = await readBody(req);
  if (!UPLOAD_FOLDERS.has(body.folder)) throw new HttpError(400, 'Unknown upload folder.');
  const allowed = body.folder === 'proofs' ? PROOF_TYPES : IMAGE_TYPES;
  const saved = await saveUpload(body.folder, body.name ?? 'upload', body.fileName, body.dataUrl, allowed);
  return send(res, 201, saved);
}

// ---------- server ----------

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', 'http://localhost');
    const parts = url.pathname.split('/').filter(Boolean).map(decodeURIComponent);
    // The dev proxy strips the /api prefix; accept requests with or without it.
    if (parts[0] === 'api') parts.shift();
    const [resource, id, action] = parts;

    if (!resource) return send(res, 200, { name: 'DeLight dev API', collections: [...COLLECTIONS] });
    if (resource === 'uploads') return await handleUpload(req, res);
    if (resource === 'orders' && id && action) return await handleOrderAction(req, res, id, action);
    return await handleCollection(req, res, resource, id, url);
  } catch (err) {
    if (err instanceof HttpError) return send(res, err.status, { error: err.message });
    console.error(err);
    return send(res, 500, { error: 'Something went wrong on the server.' });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`DeLight dev API listening on http://0.0.0.0:${PORT} (data: mock-server/data)`);
});

