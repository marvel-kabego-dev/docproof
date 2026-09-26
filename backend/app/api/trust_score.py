from __future__ import annotations

from fastapi import APIRouter

from app.core.models import TrustScoreResponse
from app.storage import repository
from app.verification.trust_score import calculate_trust_score

router = APIRouter()


@router.get("/trust-score", response_model=TrustScoreResponse)
def get_trust_score() -> TrustScoreResponse:
    contracts = repository.get_all_contracts()
    score = calculate_trust_score(contracts)
    return TrustScoreResponse(score=score)
