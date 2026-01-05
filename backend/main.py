
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import init_db
from api import auth_router, users_router, clients_router, invoices_router, payments_router
from core.config import settings
from core.logging import get_logger

logger = get_logger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables
    logger.info("Starting application initialization")
    await init_db()
    logger.info("Database initialized successfully")
    yield
    # Shutdown: Clean up resources if needed
    logger.info("Shutting down application")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan,
    debug=settings.DEBUG
)

# Configure CORS with settings
logger.info(f"Configuring CORS with origins: {settings.CORS_ORIGINS}")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_CREDENTIALS,
    allow_methods=settings.CORS_METHODS,
    allow_headers=settings.CORS_HEADERS,
)

# Include routers
app.include_router(auth_router, prefix="/api")
app.include_router(users_router, prefix="/api")
app.include_router(clients_router, prefix="/api")
app.include_router(invoices_router, prefix="/api")
app.include_router(payments_router, prefix="/api")

@app.get("/")
def read_root():
    logger.debug("Root endpoint accessed")
    return {"message": "Welcome to the Invoicing SaaS API"}

@app.get("/health")
def health_check():
    logger.debug("Health check endpoint accessed")
    return {
        "status": "ok",
        "environment": settings.ENVIRONMENT,
        "version": settings.VERSION,
    }
