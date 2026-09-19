from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from ..schemas import DemoLoginRequest, UserBase

router = APIRouter(prefix="/auth", tags=["auth"])

@router.get("/demo-users")
def get_demo_users(db: Session = Depends(get_db)):
    """Returns curated demo personas for quick 1-click login."""
    users = db.query(User).all()
    # Ensure key personas come first
    priority_names = ["Priya Sharma", "Arjun Kumar", "Rahul Menon", "Ananya HR"]
    sorted_users = sorted(
        users,
        key=lambda u: priority_names.index(u.name) if u.name in priority_names else 99
    )
    return sorted_users

@router.post("/demo-login")
def demo_login(req: DemoLoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == req.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "status": "success",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "user_type": user.user_type,
            "current_title": user.current_title,
            "department": user.department,
            "avatar": user.avatar,
            "career_stage": user.career_stage,
            "completeness_pct": user.completeness_pct,
            "target_role_id": user.target_role_id
        }
    }
