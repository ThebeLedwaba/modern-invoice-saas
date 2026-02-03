import pytest
from httpx import AsyncClient
from faker import Faker

fake = Faker()


@pytest.mark.asyncio
class TestAuthEndpoints:
    """Test authentication endpoints."""
    
    async def test_register_success(self, client: AsyncClient, user_factory):
        """Test successful user registration."""
        user_data = user_factory.create_data()
        
        response = await client.post("/api/auth/register", json=user_data)
        
        assert response.status_code == 201
        data = response.json()
        assert data["email"] == user_data["email"]
        assert data["username"] == user_data["username"]
        assert "id" in data
        assert "hashed_password" not in data
    
    async def test_register_duplicate_email(self, client: AsyncClient, test_user, user_factory):
        """Test registration with duplicate email fails."""
        user_data = user_factory.create_data(email=test_user.email)
        
        response = await client.post("/api/auth/register", json=user_data)
        
        assert response.status_code == 400
        assert "already registered" in response.json()["detail"].lower()
    
    async def test_register_weak_password(self, client: AsyncClient, user_factory):
        """Test registration with weak password fails."""
        user_data = user_factory.create_data(password="weak")
        
        response = await client.post("/api/auth/register", json=user_data)
        
        assert response.status_code == 422
    
    async def test_login_success(self, client: AsyncClient, test_user):
        """Test successful login."""
        response = await client.post(
            "/api/auth/login",
            data={
                "username": test_user.email,
                "password": "testpassword123",
            },
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"
    
    async def test_login_invalid_credentials(self, client: AsyncClient, test_user):
        """Test login with invalid credentials fails."""
        response = await client.post(
            "/api/auth/login",
            data={
                "username": test_user.email,
                "password": "wrongpassword",
            },
        )
        
        assert response.status_code == 401
        assert "incorrect" in response.json()["detail"].lower()
    
    async def test_login_nonexistent_user(self, client: AsyncClient):
        """Test login with nonexistent user fails."""
        response = await client.post(
            "/api/auth/login",
            data={
                "username": "nonexistent@example.com",
                "password": "password123",
            },
        )
        
        assert response.status_code == 401
    
    async def test_refresh_token(self, client: AsyncClient, test_user):
        """Test token refresh."""
        # First login
        login_response = await client.post(
            "/api/auth/login",
            data={
                "username": test_user.email,
                "password": "testpassword123",
            },
        )
        refresh_token = login_response.json()["refresh_token"]
        
        # Refresh token
        response = await client.post(
            "/api/auth/refresh",
            json={"refresh_token": refresh_token},
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
    
    async def test_refresh_invalid_token(self, client: AsyncClient):
        """Test refresh with invalid token fails."""
        response = await client.post(
            "/api/auth/refresh",
            json={"refresh_token": "invalid_token"},
        )
        
        assert response.status_code == 401


@pytest.mark.asyncio
class TestProtectedEndpoints:
    """Test protected endpoint access."""
    
    async def test_access_protected_without_token(self, client: AsyncClient):
        """Test accessing protected endpoint without token fails."""
        response = await client.get("/api/users/me")
        
        assert response.status_code == 401
    
    async def test_access_protected_with_token(self, authenticated_client):
        """Test accessing protected endpoint with valid token."""
        client, user = authenticated_client
        
        response = await client.get("/api/users/me")
        
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == user.email
        assert data["id"] == user.id
    
    async def test_access_protected_with_invalid_token(self, client: AsyncClient):
        """Test accessing protected endpoint with invalid token fails."""
        client.headers["Authorization"] = "Bearer invalid_token"
        
        response = await client.get("/api/users/me")
        
        assert response.status_code == 401
