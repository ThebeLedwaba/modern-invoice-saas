from datetime import datetime
from typing import Optional
from decimal import Decimal
from pydantic import BaseModel
from models.payment import PaymentMethod


class PaymentBase(BaseModel):
    invoice_id: int
    amount: Decimal
    payment_method: PaymentMethod
    reference_number: Optional[str] = None
    notes: Optional[str] = None


class PaymentCreate(PaymentBase):
    pass


class PaymentUpdate(BaseModel):
    amount: Optional[Decimal] = None
    payment_method: Optional[PaymentMethod] = None
    payment_date: Optional[datetime] = None
    reference_number: Optional[str] = None
    notes: Optional[str] = None


class PaymentResponse(PaymentBase):
    id: int
    payment_date: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
