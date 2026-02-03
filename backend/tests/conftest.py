import os
import asyncio
from typing import AsyncGenerator, Generator
import pytest
from httpx import AsyncClient
from sqlmodel import SQLModel, create_engine, Session
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.pool import StaticPool
from faker import Faker

from main import app
from database import get_session
from models.user import User
from core.security import get_password_hash

# Use in-memory SQLite for tests
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

fake = Faker()


@pytest.fixture(scope="session")
def event_loop() -> Generator:
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="function")
async def async_engine():
    """Create a new async engine for each test."""
    engine = create_async_engine(
        TEST_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    
    yield engine
    
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)
    
    await engine.dispose()


@pytest.fixture(scope="function")
async def async_session(async_engine) -> AsyncGenerator[AsyncSession, None]:
    """Create a new async session for each test."""
    async with AsyncSession(async_engine, expire_on_commit=False) as session:
        yield session


@pytest.fixture(scope="function")
async def client(async_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """Create a test client with database session override."""
    async def override_get_session():
        yield async_session
    
    app.dependency_overrides[get_session] = override_get_session
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac
    
    app.dependency_overrides.clear()


@pytest.fixture
async def test_user(async_session: AsyncSession) -> User:
    """Create a test user."""
    user = User(
        email=fake.email(),
        username=fake.user_name(),
        full_name=fake.name(),
        hashed_password=get_password_hash("testpassword123"),
        is_active=True,
    )
    async_session.add(user)
    await async_session.commit()
    await async_session.refresh(user)
    return user


@pytest.fixture
async def authenticated_client(client: AsyncClient, test_user: User) -> tuple[AsyncClient, User]:
    """Create an authenticated test client."""
    # Login to get access token
    response = await client.post(
        "/api/auth/login",
        data={
            "username": test_user.email,
            "password": "testpassword123",
        },
    )
    assert response.status_code == 200
    token = response.json()["access_token"]
    
    # Set authorization header
    client.headers["Authorization"] = f"Bearer {token}"
    
    return client, test_user


# Factories for test data
class UserFactory:
    """Factory for creating test users."""
    
    @staticmethod
    def create_data(**kwargs):
        """Create user data for registration."""
        data = {
            "email": fake.email(),
            "username": fake.user_name(),
            "full_name": fake.name(),
            "password": "Test123!@#",
        }
        data.update(kwargs)
        return data


class ClientFactory:
    """Factory for creating test clients."""
    
    @staticmethod
    def create_data(**kwargs):
        """Create client data."""
        data = {
            "name": fake.company(),
            "email": fake.company_email(),
            "phone": fake.phone_number(),
            "address": fake.address(),
            "tax_id": fake.ssn(),
        }
        data.update(kwargs)
        return data


class InvoiceFactory:
    """Factory for creating test invoices."""
    
    @staticmethod
    def create_data(client_id: int, **kwargs):
        """Create invoice data."""
        data = {
            "client_id": client_id,
            "invoice_number": f"INV-{fake.random_int(1000, 9999)}",
            "issue_date": fake.date_this_year().isoformat(),
            "due_date": fake.date_between(start_date="today", end_date="+30d").isoformat(),
            "tax_rate": 15.0,
            "discount": 0.0,
            "notes": fake.text(max_nb_chars=200),
            "items": [
                {
                    "description": fake.bs(),
                    "quantity": fake.random_int(1, 10),
                    "unit_price": float(fake.random_int(100, 1000)),
                }
                for _ in range(fake.random_int(1, 5))
            ],
        }
        data.update(kwargs)
        return data


@pytest.fixture
def user_factory():
    """Provide user factory."""
    return UserFactory


@pytest.fixture
def client_factory():
    """Provide client factory."""
    return ClientFactory


@pytest.fixture
def invoice_factory():
    """Provide invoice factory."""
    return InvoiceFactory
