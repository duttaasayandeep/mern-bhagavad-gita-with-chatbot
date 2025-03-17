# chatbot/backend.py
import re
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Load Bhagavad Gita CSV dataset (ensure the CSV file is in the same directory)
gita_df = pd.read_csv("Bhagavad_Gita.csv")

def fetch_word_meaning(query: str) -> Optional[str]:
    """
    If the query mentions a chapter and verse (and optionally 'gita'),
    extract the chapter and verse numbers and return the corresponding word meaning.
    """
    # Check if query mentions 'chapter' and 'verse' (and optionally 'gita')
    query_lower = query.lower()
    if "chapter" in query_lower and "verse" in query_lower:
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

# Pydantic model for incoming request data
class RequestState(BaseModel):
    model_name: str
    model_provider: str
    system_prompt: str
    messages: List[str]
    allow_search: bool

# Import your AI agent function
from ai_agent import get_response_from_ai_agent

ALLOWED_MODEL_NAMES = [
    "llama3-70b-8192", 
    "mixtral-8x7b-32768", 
    "llama-3.3-70b-versatile", 
    "gpt-4o-mini"
]

app = FastAPI(title="Bhagavad Gita Chatbot")

# Add CORS middleware to handle preflight requests (OPTIONS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],            # Adjust allowed origins as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat")
def chat_endpoint(request: RequestState):
    """
    API Endpoint to interact with the chatbot.
    - Returns CSV data if the query is about word meaning.
    - Otherwise, returns a response from the AI agent.
    """
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
    uvicorn.run(app, host="127.0.0.1", port=5001)
