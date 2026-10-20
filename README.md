# Octane 3 Public Demo

This standalone copy is a local-only sample application. It uses fictional mock
data and does not contact external services.

## Run

Requirements: Node.js 18 or newer.

```powershell
cd octane-3
npm test
npm start
```

Open `http://127.0.0.1:8787`. The example API is available at
`/api/public-endpoint`. No API keys, environment variables, or dependency
installation are required.

## Project layout

- `Data/` contains fictional sample records.
- `octane-3/` contains the local demo server, page, documentation, and tests.
- Empty module folders are retained as extension points for public examples.

This demo is not a live monitoring service and does not ingest live data.
