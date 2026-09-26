from __future__ import annotations

from typing import List

from fastapi import APIRouter, HTTPException

from app.core.models import DocumentationContract
from app.storage import repository

router = APIRouter()


@router.get("/contracts", response_model=List[DocumentationContract])
def get_contracts() -> List[DocumentationContract]:
    return repository.get_all_contracts()


@router.get("/contracts/{contract_id}", response_model=DocumentationContract)
def get_contract(contract_id: str) -> DocumentationContract:
    contract = repository.get_contract(contract_id)
    if contract is None:
        raise HTTPException(status_code=404, detail=f"Contract '{contract_id}' not found.")
    return contract
