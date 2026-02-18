"""
Entry point of the FastAPI backend application

- creates the FastAPI app instance
- configures middleware (CORS)
- Registers API routers (auth & journal routes)
- Initializes database tables
- Provides a health check endpoint
"""

#Core Imports
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

#Router Imports
from .api.v1.auth import router as auth_router
from .api.v1.journals import router as journal_router
from .api.v1.ai import router as ai_router

#Database Imports
from .db.database import test_db_connection, engine, Base
from .models import user

app = FastAPI()

#Create all database automatically
Base.metadata.create_all(bind=engine)

#origins that are allowed to talk to this API
origins = [
    "http://localhost",
    "http://127.0.0.1",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

#Middleware to allow frontend to communicate to backend
app.add_middleware(
    CORSMiddleware, allow_origins=origins,
    allow_credentials=True, allow_methods=["*"],
    allow_headers=["*"],
)

#Routes
app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(journal_router, prefix="/api/v1/journal", tags=["journal"])
app.include_router(ai_router, prefix="/api/v1/ai", tags=["AI Assistant"])


#API endpoint to verify connections
@app.get("/health")
def health_check():
    db_status = "Connected" if test_db_connection() else "Disconnected"

    return {"status": "ok", "database" : db_status, "message": "Journal App Backend is running!"}

