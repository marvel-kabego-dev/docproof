"""Unit tests for the trust score calculation (pure function, no HTTP).

Formula:
  pass    = 1.0 point
  warning = 0.5 point
  fail    = 0.0 points
  score   = round((points / total) * 100, 2)  — returns 0.0 when total == 0
"""
import pytest
from app.core.models import DocumentationContract
from app.verification.trust_score import calculate_trust_score


def _make_contract(id: str, status: str) -> DocumentationContract:
    return DocumentationContract(
        id=id,
        area="commands",
        source="README.md#L1",
        claim="some claim",
        expected="expected",
        actual="actual",
        status=status,
        evidence="some evidence",
        suggested_fix="",
        approvalStatus="pending",
        approved=False,
        reverified=False,
    )


def test_all_pass():
    """5 passes → 5/5 * 100 = 100.0"""
    contracts = [_make_contract(f"C-{i}", "pass") for i in range(5)]
    assert calculate_trust_score(contracts) == 100.0


def test_all_fail():
    """4 fails → 0/4 * 100 = 0.0"""
    contracts = [_make_contract(f"C-{i}", "fail") for i in range(4)]
    assert calculate_trust_score(contracts) == 0.0


def test_mixed_pass_fail():
    """2 pass + 2 fail → 2/4 * 100 = 50.0"""
    contracts = [
        _make_contract("C-1", "pass"),
        _make_contract("C-2", "pass"),
        _make_contract("C-3", "fail"),
        _make_contract("C-4", "fail"),
    ]
    assert calculate_trust_score(contracts) == 50.0


def test_warning_half_point():
    """1 pass (1.0) + 1 warning (0.5) + 1 fail (0.0) = 1.5/3 * 100 = 50.0"""
    contracts = [
        _make_contract("C-1", "pass"),
        _make_contract("C-2", "warning"),
        _make_contract("C-3", "fail"),
    ]
    assert calculate_trust_score(contracts) == 50.0


def test_all_warnings():
    """4 warnings → (0.5 * 4)/4 * 100 = 50.0"""
    contracts = [_make_contract(f"C-{i}", "warning") for i in range(4)]
    assert calculate_trust_score(contracts) == 50.0


def test_empty_list_returns_zero():
    """No contracts → 0.0, no ZeroDivisionError."""
    assert calculate_trust_score([]) == 0.0


def test_single_pass():
    assert calculate_trust_score([_make_contract("C-1", "pass")]) == 100.0


def test_single_fail():
    assert calculate_trust_score([_make_contract("C-1", "fail")]) == 0.0
