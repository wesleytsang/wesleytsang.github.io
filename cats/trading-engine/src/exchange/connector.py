"""CCXT-based exchange connector."""
import os
from typing import Any

import ccxt.async_support as ccxt

from src.utils.logger import get_logger

logger = get_logger(__name__)

_SUPPORTED_EXCHANGES = {"binance", "kraken", "coinbasepro", "bybit"}


class ExchangeConnector:
    """Thin async wrapper around a CCXT exchange instance.

    Configuration is read from environment variables:
        EXCHANGE_NAME, EXCHANGE_API_KEY, EXCHANGE_API_SECRET, EXCHANGE_SANDBOX
    """

    def __init__(self) -> None:
        exchange_name = os.getenv("EXCHANGE_NAME", "binance").lower()
        if exchange_name not in _SUPPORTED_EXCHANGES:
            raise ValueError(
                f"Unsupported exchange '{exchange_name}'. "
                f"Supported: {_SUPPORTED_EXCHANGES}"
            )

        exchange_class = getattr(ccxt, exchange_name)
        self._exchange: ccxt.Exchange = exchange_class(
            {
                "apiKey": os.getenv("EXCHANGE_API_KEY", ""),
                "secret": os.getenv("EXCHANGE_API_SECRET", ""),
                "enableRateLimit": True,
            }
        )

        if os.getenv("EXCHANGE_SANDBOX", "true").lower() == "true":
            self._exchange.set_sandbox_mode(True)
            logger.info("Exchange running in SANDBOX mode")

        logger.info("ExchangeConnector initialised for %s", exchange_name)

    async def fetch_ticker(self, symbol: str) -> dict[str, Any]:
        """Fetch the latest ticker for *symbol* (e.g. 'BTC/USDT')."""
        return await self._exchange.fetch_ticker(symbol)

    async def fetch_ohlcv(
        self,
        symbol: str,
        timeframe: str = "1h",
        limit: int = 100,
    ) -> list[list]:
        """Fetch OHLCV candles for *symbol*."""
        return await self._exchange.fetch_ohlcv(symbol, timeframe, limit=limit)

    async def create_market_order(
        self,
        symbol: str,
        side: str,
        amount: float,
    ) -> dict[str, Any]:
        """Place a market order.

        Args:
            symbol: Trading pair, e.g. 'BTC/USDT'.
            side:   'buy' or 'sell'.
            amount: Order size in base currency units.
        """
        logger.info("Placing %s market order: %s x %s", side, amount, symbol)
        return await self._exchange.create_market_order(symbol, side, amount)

    async def fetch_open_orders(self, symbol: str) -> list[dict[str, Any]]:
        """Return all open orders for *symbol*."""
        return await self._exchange.fetch_open_orders(symbol)

    async def close(self) -> None:
        """Close the underlying CCXT exchange connection."""
        await self._exchange.close()
