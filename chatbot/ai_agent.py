# chatbot/ai_agent.py
import os
from dotenv import load_dotenv
load_dotenv()

# Retrieve the Groq API key from the environment
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

# Import the necessary Groq module
from langchain_groq import ChatGroq
from langchain_community.tools.tavily_search import TavilySearchResults
from langgraph.prebuilt import create_react_agent
from langchain_core.messages.ai import AIMessage

def get_response_from_ai_agent(llm_id, query, allow_search, system_prompt, provider):
    # Force using Groq regardless of the provided 'provider'
    # You can ignore the 'provider' parameter if you want only Groq support
    llm = ChatGroq(model=llm_id, api_key=GROQ_API_KEY)
    
    # Set up tools if search is allowed
    tools = [TavilySearchResults(max_results=2)] if allow_search else []
    agent = create_react_agent(
        model=llm,
        tools=tools,
        state_modifier=system_prompt
    )
    state = {"messages": query}
    response = agent.invoke(state)
    messages = [message.content for message in response.get("messages", []) if isinstance(message, AIMessage)]
    return messages[-1] if messages else "No response from agent."
