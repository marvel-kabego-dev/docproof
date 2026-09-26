'use strict';

const assert = require('node:assert/strict');
const test   = require('node:test');
const http   = require('node:http');
const app    = require('./app');

let server;
let base;

test.before(async () => {
  server = http.createServer(app);

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });

  const { port } = server.address();
  base = `http://127.0.0.1:${port}`;
});

test.after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close(err => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
});

async function req(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  return new Promise((resolve, reject) => {
    const r = http.request(base + path, opts, res => {
      let data = '';
      res.on('data', c => (data += c));
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    r.on('error', reject);
    if (body) r.write(JSON.stringify(body));
    r.end();
  });
}

test('GET /health -> 200', async () => {
  const r = await req('GET', '/health');
  assert.equal(r.status, 200);
});

test('GET /widgets -> 200', async () => {
  const r = await req('GET', '/widgets');
  assert.equal(r.status, 200);
});

test('POST /widgets -> 201', async () => {
  const r = await req('POST', '/widgets', { name: 'Test Widget' });
  assert.equal(r.status, 201);
});

test('GET /widgets/123 -> 200 (seeded widget)', async () => {
  const r = await req('GET', '/widgets/123');
  assert.equal(r.status, 200);
});

test('POST /widgets/create -> 404 (stale doc route)', async () => {
  const r = await req('POST', '/widgets/create');
  assert.equal(r.status, 404);
});

test('DELETE /widgets/123 -> 404 (stale doc route)', async () => {
  const r = await req('DELETE', '/widgets/123');
  assert.equal(r.status, 404);
});
