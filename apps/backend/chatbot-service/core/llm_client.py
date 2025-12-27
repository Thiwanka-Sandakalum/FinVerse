from google import genai
from core.config import settings

class GeminiClient:
    def __init__(self, system_prompt: str = "You are a helpful assistant."):
        # Initialize the client with the API key
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model_id = "gemini-2.5-flash"
        self.system_prompt = system_prompt

    def generate(self, user_prompt: str, context: str = "", system_prompt: str = None) -> str:
        # Use provided system_prompt or default to instance's
        sys_prompt = system_prompt if system_prompt is not None else self.system_prompt
        # Construct the prompt with context
        full_prompt = f"Context:\n{context}\n\nUser: {user_prompt}"

        try:
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=full_prompt,
                config={
                    "system_instruction": sys_prompt
                }
            )
            return response.text
        except Exception as e:
            return f"Error: {str(e)}"