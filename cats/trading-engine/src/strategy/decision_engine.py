"""Decision engine — evaluates signals and manages trade execution."""
import asyncio
import os
from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from src.exchange.connector import ExchangeConnector
from src.signals.collector import SignalCollector
from src.utils.logger import get_logger

logger = get_logger(__name__)

_ORDER_SIZE = float(os.getenv("ORDER_SIZE", "10"))
_MAX_OPEN_TRADES = int(os.getenv("MAX_OPEN_TRADES", "3"))
_RSI_OVERSOLD = 30.0
_RSI_OVERBOUGHT = 70.0


class DecisionEngine:
    """Evaluates the latest signals and places orders when conditions are met.

    Strategy (simple RSI-based example):
      - BUY  when RSI < 30 (oversold) and fewer than MAX_OPEN_TRADES are open.
      - SELL when RSI > 70 (overbought) and there is an open trade for that symbol.
    """

    def __init__(
        self, connector: ExchangeConnector, collector: SignalCollector
    ) -> None:
        self._connector = connector
        self._collector = collector
        self._open_trades: dict[str, dict[str, Any]] = {}
        self._closed_trades: list[dict[str, Any]] = []
        self._task: asyncio.Task | None = None

    def get_trades(self) -> list[dict[str, Any]]:
        """Return all open and recently closed trades."""
        return list(self._open_trades.values()) + self._closed_trades[-50:]

    async def start(self) -> None:
        """Start the signal collector and the decision loop."""
        await self._collector.start()
        self._task = asyncio.create_task(self._decision_loop())
        logger.info("DecisionEngine started")

    async def stop(self) -> None:
        """Stop the decision loop and signal collector."""
        if self._task:
            self._task.cancel()
        await self._collector.stop()
        await self._connector.close()

    async def _decision_loop(self) -> None:
        """Re-evaluate signals every 60 seconds."""
        while True:
            for signal in self._collector.get_latest_signals():
                try:
                    await self._evaluate(signal)
                except Exception:
                    logger.exception(
                        "Error evaluating signal for %s", signal.get("symbol")
                    )
            await asyncio.sleep(60)

    async def _evaluate(self, signal: dict[str, Any]) -> None:
        symbol = signal["symbol"]
        rsi = signal.get("rsi")

        if rsi is None:
            return

        if rsi < _RSI_OVERSOLD and len(self._open_trades) < _MAX_OPEN_TRADES:
            if symbol not in self._open_trades:
                await self._open_trade(symbol, signal)

        elif rsi > _RSI_OVERBOUGHT and symbol in self._open_trades:
            await self._close_trade(symbol, signal)

    async def _open_trade(self, symbol: str, signal: dict[str, Any]) -> None:
        order = await self._connector.create_market_order(symbol, "buy", _ORDER_SIZE)
        trade: dict[str, Any] = {
            "id": str(uuid4()),
            "symbol": symbol,
            "side": "buy",
            "amount": _ORDER_SIZE,
            "entry_price": signal.get("close"),
            "entry_rsi": signal.get("rsi"),
            "status": "open",
            "opened_at": datetime.now(timezone.utc).isoformat(),
            "order_id": order.get("id"),
        }
        self._open_trades[symbol] = trade
        logger.info("Trade opened: %s", trade)

    async def _close_trade(self, symbol: str, signal: dict[str, Any]) -> None:
        order = await self._connector.create_market_order(symbol, "sell", _ORDER_SIZE)
        trade = self._open_trades.pop(symbol)
        trade.update(
            {
                "exit_price": signal.get("close"),
                "exit_rsi": signal.get("rsi"),
                "status": "closed",
                "closed_at": datetime.now(timezone.utc).isoformat(),
                "close_order_id": order.get("id"),
            }
        )
        self._closed_trades.append(trade)
        logger.info("Trade closed: %s", trade)
