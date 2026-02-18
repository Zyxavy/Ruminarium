import os
import multiprocessing
from contextlib import asynccontextmanager

from google import genai
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from llama_cpp import Llama

'''
Environment variable GOOGLE_API_KEY.
If set -> use Gemini (online)
If missing -> fall back to local TinyLlama
'''
GEMINI_KEY = os.getenv("GOOGLE_API_KEY")

'''
Path to the GGUF quantized TinyLlama model.
This is a very small model, good trade-off between speed and quality.
'''
LOCAL_MODEL_PATH = "./models/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf"

#Will be initialized in lifespan() depending on which backend we use
llm = None
gemini_client = None

#Input Schema for /suggest endpoint
class SuggestionRequest(BaseModel):
    context: str = ""
    mood: str = "neutral"


'''
FastAPI lifespan handler — runs on startup and shutdown.

Responsibilities:
- Decide which LLM backend to use (Gemini vs local)
- Initialize the chosen model / client exactly once
- Keep model loaded in memory during the whole application lifetime

'''
@asynccontextmanager
async def lifespan(app: FastAPI):
    global llm, gemini_client

    if not GEMINI_KEY:
        print("Using Local LLM (TinyLLaMA)")
        llm = Llama(
            model_path=LOCAL_MODEL_PATH,
            n_ctx=2048, #Context Len
            n_threads=max(1, multiprocessing.cpu_count() // 2),
            verbose=False,
        )
    else:
        print("Using Online LLM (Gemini)")
        gemini_client = genai.Client(api_key=GEMINI_KEY)

    yield


app = FastAPI(lifespan=lifespan)

'''
Main endpoint: generate 3 short reflection questions based on recent journaling context.

Behavior differences between backends:
- Gemini   -> single generation call, usually good formatting
- TinyLlama -> chat completion + stricter system prompt to reduce rambling (depending on model)
'''
@app.post("/suggest")
async def get_suggestion(request: SuggestionRequest):
    try:
        MAX_CONTEXT_CHARS = 2000
        context = request.context[-MAX_CONTEXT_CHARS:]

        if GEMINI_KEY:
            prompt = f"""You are a helpful journaling assistant.
Suggest short, insightful reflection questions based on the user's recent journals.
Do NOT include answers or extra commentary.

Recent journals:
{context}

Current mood: {request.mood}"""
            
            response = gemini_client.models.generate_content(
                model="gemini-1.5-flash",
                contents=prompt,
            )
            suggestion = response.text.strip()

        else:
            # Local logic
            messages = [
                {
                    "role": "system",
                    "content": (
                        "You are a journaling assistant. "
                        "*Do NOT include answers*, Generate 3 short, insightful reflection questions based on the user's journal. "
                        "Do NOT include answers or explanations. "
                        "Maximum 3 questions allowed."
                    )
                },
                {
                    "role": "user",
                    "content": f"Recent journals:\n{context}\n\nCurrent mood: {request.mood}"
                }
            ]

            response = llm.create_chat_completion(
                messages=messages,
                max_tokens=150,
                temperature=0.7,
                top_p=0.9,
                stop=None 
            )

            # Take the raw content
            suggestion = response["choices"][0]["message"]["content"].strip()

        return {"suggestion": suggestion}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
