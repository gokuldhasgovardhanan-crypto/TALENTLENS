from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from ..database import get_db
from ..models import User

router = APIRouter(prefix="/auth", tags=["auth"])

class LoginRequest(BaseModel):
    email: Optional[str] = ""
    password: Optional[str] = "demo"
    demo_role: Optional[str] = None # student, job_seeker, employee, hr / hr_admin

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    user_type: str # student, job_seeker, employee, hr / hr_admin
    current_title: Optional[str] = ""
    department: Optional[str] = "Engineering"

@router.get("/demo-users")
def get_demo_users(db: Session = Depends(get_db)):
    """Returns demo accounts mapped to roles."""
    users = db.query(User).all()
    demo_accounts = [
        {"email": "student@talentlens.demo", "role": "student", "label": "Student (Arjun Kumar)", "user_id": 2},
        {"email": "jobseeker@talentlens.demo", "role": "job_seeker", "label": "Job Seeker (Priya Sharma)", "user_id": 1},
        {"email": "employee@talentlens.demo", "role": "employee", "label": "Employee (Rahul Menon)", "user_id": 3},
        {"email": "hr@talentlens.demo", "role": "hr", "label": "HR Recruiter (Ananya HR)", "user_id": 4},
    ]
    return {
        "users": users,
        "demo_accounts": demo_accounts
    }

@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = None
    role_map = {
        "student": "student@talentlens.demo",
        "job_seeker": "jobseeker@talentlens.demo",
        "employee": "employee@talentlens.demo",
        "hr": "hr@talentlens.demo",
        "hr_admin": "hr@talentlens.demo"
    }

    if req.email and req.email.strip():
        user = db.query(User).filter(User.email == req.email.strip().lower()).first()

    if not user and req.demo_role:
        target_email = role_map.get(req.demo_role.lower(), "jobseeker@talentlens.demo")
        user = db.query(User).filter(User.email == target_email).first()

    if not user:
        # Check by user_type if email lookup missed
        if req.demo_role:
            target_type = "hr_admin" if req.demo_role in ["hr", "hr_admin"] else req.demo_role
            user = db.query(User).filter(User.user_type == target_type).first()

    if not user:
        # Fallback to first user in database
        user = db.query(User).first()

    if not user:
        raise HTTPException(status_code=404, detail="User account not found in system")

    # Map user_type to clean role string
    user_role = user.user_type
    if user_role == "hr_admin":
        user_role = "hr"

    access_token = f"tl_token_{user.id}_{user_role}"

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "full_name": user.name,
            "email": user.email,
            "role": user_role,
            "user_type": user.user_type,
            "current_title": user.current_title,
            "department": user.department,
            "avatar": user.avatar,
            "career_stage": user.career_stage,
            "completeness_pct": user.completeness_pct,
            "target_role_id": user.target_role_id
        }
    }

@router.post("/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email.strip().lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_type = req.user_type
    if user_type == "hr":
        user_type = "hr_admin"

    user = User(
        name=req.name,
        email=req.email.strip().lower(),
        user_type=user_type,
        current_title=req.current_title or ("Student" if req.user_type == "student" else "Professional"),
        department=req.department or "Engineering",
        password_hash="hashed_pass"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    user_role = user.user_type
    if user_role == "hr_admin":
        user_role = "hr"

    access_token = f"tl_token_{user.id}_{user_role}"
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "full_name": user.name,
            "email": user.email,
            "role": user_role,
            "user_type": user.user_type,
            "current_title": user.current_title,
            "department": user.department,
            "avatar": user.avatar,
            "career_stage": user.career_stage,
            "completeness_pct": user.completeness_pct,
            "target_role_id": user.target_role_id
        }
    }

@router.get("/me")
def get_current_user_profile(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        user = db.query(User).filter(User.name == "Priya Sharma").first() or db.query(User).first()
    else:
        token = authorization.split(" ")[1]
        try:
            user_id = int(token.split("_")[2])
            user = db.query(User).filter(User.id == user_id).first()
        except Exception:
            user = db.query(User).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user_role = user.user_type
    if user_role == "hr_admin":
        user_role = "hr"

    return {
        "id": user.id,
        "name": user.name,
        "full_name": user.name,
        "email": user.email,
        "role": user_role,
        "user_type": user.user_type,
        "current_title": user.current_title,
        "department": user.department,
        "avatar": user.avatar,
        "career_stage": user.career_stage,
        "completeness_pct": user.completeness_pct,
        "target_role_id": user.target_role_id
    }
