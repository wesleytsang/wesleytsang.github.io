"""Tests for the DecisionEngine."""
from unittest.mock import AsyncMock, MagicMock

import pytest

from src.strategy.decision_engine import DecisionEngine


@pytest.fixture()
def engine():
    connector = AsyncMock()
    connector.create_market_order.return_value = {"id": "order-1"}
    collector = MagicMock()
    collector.get_latest_signals.return_value = []
    return DecisionEngine(connector, collector), connector, collector


@pytest.mark.asyncio
async def test_open_trade_on_oversold(engine):
    eng, connector, collector = engine
    signal = {"symbol": "BTC/USDT", "rsi": 25.0, "close": 60000.0}

    await eng._evaluate(signal)

    assert "BTC/USDT" in eng._open_trades
    connector.create_market_order.assert_awaited_once()


@pytest.mark.asyncio
async def test_close_trade_on_overbought(engine):
    eng, connector, collector = engine
    # First open a trade manually
    eng._open_trades["BTC/USDT"] = {
        "id": "t1",
        "symbol": "BTC/USDT",
        "status": "open",
    }

    signal = {"symbol": "BTC/USDT", "rsi": 75.0, "close": 65000.0}
    await eng._evaluate(signal)

    assert "BTC/USDT" not in eng._open_trades
    assert eng._closed_trades[-1]["status"] == "closed"


@pytest.mark.asyncio
async def test_no_action_when_rsi_neutral(engine):
    eng, connector, _ = engine
    signal = {"symbol": "ETH/USDT", "rsi": 50.0, "close": 3000.0}

    await eng._evaluate(signal)

    assert "ETH/USDT" not in eng._open_trades
    connector.create_market_order.assert_not_awaited()


@pytest.mark.asyncio
async def test_no_action_when_rsi_is_none(engine):
    eng, connector, _ = engine
    signal = {"symbol": "ETH/USDT", "rsi": None}

    await eng._evaluate(signal)

    connector.create_market_order.assert_not_awaited()
