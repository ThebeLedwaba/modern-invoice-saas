import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from pathlib import Path
from jinja2 import Environment, FileSystemLoader
from typing import List
import logging

logger = logging.getLogger(__name__)


class EmailService:
    """Service for sending emails."""
    
    def __init__(self):
        """Initialize email service with SMTP configuration."""
        self.smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_user = os.getenv("SMTP_USER", "")        self.smtp_password = os.getenv("SMTP_PASSWORD", "")
        self.from_email = os.getenv("SMTP_FROM_EMAIL", self.smtp_user)
        self.from_name = os.getenv("SMTP_FROM_NAME", "Invoicing SaaS")
        
        # Setup template environment
        template_dir = Path(__file__).parent.parent / "templates" / "email"
        self.env = Environment(loader=FileSystemLoader(str(template_dir)))
    
    def send_email(
        self,
        to_email: str,
        subject: str,
        body: str,
        html: str = None,
        attachments: List[str] = None,
    ) -> bool:
        """Send an email.
        
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
            msg = MIMEMultipart("alternative")
            msg["From"] = f"{self.from_name} <{self.from_email}>"
            msg["To"] = to_email
            msg["Subject"] = subject
            
            # Add plain text part
            msg.attach(MIMEText(body, "plain"))
            
            # Add HTML part if provided
            if html:
                msg.attach(MIMEText(html, "html"))
            
            # Add attachments if provided
            if attachments:
                for file_path in attachments:
                    self._attach_file(msg, file_path)
            
            # Send email
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                if self.smtp_user and self.smtp_password:
                    server.login(self.smtp_user, self.smtp_password)
                server.send_message(msg)
            
            logger.info(f"Email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            logger.error(f"Error sending email to {to_email}: {e}")
            raise
    
    def send_invoice_email(
        self,
        invoice_id: int,
        recipient_email: str,
        pdf_path: str,
    ) -> bool:
        """Send invoice email with PDF attachment.
        
        Args:
            invoice_id: ID of the invoice
            recipient_email: Email address to send to
            pdf_path: Path to the invoice PDF
            
        Returns:
            True if email sent successfully
        """
        try:
            # Render email template
            template = self.env.get_template("invoice_sent.html")
            html_content = template.render(
                invoice_number=f"INV-{invoice_id:05d}",
                invoice_id=invoice_id,
            )
            
            plain_text = f"""
            Your invoice #INV-{invoice_id:05d} is attached.
            
            Thank you for your business!
            
            Best regards,
            {self.from_name}
            """
            
            return self.send_email(
                to_email=recipient_email,
                subject=f"Invoice #INV-{invoice_id:05d}",
                body=plain_text,
                html=html_content,
                attachments=[pdf_path],
            )
            
        except Exception as e:
            logger.error(f"Error sending invoice email: {e}")
            raise
    
    def send_welcome_email(self, user_email: str, user_name: str) -> bool:
        """Send welcome email to new user.
        
        Args:
            user_email: User's email address
            user_name: User's name
            
        Returns:
            True if email sent successfully
        """
        try:
            template = self.env.get_template("welcome.html")
            html_content = template.render(user_name=user_name)
            
            plain_text = f"""
            Welcome to {self.from_name}, {user_name}!
            
            We're excited to have you on board.
            
            Get started by creating your first invoice.
            
            Best regards,
            The {self.from_name} Team
            """
            
            return self.send_email(
                to_email=user_email,
                subject=f"Welcome to {self.from_name}!",
                body=plain_text,
                html=html_content,
            )
            
        except Exception as e:
            logger.error(f"Error sending welcome email: {e}")
            raise
    
    def _attach_file(self, msg: MIMEMultipart, file_path: str):
        """Attach a file to the email message.
        
        Args:
            msg: Email message object
            file_path: Path to file to attach
        """
        file_path = Path(file_path)
        
        with open(file_path, "rb") as f:
            attachment = MIMEApplication(f.read(), _subtype=file_path.suffix[1:])
            attachment.add_header(
                "Content-Disposition",
                "attachment",
                filename=file_path.name,
            )
            msg.attach(attachment)
