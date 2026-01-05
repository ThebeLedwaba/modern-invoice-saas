from datetime import datetime, date
from typing import Optional, List
from decimal import Decimal
from pydantic import BaseModel
from models.invoice import InvoiceStatus


class InvoiceItemBase(BaseModel):
    description: str
    quantity: Decimal
    unit_price: Decimal


class InvoiceItemCreate(InvoiceItemBase):
    pass


class InvoiceItemResponse(InvoiceItemBase):
    id: int
    invoice_id: int
    amount: Decimal
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class InvoiceBase(BaseModel):
    client_id: int
    due_date: date
    tax_rate: Optional[Decimal] = Decimal("0.00")
    discount_amount: Optional[Decimal] = Decimal("0.00")
    notes: Optional[str] = None
    terms: Optional[str] = None


class InvoiceCreate(InvoiceBase):
    items: List[InvoiceItemCreate]


class InvoiceUpdate(BaseModel):
    client_id: Optional[int] = None
    status: Optional[InvoiceStatus] = None
    due_date: Optional[date] = None
    tax_rate: Optional[Decimal] = None
    discount_amount: Optional[Decimal] = None
    notes: Optional[str] = None
    terms: Optional[str] = None


class InvoiceResponse(InvoiceBase):
    id: int
    user_id: int
    invoice_number: str
    status: InvoiceStatus
    issue_date: date
    subtotal: Decimal
    tax_amount: Decimal
    total: Decimal
    created_at: datetime
    updated_at: datetime
    items: List[InvoiceItemResponse] = []

    class Config:
        from_attributes = True
