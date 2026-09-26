"""Application configuration.

Reads environment variables with sensible defaults.
No external dependencies beyond the standard library.
"""
import os

APP_TITLE = "DocProof API"
APP_VERSION = "0.1.0"

PORT: int = int(os.getenv("PORT", "8000"))

# Comma-separated list of allowed CORS origins.
# Default allows the Vite dev server used by the frontend.
CORS_ORIGINS: list[str] = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]
