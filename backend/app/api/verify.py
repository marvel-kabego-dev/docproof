from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from app.core.models import ProjectSelection
from app.verification.verification_pipeline import run_config_verification


router = APIRouter()


@router.post("/verify")
def trigger_verification(project: ProjectSelection) -> JSONResponse:
    """Verify local repositories immediately.

    Remote or unavailable repositories keep the existing queued behavior
    until repository fetching or cloning is implemented.
    """
    repository_path = Path(project.repository)

    if not repository_path.is_dir():
        return JSONResponse(
            status_code=202,
            content={
                "status": "verification_queued",
                "repository": project.repository,
            },
        )

    if not project.documentation:
        raise HTTPException(
            status_code=400,
            detail="At least one documentation file is required",
        )

    documentation_relative_path = project.documentation[0]
    documentation_path = repository_path / documentation_relative_path
    env_path = repository_path / ".env.example"

    if not documentation_path.is_file():
        raise HTTPException(
            status_code=404,
            detail=f"Documentation file not found: {documentation_relative_path}",
        )

    if not env_path.is_file():
        raise HTTPException(
            status_code=404,
            detail=".env.example not found in repository",
        )

    result = run_config_verification(
        documentation_path=documentation_relative_path,
        documentation_content=documentation_path.read_text(encoding="utf-8"),
        env_path=".env.example",
        env_content=env_path.read_text(encoding="utf-8"),
    )

    return JSONResponse(
        status_code=200,
        content={
            "status": "completed",
            "repository": project.repository,
            "contracts": [
                contract.model_dump()
                for contract in result.contracts
            ],
            "summary": result.summary.model_dump(),
            "trust_score": result.trust_score,
        },
    )