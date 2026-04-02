"""Pydantic models for exchange data."""
from datetime import datetime

from pydantic import BaseModel, Field


class Ticker(BaseModel):
    symbol: str
    bid: float
    ask: float
    last: float
    volume: float
    timestamp: datetime


class OHLCV(BaseModel):
    timestamp: datetime
    open: float
    high: float
    low: float
    close: float
    volume: float


class Order(BaseModel):
    id: str
    symbol: str
    side: str = Field(pattern="^(buy|sell)$")
    type: str
    amount: float
    price: float | None = None
    status: str
    timestamp: datetime
