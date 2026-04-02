"""Signal collector — fetches market data and computes indicators."""
import asyncio
import os
from datetime import datetime, timezone
from typing import Any

import pandas as pd

from src.exchange.connector import ExchangeConnector
from src.signals.indicators import compute_indicators
from src.utils.logger import get_logger

logger = get_logger(__name__)

_DEFAULT_SYMBOLS = ["BTC/USDT", "ETH/USDT"]
_POLL_INTERVAL = int(os.getenv("SIGNAL_POLL_INTERVAL", "60"))


class SignalCollector:
    """Periodically polls the exchange and computes technical indicators."""

    def __init__(self, connector: ExchangeConnector) -> None:
        self._connector = connector
        self._symbols: list[str] = _DEFAULT_SYMBOLS
        self._latest: dict[str, dict[str, Any]] = {}
        self._task: asyncio.Task | None = None

    def get_latest_signals(self) -> list[dict[str, Any]]:
        """Return the most recently computed signals for all symbols."""
        return list(self._latest.values())

    async def start(self) -> None:
        """Start the background polling loop."""
        self._task = asyncio.create_task(self._poll_loop())
        logger.info("SignalCollector started (interval=%ds)", _POLL_INTERVAL)

    async def stop(self) -> None:
        """Cancel the background polling loop."""
        if self._task:
            self._task.cancel()

    async def _poll_loop(self) -> None:
        while True:
            for symbol in self._symbols:
                try:
                    await self._collect(symbol)
                except Exception:
                    logger.exception("Error collecting signal for %s", symbol)
            await asyncio.sleep(_POLL_INTERVAL)

    async def _collect(self, symbol: str) -> None:
        raw_ohlcv = await self._connector.fetch_ohlcv(symbol, timeframe="1h", limit=200)
        df = pd.DataFrame(
            raw_ohlcv, columns=["timestamp", "open", "high", "low", "close", "volume"]
        )
        df["timestamp"] = pd.to_datetime(df["timestamp"], unit="ms", utc=True)

        signals = compute_indicators(df)
        self._latest[symbol] = {
            "symbol": symbol,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            **signals,
        }
        logger.debug("Signals updated for %s: %s", symbol, signals)
