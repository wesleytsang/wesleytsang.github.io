"""Application entry point.

Run with:
    uvicorn src.main:app --reload
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI

from src.exchange.connector import ExchangeConnector
from src.signals.collector import SignalCollector
from src.strategy.decision_engine import DecisionEngine
from src.utils.logger import get_logger

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown lifecycle."""
    logger.info("Starting CATS trading engine …")
    connector = ExchangeConnector()
    collector = SignalCollector(connector)
    engine = DecisionEngine(connector, collector)

    app.state.connector = connector
    app.state.collector = collector
    app.state.engine = engine

    await engine.start()
    yield

    logger.info("Shutting down CATS trading engine …")
    await engine.stop()


app = FastAPI(
    title="CATS — Crypto Automated Trading System",
    description="REST + WebSocket API for the CATS trading engine.",
    version="0.1.0",
    lifespan=lifespan,
)


@app.get("/health", tags=["ops"])
async def health() -> dict:
    """Liveness probe used by Docker and load balancers."""
    return {"status": "ok"}


@app.get("/trades", tags=["trading"])
async def list_trades() -> list:
    """Return all open and recently closed trades."""
    engine: DecisionEngine = app.state.engine
    return engine.get_trades()


@app.get("/signals", tags=["signals"])
async def list_signals() -> list:
    """Return the latest computed signals for all watched symbols."""
    collector: SignalCollector = app.state.collector
    return collector.get_latest_signals()
