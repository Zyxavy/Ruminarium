# Ruminarium AI Suggestion Service

This directory contains the standalone **Inference Service** for Ruminarium that generates short, insightful reflection questions for journaling based on recent entries and the user's current mood.

It is designed to run either:
- **Locally** on consumer hardware (using a tiny quantized model), or
- **In the cloud** via Google Gemini (when an API key is provided).

The service exposes a simple HTTP API that the main Ruminarium backend calls when needed.

## Features

- **Hybrid backend** — auto-switches between:
  - Local: TinyLlama-1.1B-Chat (GGUF Q4_K_M) or other models inside `models/` — fully private, CPU-only
  - Cloud: Google Gemini 1.5 Flash — faster & higher quality when `GOOGLE_API_KEY` is set
- **Stateless** — no database, no persistent storage of user data
- **FastAPI** — modern, async, auto-generated OpenAPI docs at `/docs`

---

## Configuration (Environment Variables)

| Environment Variable | Description                                                                                              | Default / Example                               |
| -------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `GOOGLE_API_KEY`     | If set -> uses Gemini 1.5 Flash (recommended for best quality). If unset -> falls back to local TinyLlama. | (unset)                                         |
| `MODEL_PATH`         | Path to the local GGUF model file.                                                                       | `./models/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf` |
| `LLM_PORT`           | Port the service listens on.                                                                             | `8001`                                          |

## Local Model Setup

### To use a local llm:

1. Download the model from Hugging Face:

```bash
# Recommended: use huggingface-cli (install via pip install huggingface_hub)
huggingface-cli download TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF \
  tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf \
  --local-dir ./models \
  --local-dir-use-symlinks False
```
Or manually download [here](https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/blob/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf)

2. Place the file in llm/models/.

3. If you use a different filename or quantization level, update MODEL_PATH in your environment.

---

### To use Gemini API 

1. Create a `.env` file in `llm/`, and paste the API key.
```bash
GOOGLE_API_KEY=your-api-key
```

2. (Optional) list `.env` in `.gitignore`.
```
#.gitignore
*.env
```

## Running the Service

### With Docker (Recommended)
```bash
# From the project root (where docker-compose.yml lives)

# With AI assitant
docker compose --profile ai up --build -d

# No AI assistant
docker compose -d --build 
```

This starts the LLM service on port 8001 (or whatever LLM_PORT is set to).


## API Endpoints

`POST /suggest`
Generates 2–4 short reflection questions.
Request body (JSON):

```bash
{
  "context": "Last few journals",
  "mood": "stressed"
}

# Response
{
  "suggestion": "1. What triggered this feeling of stress today?..."
}
```
`GET /health`
Quick status check.
Response:
```bash
{
  "status": "healthy",
  "mode": "local" | "gemini",
  "model": "TinyLlama-1.1B-Chat-v1.0-Q4_K_M" | "gemini-1.5-flash"
}
```
