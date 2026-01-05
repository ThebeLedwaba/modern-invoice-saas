from datetime import datetime, date
from typing import Optional, List
from decimal import Decimal
from sqlmodel import Field, SQLModel, Relationship
from enum import Enum


class InvoiceStatus(str, Enum):
    DRAFT = "draft"
    SENT = "sent"
    PAID = "paid"
    OVERDUE = "overdue"
    CANCELLED = "cancelled"


class Invoice(SQLModel, table=True):
    __tablename__ = "invoices"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    client_id: int = Field(foreign_key="clients.id", index=True)
    invoice_number: str = Field(unique=True, index=True)
    status: InvoiceStatus = Field(default=InvoiceStatus.DRAFT, index=True)
    issue_date: date = Field(default_factory=date.today)
    due_date: date
    subtotal: Decimal = Field(default=Decimal("0.00"), max_digits=10, decimal_places=2)
    tax_rate: Decimal = Field(default=Decimal("0.00"), max_digits=5, decimal_places=2)
    tax_amount: Decimal = Field(default=Decimal("0.00"), max_digits=10, decimal_places=2)
    discount_amount: Decimal = Field(default=Decimal("0.00"), max_digits=10, decimal_places=2)
    total: Decimal = Field(default=Decimal("0.00"), max_digits=10, decimal_places=2)
    notes: Optional[str] = None
    terms: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    items: List["InvoiceItem"] = Relationship(back_populates="invoice", cascade_delete=True)


class InvoiceItem(SQLModel, table=True):
    __tablename__ = "invoice_items"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    invoice_id: int = Field(foreign_key="invoices.id", index=True)
    description: str
    quantity: Decimal = Field(default=Decimal("1.00"), max_digits=10, decimal_places=2)
    unit_price: Decimal = Field(max_digits=10, decimal_places=2)
    amount: Decimal = Field(max_digits=10, decimal_places=2)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    invoice: Optional[Invoice] = Relationship(back_populates="items")
