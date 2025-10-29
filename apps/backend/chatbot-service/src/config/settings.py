from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PORT: int = 8085
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"
    DATABASE_HOST: str
    DATABASE_PORT: int = 3306
    DATABASE_USER: str
    DATABASE_PASSWORD: str
    DATABASE_NAME: str
    DATABASE_SSL_MODE: str = "REQUIRED"
    GOOGLE_API_KEY: str

    class Config:
        env_file = ".env"
        extra = "ignore"
