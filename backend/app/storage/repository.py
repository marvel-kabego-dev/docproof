"""Repository — thin façade over the in-memory store in db.py.

All API route handlers go through this module, never directly to db.py.
This keeps the storage implementation swappable in future milestones.
"""
from __future__ import annotations

from typing import List, Optional

from app.storage import db
from app.core.models import DocumentationContract


def get_all_contracts() -> List[DocumentationContract]:
    return db.all_contracts()


def get_contract(contract_id: str) -> Optional[DocumentationContract]:
    return db.get_contract(contract_id)


def approve_contract(contract_id: str) -> Optional[DocumentationContract]:
    return db.update_contract(contract_id, approvalStatus="approved", approved=True)


def reject_contract(contract_id: str) -> Optional[DocumentationContract]:
    return db.update_contract(contract_id, approvalStatus="rejected", approved=False)
