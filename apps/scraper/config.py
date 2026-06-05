from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    REDIS_URL: str = "redis://localhost:6379"
    API_SECRET: str = "dev-secret"

    class Config:
        env_file = ".env"


settings = Settings()
