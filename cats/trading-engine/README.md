# Trading Engine — CATS

Python service responsible for:

- **Exchange connectivity** via [CCXT](https://github.com/ccxt/ccxt)
- **Signal collection** (price feeds, technical indicators)
- **Decision engine** (strategy execution, order management)
- **REST + WebSocket API** for the frontend

---

## Quick Start

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
cp config/config.example.yaml config/config.yaml
python -m src.main
```

API docs available at **http://localhost:8000/docs**

---

## Project Structure

```
trading-engine/
├── src/
│   ├── main.py            # Application entry point (FastAPI)
│   ├── exchange/
│   │   ├── connector.py   # CCXT-based exchange connector
│   │   └── models.py      # Pydantic models for exchange data
│   ├── signals/
│   │   ├── collector.py   # Price / order-book data collection
│   │   └── indicators.py  # Technical indicators (RSI, MACD, …)
│   ├── strategy/
│   │   └── decision_engine.py  # Strategy logic & order execution
│   └── utils/
│       └── logger.py      # Structured logging helper
├── tests/
├── config/
│   ├── config.example.yaml
│   └── config.yaml        # (gitignored — copy from example)
├── Dockerfile
├── requirements.txt
└── requirements-dev.txt
```

---

## Running Tests

```bash
pytest tests/ -v --cov=src
```

---

## Configuration

All settings live in `config/config.yaml` (copied from `config.example.yaml`).  
Sensitive values (API keys) should be supplied via environment variables or the
root `.env` file — never committed to source control.
