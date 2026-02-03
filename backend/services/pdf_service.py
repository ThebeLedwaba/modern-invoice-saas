import os
from pathlib import Path
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class PDFService:
    """Service for generating PDF documents."""
    
    def __init__(self):
        """Initialize PDF service with template environment."""
        template_dir = Path(__file__).parent.parent / "templates"
        self.env = Environment(loader=FileSystemLoader(str(template_dir)))
        self.output_dir = Path("generated_pdfs")
        self.output_dir.mkdir(exist_ok=True)
    
    def generate_invoice_pdf(self, invoice_id: int) -> str:
        """Generate PDF for an invoice.
        
        Args:
            invoice_id: ID of the invoice
            
        Returns:
            Path to the generated PDF file
        """
        try:
            # In a real implementation, fetch invoice from database
            # For now, using placeholder data
            invoice_data = self._get_invoice_data(invoice_id)
            
            # Render HTML template
            template = self.env.get_template("invoice_template.html")
            html_content = template.render(invoice=invoice_data)
            
            # Generate PDF
            pdf_filename = f"invoice_{invoice_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
            pdf_path = self.output_dir / pdf_filename
            
            HTML(string=html_content).write_pdf(str(pdf_path))
            
            logger.info(f"Generated PDF: {pdf_path}")
            return str(pdf_path)
            
        except Exception as e:
            logger.error(f"Error generating PDF for invoice {invoice_id}: {e}")
            raise
    
    def _get_invoice_data(self, invoice_id: int) -> dict:
        """Fetch invoice data (placeholder).
        
        In production, this would query the database.
        """
        return {
            "id": invoice_id,
            "invoice_number": f"INV-{invoice_id:05d}",
            "issue_date": datetime.now().strftime("%Y-%m-%d"),
            "due_date": datetime.now().strftime("%Y-%m-%d"),
            "client": {
                "name": "Sample Client",
                "email": "client@example.com",
                "address": "123 Main St, City, Country",
            },
            "items": [
                {
                    "description": "Service 1",
                    "quantity": 2,
                    "unit_price": 100.00,
                    "total": 200.00,
                },
                {
                    "description": "Service 2",
                    "quantity": 1,
                    "unit_price": 150.00,
                    "total": 150.00,
                },
            ],
            "subtotal": 350.00,
            "tax_rate": 15.0,
            "tax_amount": 52.50,
            "discount": 0.00,
            "total_amount": 402.50,
            "notes": "Thank you for your business!",
        }
    
    def generate_report_pdf(self, report_type: str, data: dict) -> str:
        """Generate PDF report.
        
        Args:
            report_type: Type of report (e.g., 'monthly_summary', 'client_statement')
            data: Report data
            
        Returns:
            Path to the generated PDF file
        """
        try:
            template = self.env.get_template(f"{report_type}_template.html")
            html_content = template.render(**data)
            
            pdf_filename = f"{report_type}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
            pdf_path = self.output_dir / pdf_filename
            
            HTML(string=html_content).write_pdf(str(pdf_path))
            
            logger.info(f"Generated report PDF: {pdf_path}")
            return str(pdf_path)
            
        except Exception as e:
            logger.error(f"Error generating report PDF: {e}")
            raise
