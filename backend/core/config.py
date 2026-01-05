import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    
    # JWT Settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-super-secret-key-change-this-in-production-minimum-32-chars")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "43200"))  # 30 days
    
    # App Settings
    PROJECT_NAME: str = os.getenv("API_TITLE", "Invoicing SaaS API")
    VERSION: str = os.getenv("API_VERSION", "1.0.0")
    
    # Database
    USE_SQLITE: bool = os.getenv("USE_SQLITE", "true").lower() == "true"
    DB_HOST: str = os.getenv("DB_HOST", "localhost")
    DB_USER: str = os.getenv("DB_USER", "postgres")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "password")
    DB_NAME: str = os.getenv("DB_NAME", "invoicing_db")
    
    # CORS
    CORS_ORIGINS: list = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")
    CORS_CREDENTIALS: bool = os.getenv("CORS_CREDENTIALS", "true").lower() == "true"
    CORS_METHODS: list = os.getenv("CORS_METHODS", "*").split(",") if os.getenv("CORS_METHODS") != "*" else ["*"]
    CORS_HEADERS: list = os.getenv("CORS_HEADERS", "*").split(",") if os.getenv("CORS_HEADERS") != "*" else ["*"]


settings = Settings()
