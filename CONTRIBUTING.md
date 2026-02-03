# Contributing to Invoicing SaaS

First off, thank you for considering contributing to this project! 🎉

## Code of Conduct

Be respectful and constructive in all interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, browser, versions)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case** - why is this enhancement useful?
- **Proposed solution** (if you have one)

### Pull Requests

1. **Fork** the repository
2. **Create a branch** from `develop`:
   ```bash
   git checkout -b feature/amazing-feature develop
   ```
3. **Make your changes** following our coding standards
4. **Test your changes**:
   ```bash
   # Backend
   cd backend && pytest
   
   # Frontend
   cd frontend && npm test
   ```
5. **Commit** with clear messages:
   ```bash
   git commit -m "feat: add amazing feature"
   ```
6. **Push** to your fork:
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request** to the `develop` branch

## Development Setup

### Prerequisites

- Node.js 20+
- Python 3.11+
- Docker Desktop
- Git

### Initial Setup

```bash
# Clone your fork
git clone https://github.com/your-username/invoicing-saas.git
cd invoicing-saas

# Set up pre-commit hooks
pip install pre-commit
pre-commit install

# Backend setup
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt -r requirements-dev.txt
cp .env.example .env

# Frontend setup
cd ../frontend
npm install
cp .env.example .env.local

# Start services
docker compose up -d
```

## Coding Standards

### Python (Backend)

- Follow **PEP 8**
- Use **type hints**
- Maximum line length: **100 characters**
- Use **Black** for formatting
- Use **isort** for import sorting
- Code must pass **flake8** and **mypy**

```bash
# Format code
black .
isort .

# Check code quality
flake8 .
mypy .
```

### TypeScript/React (Frontend)

- Use **TypeScript** for type safety
- Follow **React best practices**
- Use **functional components** with hooks
- Use **Prettier** for formatting
- Code must pass **ESLint**

```bash
# Format code
npm run format

# Lint code
npm run lint
```

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: add invoice PDF export
fix: correct tax calculation
docs: update API documentation
```

## Testing

### Backend Tests

```bash
cd backend
pytest -v
pytest --cov=. --cov-report=html  # With coverage
```

### Frontend Tests

```bash
cd frontend
npm test
npm run test:coverage  # With coverage
```

### E2E Tests

```bash
npm run test:e2e
```

## Project Structure

```
.
├── backend/               # FastAPI backend
│   ├── api/              # API endpoints
│   ├── core/             # Core functionality
│   ├── models/           # Database models
│   ├── schemas/          # Pydantic schemas
│   ├── services/         # Business logic
│   ├── tasks/            # Celery tasks
│   └── tests/            # Backend tests
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom hooks
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── types/       # TypeScript types
│   └── tests/           # Frontend tests
└── docs/                # Documentation
```

## Need Help?

- Check the [documentation](./docs)
- Open an issue for questions
- Email: thebeledwaba@gmail.com

## Recognition

Contributors will be recognized in our README and release notes!

Thank you for contributing! 💙
