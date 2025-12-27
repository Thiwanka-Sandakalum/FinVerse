
import os
from dotenv import load_dotenv
load_dotenv()


class Settings:
    PRODUCT_DB_URL = os.getenv("PRODUCT_DB_URL")
    CHAT_DB_URL = os.getenv("CHAT_DB_URL")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    ENV = os.getenv("ENV", "dev")

settings = Settings()
