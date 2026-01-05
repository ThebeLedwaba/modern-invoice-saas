from datetime import datetime
from typing import Optional
from decimal import Decimal
from sqlmodel import Field, SQLModel
from enum import Enum


class PaymentMethod(str, Enum):
    CASH = "cash"
    CREDIT_CARD = "credit_card"
    BANK_TRANSFER = "bank_transfer"
    CHECK = "check"
    PAYPAL = "paypal"
    STRIPE = "stripe"
    OTHER = "other"


class Payment(SQLModel, table=True):
    __tablename__ = "payments"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    invoice_id: int = Field(foreign_key="invoices.id")
    amount: Decimal = Field(max_digits=10, decimal_places=2)
    payment_method: PaymentMethod
    payment_date: datetime = Field(default_factory=datetime.utcnow)
    reference_number: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
