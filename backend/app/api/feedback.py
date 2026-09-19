from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import RecommendationFeedback
from ..schemas import FeedbackCreate

router = APIRouter(prefix="/feedback", tags=["feedback"])

@router.post("")
def record_feedback(payload: FeedbackCreate, db: Session = Depends(get_db)):
    feedback_entry = RecommendationFeedback(
        user_id=payload.user_id,
        recommendation_type=payload.recommendation_type,
        item_id=payload.item_id,
        item_title=payload.item_title,
        is_positive=payload.is_positive,
        feedback_reason=payload.feedback_reason,
        comment=payload.comment or ""
    )
    db.add(feedback_entry)
    db.commit()
    db.refresh(feedback_entry)
    return {
        "status": "success",
        "feedback_id": feedback_entry.id,
        "message": "Thank you! Your feedback continuously tunes our matching heuristics."
    }
