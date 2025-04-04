# chatbot/backend.py
import os
import re
import pandas as pd
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Load Bhagavad Gita CSV dataset (ensure the CSV file is in the same directory)
gita_df = pd.read_csv("Bhagavad_Gita.csv")

def fetch_word_meaning(query: str) -> Optional[str]:
    if "chapter" in query.lower() and "verse" in query.lower():
        match = re.search(r'chapter\s*(\d+).*?verse\s*(\d+)', query, re.IGNORECASE)
        if match:
            chapter = int(match.group(1))
            verse = int(match.group(2))
            row = gita_df[(gita_df['Chapter'] == chapter) & (gita_df['Verse'] == verse)]
            if not row.empty:
                return row.iloc[0]['WordMeaning']
            else:
                return f"No data found for Chapter {chapter}, Verse {verse}."
    return None

class RequestState(BaseModel):
    model_name: str
    model_provider: str
    system_prompt: str
    messages: List[str]
    allow_search: bool

from ai_agent import get_response_from_ai_agent

ALLOWED_MODEL_NAMES = [
    "llama3-70b-8192",
    "mixtral-8x7b-32768",
    "llama-3.3-70b-versatile",
    "gpt-4o-mini"
]

app = FastAPI(title="Bhagavad Gita Chatbot")

# Standard CORSMiddleware (should normally add CORS headers)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify allowed origins, e.g., ["https://your-frontend-domain.vercel.app"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom middleware to catch exceptions and ensure CORS header is always set
@app.middleware("http")
async def add_cors_and_handle_exceptions(request: Request, call_next):
    try:
        response = await call_next(request)
    except Exception as exc:
        # Log the exception details for debugging (optional)
        import traceback
        traceback.print_exc()
        response = JSONResponse(content={"detail": str(exc)}, status_code=500)
    # Ensure CORS header is present
    response.headers["access-control-allow-origin"] = "*"
    return response

@app.post("/chat")
def chat_endpoint(request: RequestState):
    if request.model_name not in ALLOWED_MODEL_NAMES:
        return {"error": "Invalid model name. Kindly select a valid AI model"}
    user_query = request.messages[-1] if request.messages else ""
    gita_response = fetch_word_meaning(user_query)
    if gita_response is not None:
        return {"response": gita_response}
    llm_id = request.model_name
    allow_search = request.allow_search
    system_prompt = request.system_prompt
    provider = request.model_provider
    response = get_response_from_ai_agent(llm_id, request.messages, allow_search, system_prompt, provider)
    return {"response": response}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 5001))
    uvicorn.run(app, host="0.0.0.0", port=port)
