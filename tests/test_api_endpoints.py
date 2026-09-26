import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from fastapi.testclient import TestClient
from backend.server import app

client = TestClient(app)

def test_health_endpoint():
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

def test_auth_login():
    res = client.post("/api/auth/login", json={"username": "admin", "password": "admin123"})
    assert res.status_code == 200
    data = res.json()
    assert "token" in data
    assert data["user"]["role"] == "admin"

def test_list_roles():
    res = client.get("/api/roles")
    assert res.status_code == 200
    data = res.json()
    assert len(data["roles"]) >= 10

def test_get_matrix():
    res = client.get("/api/matrix")
    assert res.status_code == 200
    data = res.json()
    assert len(data["matrix"]) >= 50

def test_generate_and_validate_plan():
    res = client.post("/api/plans/generate", json={
        "employee_id": 1,
        "role_name": "Software Support Engineer"
    })
    assert res.status_code == 200
    data = res.json()
    assert "plan_id" in data
    assert "validation" in data
    assert data["validation"]["coverage_score"] > 0

def test_comparison_report():
    res = client.get("/api/comparison/multi-role")
    assert res.status_code == 200
    data = res.json()
    assert "total_roles_evaluated" in data
    assert data["total_requirement_items"] >= 50

def test_review_action_audit():
    res = client.post("/api/reviews/1/action", json={
        "review_id": 1,
        "action": "override",
        "reviewer_username": "reviewer",
        "override_reason": "Verified under updated Q3 budget exception.",
        "comment": "Approved by committee."
    })
    assert res.status_code == 200

    audit_res = client.get("/api/audit")
    assert audit_res.status_code == 200
    logs = audit_res.json()["audit_trail"]
    assert any(log["action_type"] == "REVIEW_ACTION" for log in logs)
