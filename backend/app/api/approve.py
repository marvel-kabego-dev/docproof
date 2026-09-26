from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.core.models import DocumentationContract
from app.storage import repository

router = APIRouter()


@router.post("/approve/{contract_id}", response_model=DocumentationContract)
def approve_contract(contract_id: str) -> DocumentationContract:
    contract = repository.approve_contract(contract_id)
    if contract is None:
        raise HTTPException(status_code=404, detail=f"Contract '{contract_id}' not found.")
    return contract


@router.post("/reject/{contract_id}", response_model=DocumentationContract)
def reject_contract(contract_id: str) -> DocumentationContract:
    contract = repository.reject_contract(contract_id)
    if contract is None:
        raise HTTPException(status_code=404, detail=f"Contract '{contract_id}' not found.")
    return contract
