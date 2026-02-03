# Invoicing SaaS Application 💼

[![FastAPI](https://img.shields.io/badge/FastAPI-0.128+-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.2+-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791?logo=postgresql)](https://www.postgresql.org)
[![Redis](https://img.shields.io/badge/Redis-7+-DC382D?logo=redis)](https://redis.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4+-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python)](https://www.python.org)

A **premium**, full-stack invoicing SaaS application featuring a sophisticated **glassmorphism** design system, real-time processing, and enterprise-grade architecture.  
Perfect for freelancers, agencies, and businesses who want professional, beautiful, and reliable invoicing.

## ✨ Key Features

### 🎨 Premium User Experience
- Glassmorphism Design System — modern translucent layers, backdrop blur & depth effects
- Smooth Animated Transitions — powered by Framer Motion
- Professional Typography — Outfit + Plus Jakarta Sans font family
- Dark/Light Themes — fully customizable with seamless transitions

### 📊 Powerful Invoicing
- Dynamic Invoice Generation — create, customize & export (PDF, HTML)
- Real-time Calculations — taxes, discounts, multi-currency support
- Client Management — central database + payment & communication history
- Recurring Invoices — flexible scheduling & automation

### ⚡ Technical Highlights
- Real-time Updates — WebSocket-powered invoice status notifications
- Background Jobs — Celery + Redis for PDF generation, emails & reports
- Rate Limiting — Redis-backed API protection
- Secure Authentication — JWT with refresh tokens

## 🏗️ Architecture Overview

**Backend** (FastAPI)
- FastAPI — blazing fast async Python framework + auto OpenAPI docs
- SQLModel — type-safe ORM (SQLAlchemy + Pydantic)
- PostgreSQL — relational DB with full-text search
- Redis — caching, sessions & Celery broker
- Celery — powerful background task processing
- Pydantic v2 — modern data validation & settings

**Frontend** (React)
- React 19.2+ — latest concurrent rendering features
- TypeScript — full type safety
- Tailwind CSS v4+ — utility-first + custom design tokens
- Vite — lightning-fast dev experience & builds
- Lucide React — beautiful, consistent icons
- TanStack Query — intelligent server-state management
- Zustand — lightweight & performant state management

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ & pnpm/npm/yarn
- Python 3.11+
- Docker Desktop (recommended for services)
- Git

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/invoicing-saas.git
   cd invoicing-saas
   ```

2. **Start infrastructure (PostgreSQL + Redis)**
   ```bash
   docker compose up -d
   docker compose ps          # verify services are healthy
   ```

3. **Backend setup**
   ```bash
   cd backend
   python -m venv .venv
   # Windows:    .venv\Scripts\activate
   # Linux/Mac:  source .venv/bin/activate

   pip install -r requirements.txt
   cp .env.example .env       # edit with your secrets!
   alembic upgrade head
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

4. **Frontend setup**
   ```bash
   cd ../frontend
   npm install                # or pnpm/yarn
   cp .env.example .env.local # edit VITE_API_URL etc.
   npm run dev                # or pnpm dev
   ```

5. **Access the app**
   - Frontend → http://localhost:5173
   - API → http://localhost:8000
   - Swagger Docs → http://localhost:8000/docs
   - Admin (if enabled) → http://localhost:8000/admin


⚙️ Configuration
Backend (.env)
env# Application
APP_NAME="Invoicing SaaS"
ENVIRONMENT=development
DEBUG=true
SECRET_KEY=super-secret-change-me

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/invoicing_db

# Redis
REDIS_URL=redis://localhost:6379/0

# JWT
JWT_SECRET_KEY=another-very-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
Frontend (.env.local)
envVITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
VITE_APP_NAME="InvoicePro"
📚 API Reference (main endpoints)
Auth

POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh

Invoices

GET/POST /api/invoices
GET/PUT/DELETE /api/invoices/{id}
POST /api/invoices/{id}/send
GET /api/invoices/{id}/pdf

Clients • Reports — similar RESTful pattern
🧪 Testing
Bash# Backend
cd backend && pytest -v

# Frontend
cd ../frontend && pnpm test

# E2E
pnpm run test:e2e
🚀 Deployment Notes

Docker → use docker-compose.prod.yml (recommended)
Backend prod → Gunicorn + Uvicorn workers
Frontend → pnpm build → serve with nginx/Caddy/Netlify/Vercel

🤝 Contributing

Fork & branch (git checkout -b feature/amazing-thing)
Commit clearly (git commit -m 'Add recurring invoice preview')
Push & open PR
Make sure tests pass & docs are updated

📄 License
MIT License — see LICENSE file
🆘 Support & Contact

Author: Thebe Ledwaba
Email: thebeledwaba@gmail.com
Issues: GitHub Issues


Professional Invoicing. Beautiful Design. Enterprise Performance.
Streamline your billing with a premium SaaS experience.
