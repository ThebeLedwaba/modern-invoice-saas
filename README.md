# Invoicing SaaS Application

A full-stack invoicing application built with React, FastAPI, PostgreSQL, and Redis. This project features a **premium, glassmorphism-inspired design system** with a focus on user experience and visual polish.

## ✨ Key Features
- **Modern UI/UX**: Custom design system using TailwindCSS v4 with glassmorphism effects, fluid animations, and a refined "Outfit" & "Plus Jakarta Sans" typography scale.
- **Robust Backend**: Fast and scalable API leveraging FastAPI and AsyncPG.
- **Live Updates**: Real-time status updates and background processing.
- **Secure Authentication**: JWT-based auth with a polished split-screen login/register flow.

## 🛠 Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for lightning-fast build tooling
- **TailwindCSS v4** for styling
- **Lucide React** for modern iconography

### Backend
- **FastAPI** (Python 3.11+)
- **SQLModel** (SQLAlchemy + Pydantic)
- **PostgreSQL** for data storage
- **Redis** for caching and celery broker
- **Celery** for background tasks (e.g., email sending, PDF generation)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Docker Desktop (for PostgreSQL and Redis)

### Setup

1. **Start the database services:**
   ```bash
   docker compose up -d
   ```

2. **Backend setup:**
   ```bash
   cd backend
   # Create virtual environment
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   # source .venv/bin/activate # Linux/Mac

   pip install -r requirements.txt
   
   # Run the server
   uvicorn main:app --reload
   ```
   Backend will run on [http://localhost:8000](http://localhost:8000) (Docs at `/docs`)

3. **Frontend setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend will run on [http://localhost:5173](http://localhost:5173)

## 📂 Project Structure

```
invoicing-app/
├── backend/           # FastAPI application
│   ├── main.py       # Application entry point
│   ├── database.py   # Database configuration
│   └── .env          # Environment variables
├── frontend/         # React application
│   ├── src/          # Source files
│   └── public/       # Static assets
└── docker-compose.yml # Database services
```

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
