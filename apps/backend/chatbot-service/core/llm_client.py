from google import genai
from core.config import settings
import os
import json

def load_system_prompt():
    prompt_path = os.path.join(os.path.dirname(__file__), '../prompts/system_prompt.json')
    with open(prompt_path, 'r') as f:
        return json.load(f)["system_prompt"]

class GeminiClient:
    def __init__(self):
        # Initialize the client with the API key
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model_id = "gemma-3-27b-it"
        self.system_prompt = load_system_prompt()
        

    def generate(self, user_prompt: str, context: str = "") -> str:
        full_prompt = (
            f"{self.system_prompt}\n\n"
            f"### Context\n"
            f"{context}\n\n"
            f"### User Question\n"
            f"{user_prompt}\n\n"
            f"### Instructions\n"
            f"- Only use the context provided above.\n"
            f"- If information is missing or unclear, respond with 'I do not know'.\n"
            f"- Format your answer in Markdown. Use bullet points for lists, tables for structured data, and bold/italics for emphasis.\n"
            f"- Keep your response concise, accurate, and user-friendly.\n"
        )

        try:
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=full_prompt
            )
            return response.text
        except Exception as e:
            return f"Error: {str(e)}"