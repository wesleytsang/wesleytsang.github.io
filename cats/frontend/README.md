# Frontend — CATS

Angular 19 single-page application providing the CATS trading dashboard.

Uses **AG Grid Community 33** for high-performance data tables.

> **Note on framework choice:** The original AngularJS 1.x dependency was replaced with
> **Angular 19** because AngularJS reached end-of-life in December 2021 and all versions
> ≥ 1.3.0 carry an unpatched ReDoS vulnerability (no fix available).

---

## Quick Start

```bash
npm install
npm start        # http://localhost:4200
```

### Production build

```bash
npm run build
# Artefacts written to dist/cats-frontend/browser/
```

---

## Project Structure

```
frontend/
├── src/
│   ├── main.ts                           # Angular bootstrap
│   ├── styles.css                        # Global styles
│   ├── index.html                        # App shell
│   └── app/
│       ├── app.module.ts                 # Root NgModule
│       ├── app-routing.module.ts         # Angular Router routes
│       ├── app.component.ts/html         # Root shell component
│       ├── components/
│       │   ├── dashboard/                # KPI tiles + signal summary
│       │   ├── trades/                   # AG Grid trades table
│       │   └── signals/                  # AG Grid signals table
│       └── services/
│           ├── trade.service.ts          # Trade REST calls (HttpClient)
│           ├── signal.service.ts         # Signal REST calls (HttpClient)
│           └── websocket.service.ts      # Live WebSocket feed (RxJS)
├── angular.json                          # Angular CLI workspace config
├── proxy.conf.json                       # Dev-server API proxy (/api → :8000)
├── tsconfig.json / tsconfig.app.json
├── Dockerfile
├── nginx.conf
└── package.json
```

---

## Environment

The API base URL is proxied through nginx in production (`/api/` → trading engine).  
For local development, `proxy.conf.json` forwards `/api/*` to `http://localhost:8000`.

