from fastapi import APIRouter
from pydantic import BaseModel

from app.integrations.groq_client import generate_explanation

router = APIRouter(prefix="/ai", tags=["AI"])


class ExplanationRequest(BaseModel):
    prompt: str


@router.post("/explain")
def explain(request: ExplanationRequest):
    explanation = generate_explanation(request.prompt)

    return {
        "explanation": explanation
    }