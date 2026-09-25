import os
import json
import pytest
from pathlib import Path

from document_processing.parser import DocumentParser
from python_validation.validator import PythonValidationEngine
from comparison_engine.compare import ComparisonEngine
from security.security_tester import SecurityAuditEngine
from genai_pipeline.generator import load_role_matrix, build_fallback_plan, generate_onboarding_plan

BASE_DIR = Path(__file__).resolve().parent.parent


def test_document_parser():
    parser = DocumentParser("sample_documents")
    docs = parser.load_and_parse_all()
    assert len(docs) >= 40, f"Expected at least 40 documents, got {len(docs)}"

    for doc in docs:
        assert "file_name" in doc
        assert "doc_id" in doc
        assert "version" in doc
        assert "section" in doc
        assert "content" in doc

    # Test chunking
    sample_chunks = parser.chunk_document(docs[0])
    assert len(sample_chunks) >= 1
    assert "chunk_id" in sample_chunks[0]


def test_role_requirement_matrix():
    roles = load_role_matrix()
    assert len(roles) == 10
    role_names = [r["role_name"] for r in roles]
    assert "Software Engineer" in role_names
    assert "HR Manager" in role_names
    assert "Delivery Driver" in role_names


def test_onboarding_plan_generation():
    plan = build_fallback_plan("Software Engineer")
    assert plan["employee_role"] == "Software Engineer"
    assert plan["company"] == "Apex Logistics"
    assert len(plan["onboarding_plan"]) > 0
    assert len(plan["training_requirements"]) > 0
    assert len(plan["contradictions"]) > 0
    assert len(plan["security_warnings"]) > 0


def test_python_validation_engine():
    validator = PythonValidationEngine("role_requirement_matrix.json")
    plan = build_fallback_plan("Delivery Driver")
    report = validator.validate_plan(plan)

    assert report["role_evaluated"] == "Delivery Driver"
    assert "coverage_score" in report
    assert "traceability_score" in report
    assert report["metrics"]["expected_trainings_count"] == 3
    assert report["metrics"]["covered_trainings_count"] == 3
    assert report["coverage_score"] == "100.0%"


def test_comparison_engine():
    comp_engine = ComparisonEngine("role_requirement_matrix.json")
    plan_se = build_fallback_plan("Software Engineer")
    report = comp_engine.generate_comparison_report({"Software Engineer": plan_se})

    assert report["total_roles_evaluated"] == 1
    assert len(report["comparison_details"]) == 1
    assert report["comparison_details"][0]["role"] == "Software Engineer"


def test_security_audit_engine():
    sec_engine = SecurityAuditEngine()
    report = sec_engine.audit_adversarial_documents()

    assert report["total_adversarial_vectors_tested"] == 10
    assert report["defense_success_rate"] == "100%"
    assert report["system_verdict"] == "SECURE AGAINST INDIRECT PROMPT INJECTIONS"
    assert len(report["test_cases"]) == 10

