import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings:
    PROJECT_NAME: str = "SkillSprint AI - Enterprise Onboarding Intelligence"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Storage & Paths
    BASE_DIR: Path = BASE_DIR
    DB_PATH: Path = BASE_DIR / "database" / "skillsprint_ai.db"
    DOCS_DIR: Path = BASE_DIR / "sample_documents"
    HIDDEN_DOCS_DIR: Path = BASE_DIR / "hidden_test_ready"
    REPORTS_DIR: Path = BASE_DIR / "reports"
    PROMPTS_DIR: Path = BASE_DIR / "prompt_templates"
    
    # GenAI Settings
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    DEFAULT_TEMPERATURE: float = 0.2
    MAX_RETRIES: int = 3
    RETRY_BACKOFF_FACTOR: float = 1.5
    
    # Document Limits
    MAX_FILE_SIZE_BYTES: int = 25 * 1024 * 1024  # 25MB
    ALLOWED_EXTENSIONS: set = {".pdf", ".docx", ".txt", ".md", ".csv"}
    
    # Precedence Rules Order
    POLICY_PRECEDENCE_ORDER: list = [
        "Corporate Policy",
        "Regulatory Compliance",
        "Department SOP",
        "Employee Handbook",
        "FAQ",
        "Informal Guidance"
    ]

settings = Settings()
