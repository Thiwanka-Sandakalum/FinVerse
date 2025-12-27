from google import genai
from core.config import settings

class GeminiClient:
    def __init__(self, system_prompt: str = "You are a helpful assistant."):
        # Initialize the client with the API key
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model_id = "gemini-2.5-flash-lite"
        self.system_prompt = system_prompt

    def generate(self, user_prompt: str, context: str = "") -> str:
        # Construct the prompt with context
        full_prompt = f"Context:\n{context}\n\nUser: {user_prompt}"
        
        try:
            # In the new SDK, system_instruction is passed in the generate call 
            # or configured in a config object
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=full_prompt,
                config={
                    "system_instruction": self.system_prompt
                }
            )
            return response.text
        except Exception as e:
            return f"Error: {str(e)}"