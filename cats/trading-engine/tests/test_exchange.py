"""Tests for ExchangeConnector."""
import os
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from src.exchange.connector import ExchangeConnector


@pytest.fixture()
def connector(monkeypatch):
    monkeypatch.setenv("EXCHANGE_NAME", "binance")
    monkeypatch.setenv("EXCHANGE_API_KEY", "test_key")
    monkeypatch.setenv("EXCHANGE_API_SECRET", "test_secret")
    monkeypatch.setenv("EXCHANGE_SANDBOX", "true")

    with patch("src.exchange.connector.ccxt") as mock_ccxt:
        mock_exchange = AsyncMock()
        mock_ccxt.binance.return_value = mock_exchange
        yield ExchangeConnector(), mock_exchange


@pytest.mark.asyncio
async def test_fetch_ticker(connector):
    conn, mock_exchange = connector
    mock_exchange.fetch_ticker.return_value = {
        "symbol": "BTC/USDT",
        "bid": 60000.0,
        "ask": 60001.0,
        "last": 60000.5,
        "baseVolume": 123.4,
        "timestamp": 1700000000000,
    }

    ticker = await conn.fetch_ticker("BTC/USDT")
    assert ticker["symbol"] == "BTC/USDT"
    mock_exchange.fetch_ticker.assert_awaited_once_with("BTC/USDT")


@pytest.mark.asyncio
async def test_create_market_order(connector):
    conn, mock_exchange = connector
    mock_exchange.create_market_order.return_value = {"id": "order-1", "status": "open"}

    order = await conn.create_market_order("BTC/USDT", "buy", 10.0)
    assert order["id"] == "order-1"
    mock_exchange.create_market_order.assert_awaited_once_with("BTC/USDT", "buy", 10.0)


def test_unsupported_exchange(monkeypatch):
    monkeypatch.setenv("EXCHANGE_NAME", "unsupported_exchange")
    with pytest.raises(ValueError, match="Unsupported exchange"):
        ExchangeConnector()
