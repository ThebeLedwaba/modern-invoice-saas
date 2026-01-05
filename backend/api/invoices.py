from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List
from decimal import Decimal
from datetime import datetime

from api.deps import get_db, get_current_active_user
from models import Invoice, InvoiceItem, Client, User
from schemas import InvoiceCreate, InvoiceUpdate, InvoiceResponse

router = APIRouter(prefix="/invoices", tags=["invoices"])


def generate_invoice_number() -> str:
    """Generate a unique invoice number."""
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    return f"INV-{timestamp}"


def calculate_invoice_totals(invoice: Invoice, items: List[InvoiceItem]) -> None:
    """Calculate invoice totals based on items."""
    subtotal = sum(item.amount for item in items)
    invoice.subtotal = subtotal
    invoice.tax_amount = subtotal * (invoice.tax_rate / Decimal("100"))
    invoice.total = subtotal + invoice.tax_amount - invoice.discount_amount


@router.post("/", response_model=InvoiceResponse, status_code=status.HTTP_201_CREATED)
async def create_invoice(
    invoice_in: InvoiceCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new invoice with items."""
    # Verify client exists and belongs to user
    result = await db.execute(
        select(Client).where(
            Client.id == invoice_in.client_id,
            Client.user_id == current_user.id
        )
    )
    if not result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    # Create invoice
    invoice = Invoice(
        user_id=current_user.id,
        client_id=invoice_in.client_id,
        invoice_number=generate_invoice_number(),
        due_date=invoice_in.due_date,
        tax_rate=invoice_in.tax_rate,
        discount_amount=invoice_in.discount_amount,
        notes=invoice_in.notes,
        terms=invoice_in.terms
    )
    
    # Create invoice items
    items = []
    for item_in in invoice_in.items:
        amount = item_in.quantity * item_in.unit_price
        item = InvoiceItem(
            description=item_in.description,
            quantity=item_in.quantity,
            unit_price=item_in.unit_price,
            amount=amount
        )
        items.append(item)
    
    # Calculate totals
    calculate_invoice_totals(invoice, items)
    
    # Save to database
    db.add(invoice)
    await db.commit()
    await db.refresh(invoice)
    
    # Add items with invoice_id
    for item in items:
        item.invoice_id = invoice.id
        db.add(item)
    
    await db.commit()
    
    # Fetch complete invoice with items
    result = await db.execute(
        select(Invoice).where(Invoice.id == invoice.id)
    )
    invoice = result.scalar_one()
    
    # Fetch items
    items_result = await db.execute(
        select(InvoiceItem).where(InvoiceItem.invoice_id == invoice.id)
    )
    invoice_items = items_result.scalars().all()
    
    # Create response
    response = InvoiceResponse.model_validate(invoice)
    response.items = [InvoiceItemResponse.model_validate(item) for item in invoice_items]
    
    return response


@router.get("/", response_model=List[InvoiceResponse])
async def list_invoices(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """List all invoices for the current user."""
    from sqlalchemy.orm import selectinload
    
    # Use selectinload to eagerly load items and avoid N+1 queries
    query = (
        select(Invoice)
        .where(Invoice.user_id == current_user.id)
        .options(selectinload(Invoice.items))
        .offset(skip)
        .limit(limit)
    )
    
    result = await db.execute(query)
    invoices = result.unique().scalars().all()
    
    # Convert to response models
    response_list = []
    for invoice in invoices:
        invoice_response = InvoiceResponse.model_validate(invoice)
        if hasattr(invoice, 'items'):
            invoice_response.items = [InvoiceItemResponse.model_validate(item) for item in invoice.items]
        response_list.append(invoice_response)
    
    return response_list


@router.get("/{invoice_id}", response_model=InvoiceResponse)
async def get_invoice(
    invoice_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific invoice by ID."""
    result = await db.execute(select(Invoice).where(Invoice.id == invoice_id))
    invoice = result.scalar_one_or_none()
    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invoice not found"
        )
    
    # Fetch items
    items_result = await db.execute(
        select(InvoiceItem).where(InvoiceItem.invoice_id == invoice.id)
    )
    items = items_result.scalars().all()
    
    invoice_response = InvoiceResponse.model_validate(invoice)
    invoice_response.items = [InvoiceItemResponse.model_validate(item) for item in items]
    
    return invoice_response


@router.put("/{invoice_id}", response_model=InvoiceResponse)
async def update_invoice(
    invoice_id: int,
    invoice_in: InvoiceUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update an invoice."""
    result = await db.execute(select(Invoice).where(Invoice.id == invoice_id))
    invoice = result.scalar_one_or_none()
    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invoice not found"
        )
    
    update_data = invoice_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(invoice, field, value)
    
    db.add(invoice)
    await db.commit()
    await db.refresh(invoice)
    
    # Fetch items
    items_result = await db.execute(
        select(InvoiceItem).where(InvoiceItem.invoice_id == invoice.id)
    )
    items = items_result.scalars().all()
    
    invoice_response = InvoiceResponse.model_validate(invoice)
    invoice_response.items = [InvoiceItemResponse.model_validate(item) for item in items]
    
    return invoice_response


@router.delete("/{invoice_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_invoice(
    invoice_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Delete an invoice."""
    result = await db.execute(select(Invoice).where(Invoice.id == invoice_id))
    invoice = result.scalar_one_or_none()
    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invoice not found"
        )
    
    # Delete items first
    items_result = await db.execute(
        select(InvoiceItem).where(InvoiceItem.invoice_id == invoice.id)
    )
    items = items_result.scalars().all()
    for item in items:
        await db.delete(item)
    
    await db.delete(invoice)
    await db.commit()


# Import here to avoid circular dependency
from schemas import InvoiceItemResponse
