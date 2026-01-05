from .auth import router as auth_router
from .users import router as users_router
from .clients import router as clients_router
from .invoices import router as invoices_router
from .payments import router as payments_router

__all__ = [
    "auth_router",
    "users_router",
    "clients_router",
    "invoices_router",
    "payments_router",
]
