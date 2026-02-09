from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.v1.auth import router as auth_router
from .api.v1.journals import router as journal_router
from .db.database import test_db_connection, engine, Base
from .models import user

app = FastAPI()
Base.metadata.create_all(bind=engine)

#origins that are allowed to talk to this API
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(journal_router, prefix="/api/v1/journal", tags=["journal"])

app.add_middleware(
    CORSMiddleware, allow_origins=origins,
    allow_credentials=True, allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    db_status = "Connected" if test_db_connection() else "Disconnected"

    return {"status": "ok", "database" : db_status, "message": "Journal App Backend is running!"}

