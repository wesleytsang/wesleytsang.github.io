# CATS — Crypto Automated Trading System

A monorepo containing all components of the CATS platform:

| Package | Description |
|---------|-------------|
| [`trading-engine`](./trading-engine) | Python service — exchange connectivity, signal collection, decision-making |
| [`frontend`](./frontend) | Angular 19 + AG Grid 33 dashboard for monitoring and controlling trades |

---

## Architecture Overview

```
┌────────────────────────────────────────────────────────────┐
│                        CATS Monorepo                       │
│                                                            │
│  ┌──────────────────────┐     ┌────────────────────────┐  │
│  │   Trading Engine     │     │       Frontend          │  │
│  │   (Python)           │◄────│   (Angular 19 + AG Grid) │  │
│  │                      │ WS/ │                         │  │
│  │  • Exchange Connector│ REST│  • Trade Dashboard      │  │
│  │  • Signal Collector  │     │  • Signal Monitor       │  │
│  │  • Decision Engine   │     │  • Controls Panel       │  │
│  └──────────┬───────────┘     └────────────────────────┘  │
│             │                                              │
│             ▼                                              │
│      ┌─────────────┐                                       │
│      │   Exchange  │  (e.g. Binance, Kraken, Coinbase)    │
│      └─────────────┘                                       │
└────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### Prerequisites

- Docker ≥ 24 and Docker Compose v2
- Python ≥ 3.11 (for local trading-engine development)
- Node.js ≥ 18 (for local frontend development)

### 1. Clone the repository

```bash
git clone https://github.com/<your-org>/cats.git
cd cats
```

### 2. Configure environment variables

```bash
cp .env.example .env
# Edit .env with your exchange API keys and settings
```

### 3. Run the full stack with Docker Compose

```bash
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:4200 |
| Trading Engine API | http://localhost:8000 |
| Trading Engine Docs | http://localhost:8000/docs |

### 4. Stop all services

```bash
docker compose down
```

---

## Local Development

### Trading Engine

```bash
cd trading-engine
python -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate
pip install -r requirements-dev.txt
cp config/config.example.yaml config/config.yaml
# Fill in config.yaml with your exchange credentials
python -m src.main
```

Run tests:

```bash
pytest tests/ -v
```

### Frontend

```bash
cd frontend
npm install
npm start              # Serves at http://localhost:4200
```

---

## Project Structure

```
cats/
├── trading-engine/        # Python trading engine
│   ├── src/
│   │   ├── exchange/      # Exchange connectors
│   │   ├── signals/       # Signal collectors & indicators
│   │   ├── strategy/      # Decision engine
│   │   └── utils/         # Logging, helpers
│   ├── tests/
│   ├── config/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/              # Angular 19 + AG Grid 33 dashboard
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/ # Dashboard, Trades, Signals views
│   │   │   ├── services/   # HTTP / WebSocket services
│   │   │   └── shared/     # AG Grid config, directives
│   │   └── index.html
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Contributing

1. Create a feature branch from `main`
2. Make your changes inside the relevant package directory
3. Ensure linters and tests pass for the affected package
4. Open a pull request targeting `main`

---

## License

MIT
