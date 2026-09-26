"""Pure function for computing the Documentation Trust Score.

Formula (mirrors the agreed scoring rubric):
  pass    = 1.0 point
  warning = 0.5 point
  fail    = 0.0 points
  score   = round((total_points / total_contracts) * 100, 2)

Returns 0.0 when the contract list is empty (avoids ZeroDivisionError).
"""
from __future__ import annotations

from typing import List

from app.core.models import DocumentationContract

_POINTS: dict[str, float] = {
    "pass": 1.0,
    "warning": 0.5,
    "fail": 0.0,
}


def calculate_trust_score(contracts: List[DocumentationContract]) -> float:
    """Return a trust score in the range [0.0, 100.0]."""
    if not contracts:
        return 0.0
    total_points = sum(_POINTS.get(c.status, 0.0) for c in contracts)
    return round((total_points / len(contracts)) * 100, 2)
