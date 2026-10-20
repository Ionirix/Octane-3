import { createServer as createHttpServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = path.dirname(fileURLToPath(import.meta.url));
const page = await readFile(path.join(directory, 'public', 'index.html'));
const sampleData = await readFile(path.join(directory, '..', 'Data', 'sample-events.json'));

function send(response, status, contentType, body, method) {
  response.writeHead(status, {
    'content-type': contentType,
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
  });
  response.end(method === 'HEAD' ? undefined : body);
}

async function handle(request, response) {
  try {
    const url = new URL(request.url ?? '/', 'http://localhost');
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      send(response, 405, 'application/json; charset=utf-8', '{"error":"Method not allowed"}', request.method);
      return;
    }
    if (url.pathname === '/api/public-endpoint') {
      send(response, 200, 'application/json; charset=utf-8', sampleData, request.method);
      return;
    }
    if (url.pathname === '/') {
      send(response, 200, 'text/html; charset=utf-8', page, request.method);
      return;
    }
    send(response, 404, 'application/json; charset=utf-8', '{"error":"Not found"}', request.method);
  } catch (error) {
    console.error('Request failed:', error);
    if (!response.headersSent) {
      send(response, 500, 'application/json; charset=utf-8', '{"error":"Internal error"}', request.method);
    } else {
      response.destroy(error);
    }
  }
}

export function createServer() {
  return createHttpServer((request, response) => {
    void handle(request, response);
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = createServer();
  server.listen(8787, '127.0.0.1', () => {
    console.log('Public demo available at http://127.0.0.1:8787');
  });
}
