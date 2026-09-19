import os
import sys
import pytest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models import User, JobRole
from app.services.skill_engine import skill_engine
from app.services.matching_engine import matching_engine
from app.services.whatif_simulator import whatif_simulator

client = TestClient(app)

def test_system_status():
    response = client.get("/api/status")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["offline_ready"] is True

def test_skill_normalization():
    assert skill_engine.normalize_skill("powerbi") == "Power BI"
    assert skill_engine.normalize_skill("JS") == "JavaScript"
    assert skill_engine.normalize_skill("postgresql") == "SQL"
    assert skill_engine.normalize_skill("scikit-learn") == "Machine Learning"

def test_skill_extraction_and_inference():
    text = "Handled customer support incidents using custom SQL queries on PostgreSQL and built Power BI dashboards."
    res = skill_engine.extract_and_infer_skills(text)
    detected = [d["skill_name"] for d in res["detected_skills"]]
    inferred = [i["skill_name"] for i in res["inferred_skills"]]
    
    assert "SQL" in detected
    assert "Power BI" in detected
    assert "Data Analysis" in inferred or "Stakeholder Communication" in inferred

def test_priya_sharma_matching():
    db = SessionLocal()
    priya = db.query(User).filter(User.name == "Priya Sharma").first()
    data_analyst_role = db.query(JobRole).filter(JobRole.title == "Data Analyst").first()
    
    assert priya is not None
    assert data_analyst_role is not None

    match = matching_engine.calculate_match(priya, data_analyst_role)
    assert match["match_score"] >= 65
    assert match["matching_skills_count"] >= 3
    
    # Missing skills should contain Python or Statistics
    missing = [m["skill_name"] for m in match["missing_skills"]]
    assert "Python" in missing or "Statistics" in missing
    db.close()

def test_whatif_simulation_boost():
    db = SessionLocal()
    priya = db.query(User).filter(User.name == "Priya Sharma").first()
    data_analyst_role = db.query(JobRole).filter(JobRole.title == "Data Analyst").first()

    sim_res = whatif_simulator.simulate(
        user=priya,
        target_role=data_analyst_role,
        simulated_skills=["Python", "Statistics"],
        simulated_proficiency="Intermediate",
        db=db
    )

    assert sim_res["projected_score"] > sim_res["original_score"]
    assert sim_res["score_delta"] >= 10
    assert len(sim_res["unlocked_roles"]) > 0
    db.close()

def test_api_demo_users():
    response = client.get("/api/auth/demo-users")
    assert response.status_code == 200
    users = response.json()
    assert len(users) >= 4
    names = [u["name"] for u in users]
    assert "Priya Sharma" in names
    assert "Arjun Kumar" in names
    assert "Ananya HR" in names

def test_api_hr_overview():
    response = client.get("/api/hr/overview")
    assert response.status_code == 200
    data = response.json()
    assert data["total_profiles"] >= 20
    assert data["verified_skills_count"] > 0
