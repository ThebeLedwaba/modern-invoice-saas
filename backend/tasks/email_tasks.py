from celery_app import celery_app
from services.email_service import EmailService
import logging

logger = logging.getLogger(__name__)


@celery_app.task(bind=True, max_retries=5)
def send_email(
    self,
    to_email: str,
    subject: str,
    body: str,
    html: str = None,
    attachments: list = None,
) -> bool:
    """Send an email asynchronously.
    
    Args:
        to_email: Recipient email address
        subject: Email subject
        body: Plain text body
        html: HTML body (optional)
        attachments: List of file paths to attach (optional)
        
    Returns:
        True if email sent successfully
    """
    try:
        logger.info(f"Sending email to {to_email}: {subject}")
        
        email_service = EmailService()
        email_service.send_email(
            to_email=to_email,
            subject=subject,
            body=body,
            html=html,
            attachments=attachments or [],
        )
        
        logger.info(f"Email sent successfully to {to_email}")
        return True
        
    except Exception as exc:
        logger.error(f"Error sending email to {to_email}: {exc}")
        # Exponential backoff: 1min, 2min, 4min, 8min, 16min
        countdown = 60 * (2 ** self.request.retries)
        raise self.retry(exc=exc, countdown=countdown)
