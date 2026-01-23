from venv import logger
from google import genai
from core.config import settings


class GeminiEmbeddingClient:
    """
    Gemini Embedding Client using Google Generative AI embeddings API.
    """
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model_id = "models/embedding-001" 
    def embed(self, text: str):
        try:
            response = self.client.models.embed_content(
        model="gemini-embedding-001",
        contents=[text])
            
            if hasattr(response, 'embeddings') and len(response.embeddings) > 0:
                return response.embeddings[0].values
            elif hasattr(response, 'embedding'):
                return response.embedding
            else:
                raise RuntimeError("Gemini embedding API: Unexpected response structure")
        except Exception as e:
            raise RuntimeError(f"Gemini embedding API error: {e}")
