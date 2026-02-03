from celery import Task
from celery_app import celery_app
from services.pdf_service import PDFService
from services.email_service import EmailService
from database import get_session
from models.invoice import Invoice
from sqlmodel import select
import logging

logger = logging.getLogger(__name__)


class DatabaseTask(Task):
    """Base task with database session support."""
    
    _session = None
    
    @property
    def session(self):
        """Get database session."""
        if self._session is None:
            self._session = get_session()
        return self._session


@celery_app.task(bind=True, base=DatabaseTask, max_retries=3)
def generate_invoice_pdf(self, invoice_id: int) -> str:
    """Generate PDF for an invoice.
    
    Args:
        invoice_id: ID of the invoice
        
    Returns:
        Path to the generated PDF file
    """
    try:
        logger.info(f"Generating PDF for invoice {invoice_id}")
        
        # This would fetch the invoice and generate PDF
        # For now, returning a placeholder
        pdf_service = PDFService()
        pdf_path = pdf_service.generate_invoice_pdf(invoice_id)
        
        logger.info(f"PDF generated successfully: {pdf_path}")
        return pdf_path
        
    except Exception as exc:
        logger.error(f"Error generating PDF for invoice {invoice_id}: {exc}")
        raise self.retry(exc=exc, countdown=60)


@celery_app.task(bind=True, max_retries=3)
def send_invoice_email(self, invoice_id: int, recipient_email: str) -> bool:
    """Send invoice via email.
    
    Args:
        invoice_id: ID of the invoice
        recipient_email: Email address to send to
        
    Returns:
        True if email sent successfully
    """
    try:
        logger.info(f"Sending invoice {invoice_id} to {recipient_email}")
        
        email_service = EmailService()
        
        # Generate PDF first
        pdf_path = generate_invoice_pdf.delay(invoice_id).get()
        
        # Send email with PDF attachment
        email_service.send_invoice_email(
            invoice_id=invoice_id,
            recipient_email=recipient_email,
            pdf_path=pdf_path,
        )
        
        logger.info(f"Invoice email sent successfully to {recipient_email}")
        return True
        
    except Exception as exc:
        logger.error(f"Error sending invoice email: {exc}")
        raise self.retry(exc=exc, countdown=120)


@celery_app.task
def process_recurring_invoices() -> dict:
    """Process recurring invoices that are due.
    
    This task should be scheduled to run daily.
    
    Returns:
        Dictionary with processing statistics
    """
    try:
        logger.info("Processing recurring invoices")
        
        # This would:
        # 1. Find all recurring invoice templates
        # 2. Check which ones are due
        # 3. Create new invoices from templates
        # 4. Send notifications
        
        processed = 0
        errors = 0
        
        # Placeholder implementation
        logger.info(f"Processed {processed} recurring invoices, {errors} errors")
        
        return {
            "processed": processed,
            "errors": errors,
        }
        
    except Exception as exc:
        logger.error(f"Error processing recurring invoices: {exc}")
        raise
