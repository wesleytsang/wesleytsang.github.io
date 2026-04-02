"""Technical indicator calculations using the *ta* library."""
from typing import Any

import pandas as pd
import ta


def compute_indicators(df: pd.DataFrame) -> dict[str, Any]:
    """Compute a standard set of technical indicators from OHLCV *df*.

    Args:
        df: DataFrame with columns [timestamp, open, high, low, close, volume].

    Returns:
        Dictionary of indicator values derived from the most recent candle.
    """
    close = df["close"]
    high = df["high"]
    low = df["low"]
    volume = df["volume"]

    rsi = ta.momentum.RSIIndicator(close=close, window=14).rsi()
    macd_obj = ta.trend.MACD(close=close, window_slow=26, window_fast=12, window_sign=9)
    bb = ta.volatility.BollingerBands(close=close, window=20, window_dev=2)

    return {
        "rsi": _last(rsi),
        "macd": _last(macd_obj.macd()),
        "macd_signal": _last(macd_obj.macd_signal()),
        "macd_diff": _last(macd_obj.macd_diff()),
        "bb_upper": _last(bb.bollinger_hband()),
        "bb_middle": _last(bb.bollinger_mavg()),
        "bb_lower": _last(bb.bollinger_lband()),
        "close": _last(close),
        "volume": _last(volume),
    }


def _last(series: pd.Series) -> float | None:
    """Return the last non-NaN value from *series*, or None."""
    clean = series.dropna()
    return float(clean.iloc[-1]) if not clean.empty else None
