"""
Logging configuration for the recommendation service.
"""
import logging
import sys
from pathlib import Path
from typing import Optional

from ..config.settings import settings


def setup_logging(
    log_level: Optional[str] = None,
    log_file: Optional[Path] = None
) -> None:
    """
    Set up logging configuration for the application.
    
    Args:
        log_level: Logging level (DEBUG, INFO, WARNING, ERROR)
        log_file: Optional log file path
    """
    # Use provided log level or fall back to settings
    level = log_level or settings.service.log_level
    
    # Configure root logger
    logging.basicConfig(
        level=getattr(logging, level.upper()),
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=_create_handlers(log_file),
        force=True  # Override any existing configuration
    )
    
    # Configure specific loggers
    _configure_external_loggers()
    
    # Log startup message
    logger = logging.getLogger(__name__)
    logger.info(f"Logging configured with level: {level}")


def _create_handlers(log_file: Optional[Path] = None) -> list[logging.Handler]:
    """
    Create logging handlers.
    
    Args:
        log_file: Optional log file path
        
    Returns:
        List of logging handlers
    """
    handlers = []
    
    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(
        logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
    )
    handlers.append(console_handler)
    
    # File handler (if specified)
    if log_file:
        log_file.parent.mkdir(parents=True, exist_ok=True)
        file_handler = logging.FileHandler(log_file)
        file_handler.setFormatter(
            logging.Formatter(
                "%(asctime)s - %(name)s - %(levelname)s - "
                "%(filename)s:%(lineno)d - %(message)s"
            )
        )
        handlers.append(file_handler)
    
    return handlers


def _configure_external_loggers() -> None:
    """Configure logging levels for external libraries."""
    # Reduce noise from external libraries
    external_loggers = {
        "httpx": logging.WARNING,
        "motor": logging.INFO,
        "lightfm": logging.INFO,
        "uvicorn.access": logging.INFO,
        "uvicorn.error": logging.INFO,
    }
    
    for logger_name, level in external_loggers.items():
        logging.getLogger(logger_name).setLevel(level)