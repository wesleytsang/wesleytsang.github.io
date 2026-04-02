"""Tests for signal indicators."""
import pandas as pd
import pytest

from src.signals.indicators import compute_indicators


def _make_df(n: int = 100, close_val: float = 50_000.0) -> pd.DataFrame:
    """Return a simple synthetic OHLCV DataFrame."""
    import numpy as np

    rng = pd.date_range("2024-01-01", periods=n, freq="h", tz="UTC")
    close = pd.Series(close_val + np.sin(range(n)) * 1000, index=rng)
    df = pd.DataFrame(
        {
            "timestamp": rng,
            "open": close - 50,
            "high": close + 100,
            "low": close - 100,
            "close": close,
            "volume": pd.Series([1000.0] * n, index=rng),
        }
    )
    return df


def test_compute_indicators_returns_expected_keys():
    df = _make_df()
    result = compute_indicators(df)
    expected_keys = {"rsi", "macd", "macd_signal", "macd_diff", "bb_upper", "bb_middle", "bb_lower", "close", "volume"}
    assert expected_keys.issubset(result.keys())


def test_rsi_range():
    df = _make_df()
    result = compute_indicators(df)
    rsi = result["rsi"]
    if rsi is not None:
        assert 0 <= rsi <= 100


def test_compute_indicators_insufficient_data_returns_none():
    """With too few rows, some indicators will be None — must not raise."""
    df = _make_df(n=5)
    result = compute_indicators(df)
    assert isinstance(result, dict)
