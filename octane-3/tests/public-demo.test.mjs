import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from '../server.mjs';

let server;
let baseUrl;

before(async () => {
  server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test('serves the demo page', async () => {
  const response = await fetch(baseUrl);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /text\/html/);
  assert.match(await response.text(), /Octane 3 Public Demo/);
});

test('serves fictional records from the public example endpoint', async () => {
  const response = await fetch(`${baseUrl}/api/public-endpoint`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /application\/json/);
  const body = await response.json();
  assert.match(body.notice, /Fictional example data/);
  assert.equal(body.events.length, 2);
});

test('does not expose other paths or accept writes', async () => {
  assert.equal((await fetch(`${baseUrl}/missing`)).status, 404);
  assert.equal((await fetch(`${baseUrl}/api/public-endpoint`, { method: 'POST' })).status, 405);
});
