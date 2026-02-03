import pytest
from httpx import AsyncClient
from datetime import datetime, timedelta


@pytest.mark.asyncio
class TestInvoiceCRUD:
    """Test invoice CRUD operations."""
    
    async def test_create_invoice(self, authenticated_client, client_factory, invoice_factory):
        """Test creating a new invoice."""
        client_obj, user = authenticated_client
        
        # First create a client
        client_data = client_factory.create_data()
        client_response = await client_obj.post("/api/clients", json=client_data)
        assert client_response.status_code == 201
        created_client = client_response.json()
        
        # Create invoice
        invoice_data = invoice_factory.create_data(client_id=created_client["id"])
        response = await client_obj.post("/api/invoices", json=invoice_data)
        
        assert response.status_code == 201
        data = response.json()
        assert data["invoice_number"] == invoice_data["invoice_number"]
        assert data["client_id"] == created_client["id"]
        assert "id" in data
        assert "total_amount" in data
    
    async def test_get_invoices(self, authenticated_client):
        """Test listing all invoices."""
        client, user = authenticated_client
        
        response = await client.get("/api/invoices")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    async def test_get_invoice_by_id(self, authenticated_client, client_factory, invoice_factory):
        """Test getting a specific invoice."""
        client_obj, user = authenticated_client
        
        # Create client and invoice
        client_data = client_factory.create_data()
        client_response = await client_obj.post("/api/clients", json=client_data)
        created_client = client_response.json()
        
        invoice_data = invoice_factory.create_data(client_id=created_client["id"])
        create_response = await client_obj.post("/api/invoices", json=invoice_data)
        created_invoice = create_response.json()
        
        # Get invoice
        response = await client_obj.get(f"/api/invoices/{created_invoice['id']}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == created_invoice["id"]
        assert data["invoice_number"] == invoice_data["invoice_number"]
    
    async def test_update_invoice(self, authenticated_client, client_factory, invoice_factory):
        """Test updating an invoice."""
        client_obj, user = authenticated_client
        
        # Create client and invoice
        client_data = client_factory.create_data()
        client_response = await client_obj.post("/api/clients", json=client_data)
        created_client = client_response.json()
        
        invoice_data = invoice_factory.create_data(client_id=created_client["id"])
        create_response = await client_obj.post("/api/invoices", json=invoice_data)
        created_invoice = create_response.json()
        
        # Update invoice
        update_data = {"notes": "Updated notes"}
        response = await client_obj.put(
            f"/api/invoices/{created_invoice['id']}", 
            json=update_data
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["notes"] == "Updated notes"
    
    async def test_delete_invoice(self, authenticated_client, client_factory, invoice_factory):
        """Test deleting an invoice."""
        client_obj, user = authenticated_client
        
        # Create client and invoice
        client_data = client_factory.create_data()
        client_response = await client_obj.post("/api/clients", json=client_data)
        created_client = client_response.json()
        
        invoice_data = invoice_factory.create_data(client_id=created_client["id"])
        create_response = await client_obj.post("/api/invoices", json=invoice_data)
        created_invoice = create_response.json()
        
        # Delete invoice
        response = await client_obj.delete(f"/api/invoices/{created_invoice['id']}")
        
        assert response.status_code == 200
        
        # Verify deletion
        get_response = await client_obj.get(f"/api/invoices/{created_invoice['id']}")
        assert get_response.status_code == 404


@pytest.mark.asyncio
class TestInvoiceValidation:
    """Test invoice validation."""
    
    async def test_create_invoice_invalid_date(self, authenticated_client, client_factory):
        """Test creating invoice with due date before issue date fails."""
        client_obj, user = authenticated_client
        
        # Create client
        client_data = client_factory.create_data()
        client_response = await client_obj.post("/api/clients", json=client_data)
        created_client = client_response.json()
        
        # Create invoice with invalid dates
        invoice_data = {
            "client_id": created_client["id"],
            "invoice_number": "INV-001",
            "issue_date": datetime.now().isoformat(),
            "due_date": (datetime.now() - timedelta(days=5)).isoformat(),
            "items": [
                {
                    "description": "Test item",
                    "quantity": 1,
                    "unit_price": 100.0,
                }
            ],
        }
        
        response = await client_obj.post("/api/invoices", json=invoice_data)
        
        assert response.status_code == 422
    
    async def test_create_invoice_empty_items(self, authenticated_client, client_factory):
        """Test creating invoice with no items fails."""
        client_obj, user = authenticated_client
        
        # Create client
        client_data = client_factory.create_data()
        client_response = await client_obj.post("/api/clients", json=client_data)
        created_client = client_response.json()
        
        # Create invoice with no items
        invoice_data = {
            "client_id": created_client["id"],
            "invoice_number": "INV-002",
            "issue_date": datetime.now().isoformat(),
            "due_date": (datetime.now() + timedelta(days=30)).isoformat(),
            "items": [],
        }
        
        response = await client_obj.post("/api/invoices", json=invoice_data)
        
        assert response.status_code == 422


@pytest.mark.asyncio
class TestInvoiceCalculations:
    """Test invoice amount calculations."""
    
    async def test_invoice_total_calculation(self, authenticated_client, client_factory):
        """Test invoice total is calculated correctly."""
        client_obj, user = authenticated_client
        
        # Create client
        client_data = client_factory.create_data()
        client_response = await client_obj.post("/api/clients", json=client_data)
        created_client = client_response.json()
        
        # Create invoice
        invoice_data = {
            "client_id": created_client["id"],
            "invoice_number": "INV-003",
            "issue_date": datetime.now().isoformat(),
            "due_date": (datetime.now() + timedelta(days=30)).isoformat(),
            "tax_rate": 15.0,
            "discount": 10.0,
            "items": [
                {"description": "Item 1", "quantity": 2, "unit_price": 100.0},
                {"description": "Item 2", "quantity": 1, "unit_price": 50.0},
            ],
        }
        
        response = await client_obj.post("/api/invoices", json=invoice_data)
        
        assert response.status_code == 201
        data = response.json()
        
        # Subtotal: (2 * 100) + (1 * 50) = 250
        # After discount: 250 - 10 = 240
        # After tax: 240 + (240 * 0.15) = 276
        expected_total = 276.0
        
        assert abs(data["total_amount"] - expected_total) < 0.01
