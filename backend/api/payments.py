from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List

from api.deps import get_db
from models import Payment, Invoice
from schemas import PaymentCreate, PaymentUpdate, PaymentResponse

router = APIRouter(prefix="/payments", tags=["payments"])


@router.post("/", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED)
async def create_payment(
    payment_in: PaymentCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new payment."""
    # Verify invoice exists
    result = await db.execute(select(Invoice).where(Invoice.id == payment_in.invoice_id))
    if not result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invoice not found"
        )
    
    payment = Payment(**payment_in.model_dump())
    db.add(payment)
    await db.commit()
    await db.refresh(payment)
    return payment


@router.get("/", response_model=List[PaymentResponse])
async def list_payments(
    skip: int = 0,
    limit: int = 100,
    invoice_id: int = None,
    db: AsyncSession = Depends(get_db)
):
    """List all payments."""
    query = select(Payment).offset(skip).limit(limit)
    if invoice_id:
        query = query.where(Payment.invoice_id == invoice_id)
    
    result = await db.execute(query)
    payments = result.scalars().all()
    return payments


@router.get("/{payment_id}", response_model=PaymentResponse)
async def get_payment(
    payment_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific payment by ID."""
    result = await db.execute(select(Payment).where(Payment.id == payment_id))
    payment = result.scalar_one_or_none()
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )
    return payment


@router.put("/{payment_id}", response_model=PaymentResponse)
async def update_payment(
    payment_id: int,
    payment_in: PaymentUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update a payment."""
    result = await db.execute(select(Payment).where(Payment.id == payment_id))
    payment = result.scalar_one_or_none()
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )
    
    update_data = payment_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(payment, field, value)
    
    db.add(payment)
    await db.commit()
    await db.refresh(payment)
    return payment


@router.delete("/{payment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_payment(
    payment_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Delete a payment."""
    result = await db.execute(select(Payment).where(Payment.id == payment_id))
    payment = result.scalar_one_or_none()
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )
    
    await db.delete(payment)
    await db.commit()
