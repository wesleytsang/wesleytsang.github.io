"""Structured logging helper."""
import logging
import os


def get_logger(name: str) -> logging.Logger:
    """Return a configured logger for *name*.

    Log level is controlled by the ``ENGINE_LOG_LEVEL`` environment variable
    (default: INFO).
    """
    level_name = os.getenv("ENGINE_LOG_LEVEL", "INFO").upper()
    level = getattr(logging, level_name, logging.INFO)

    logging.basicConfig(
        level=level,
        format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
        datefmt="%Y-%m-%dT%H:%M:%S",
    )
    return logging.getLogger(name)
