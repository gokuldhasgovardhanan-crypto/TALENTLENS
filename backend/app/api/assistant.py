from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import AssistantRequest, AssistantResponse
from ..services.assistant_service import assistant_service

router = APIRouter(prefix="/assistant", tags=["assistant"])

@router.post("", response_model=AssistantResponse)
def chat_with_assistant(req: AssistantRequest, db: Session = Depends(get_db)):
    res = assistant_service.process_message(
        user_id=req.user_id,
        message=req.message,
        conversation_history=req.conversation_history,
        db=db
    )
    return res
