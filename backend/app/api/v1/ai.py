from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session


from ...db.database import get_db
from ...api import deps
from ...models.journal import Journal
import httpx, os

router = APIRouter()

'''
URL of the LLM suggestion microservice.
Default assumes docker-compose / same-network service name "llm" + port 8001.
Override via env: LLM_URL=http://localhost:8002/suggest
'''
LLM_SERVICE_URL = os.getenv("LLM_URL", "http://llm:8001/suggest")

'''
Global on/off switch for AI suggestions.
Useful during development, testing, cost control, or when the LLM service is down.
Set LLM_ENABLED=false to quickly disable AI without code changes.
'''
LLM_ENABLED = os.getenv("LLM_ENABLED", "true").lower() == "true"

'''
1. Fetches the user's last 3 journals for context.
2. Sends context + mood to the AI Service.
3. Returns the AI's prompts to the frontend.
'''
@router.post("/suggest")
async def proxy_ai_suggestion(mood: str, db: Session = Depends(get_db), current_user = Depends(deps.get_current_user)):
    if not LLM_ENABLED:
        return {"suggestion": None, "status": "disabled"}
    
    #Fetch context from the last 3 journals then combine them
    recent_journals = (
    db.query(Journal)
    .filter(Journal.owner_id == current_user.id)
    .order_by(Journal.created_at.desc())
    .limit(3)
    .all()
    )

    context_text = "\n".join([f"{j.title}: {j.content}" for j in recent_journals])

    #Call the AI 
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(LLM_SERVICE_URL, 
                    json={"context": context_text, "mood": mood}, timeout=20.0)
            response.raise_for_status()
            return response.json()
        
        except httpx.HTTPError:
            raise HTTPException(status_code=503, detail="AI Service currently unavailable")
