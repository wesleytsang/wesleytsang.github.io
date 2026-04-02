# Frontend — CATS

AngularJS single-page application providing the CATS trading dashboard.

Uses **AG Grid Community** for high-performance data tables.

---

## Quick Start

```bash
npm install
npm start        # http://localhost:4200
```

### Production build

```bash
npm run build
# Artefacts written to dist/
```

---

## Project Structure

```
frontend/
├── src/
│   ├── index.html                        # App shell
│   └── app/
│       ├── app.module.js                 # Root AngularJS module
│       ├── app.config.js                 # $http, interceptors
│       ├── app.routes.js                 # ngRoute route definitions
│       ├── components/
│       │   ├── dashboard/                # Overview / KPI tiles
│       │   ├── trades/                   # AG Grid trades table
│       │   └── signals/                  # AG Grid signals table
│       ├── services/
│       │   ├── trade.service.js          # Trade REST calls
│       │   ├── signal.service.js         # Signal REST calls
│       │   └── websocket.service.js      # Live WebSocket feed
│       └── shared/
│           └── ag-grid-config.js         # Shared AG Grid defaults
├── Dockerfile
├── nginx.conf
└── package.json
```

---

## Environment

The API base URL is configured via the `API_BASE_URL` variable in the root
`.env` file (injected at Docker build time via nginx).  
For local development, edit `src/app/app.config.js` directly or set the variable
in `package.json`'s proxy configuration.
