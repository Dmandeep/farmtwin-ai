from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, List
from app.database import get_db
from app.models.farm import ChatMessage, Field
from app.services.gemini_service import ask_gemini_agri

router = APIRouter(prefix="/qa", tags=["Ask a Question"])

@router.post("/ask")
async def ask_question(
    question: str = Form(...),
    language: str = Form("te"),
    session_id: str = Form("default"),
    field_id: Optional[int] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    # Contextualize with field if provided
    field_context = ""
    if field_id:
        field = db.query(Field).filter(Field.id == field_id).first()
        if field:
            field_context = f"Soil: {field.soil_type}, Water: {field.water_source}, District: {field.district}, Crop: {field.current_crop or 'General'}"

    image_bytes = None
    mime_type = "image/jpeg"
    if file:
        image_bytes = await file.read()
        mime_type = file.content_type or "image/jpeg"

    # Store user message
    user_msg = ChatMessage(
        session_id=session_id,
        role="user",
        language=language,
        content=question,
        image_url=file.filename if file else None
    )
    db.add(user_msg)
    db.commit()

    # Call Gemini Agri Service
    advice = await ask_gemini_agri(
        prompt=question,
        language=language,
        image_bytes=image_bytes,
        image_mime_type=mime_type,
        field_context=field_context
    )

    # Store assistant message
    asst_msg = ChatMessage(
        session_id=session_id,
        role="assistant",
        language=language,
        content=advice.get("short_answer", ""),
        structured_content=advice
    )
    db.add(asst_msg)
    db.commit()

    return {
        "status": "success",
        "question": question,
        "language": language,
        "advice": advice
    }

@router.get("/history")
def get_chat_history(session_id: str = "default", db: Session = Depends(get_db)):
    messages = db.query(ChatMessage).filter(ChatMessage.session_id == session_id).order_by(ChatMessage.id.asc()).all()
    return messages
