from __future__ import annotations

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from app.core.models import DocumentationContract, ProjectSelection

router = APIRouter()


@router.post("/verify", status_code=202)
def trigger_verification(project: ProjectSelection) -> JSONResponse:
    """Placeholder — accepts a ProjectSelection and queues verification.

    Real agent orchestration will be wired here in Milestone 2.
    """
    return JSONResponse(
        status_code=202,
        content={"status": "verification_queued", "repository": project.repository},
    )
