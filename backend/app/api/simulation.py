from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, JobRole, WhatIfSimulation
from ..schemas import WhatIfRequest, WhatIfResponse
from ..services.whatif_simulator import whatif_simulator

router = APIRouter(prefix="/simulation", tags=["simulation"])

@router.post("", response_model=WhatIfResponse)
def run_simulation(req: WhatIfRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == req.user_id).first()
    role = db.query(JobRole).filter(JobRole.id == req.target_role_id).first()
    if not user or not role:
        raise HTTPException(status_code=404, detail="User or Role not found")

    result = whatif_simulator.simulate(
        user=user,
        target_role=role,
        simulated_skills=req.simulated_skills,
        simulated_proficiency=req.simulated_proficiency or "Intermediate",
        db=db
    )
    return result
