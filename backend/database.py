from sqlmodel import SQLModel, create_engine
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Import all models to ensure they are registered with SQLModel
from models import User, Client, Invoice, InvoiceItem, Payment

# Database URL
# Use SQLite for local development if Docker is not available
USE_SQLITE = os.getenv("USE_SQLITE", "true").lower() == "true"

if USE_SQLITE:
    # SQLite for local development (no Docker required)
    DATABASE_URL = "sqlite+aiosqlite:///./invoicing.db"
else:
    # PostgreSQL (requires Docker)
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DATABASE_URL = f"postgresql+asyncpg://postgres:password@{DB_HOST}:5432/invoicing_db"

engine = create_async_engine(DATABASE_URL, echo=True, future=True)

async def init_db():
    async with engine.begin() as conn:
        # await conn.run_sync(SQLModel.metadata.drop_all)
        await conn.run_sync(SQLModel.metadata.create_all)

async def get_session() -> AsyncSession:
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session() as session:
        yield session
