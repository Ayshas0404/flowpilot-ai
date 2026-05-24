
# 🚀 FlowPilot AI

Modern AI-powered SaaS project management platform built with Next.js, Django, PostgreSQL, and production-grade cloud deployment.

FlowPilot AI streamlines startup workflows using intelligent sprint planning, Kanban-based project management, real-time analytics, and a premium dashboard experience inspired by tools like Linear, Jira, and Notion.

---

## 🌐 Live Demo

### Frontend
https://flowpilot-ai-frontend.vercel.app/

### Backend API
https://flowpilot-ai-bya4.onrender.com/
---

# ✨ Features

- 🤖 AI Sprint Planning
  - Generate intelligent workflow structures from project goals

- 📋 Kanban Project Management
  - Organize tasks with modern drag-and-drop workflows

- 📊 Real-Time Analytics
  - Interactive charts and performance insights using Recharts

- 👥 Team Collaboration
  - Manage members, roles, and workflow visibility

- 🎨 Premium SaaS UI
  - Glassmorphism-inspired interface with Framer Motion animations

- 🔐 Authentication System
  - JWT-based authentication architecture using Django REST Framework

- 📱 Fully Responsive
  - Optimized for desktop, tablet, and mobile devices

---

# 🏗 Production Architecture

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 |
| Backend | Django REST Framework |
| Database | PostgreSQL |
| Authentication | JWT |
| Hosting (Frontend) | Vercel |
| Hosting (Backend) | Render |
| CI/CD | GitHub Integration |
| Styling | Tailwind CSS + Shadcn UI |
| Charts | Recharts |
| Animation | Framer Motion |

---

# 📂 Project Structure

```bash
flowpilot-ai/
├── frontend/      # Next.js frontend
├── backend/       # Django REST API
└── README.md
````

---

# ⚙️ Local Development Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Ayshas0404/flowpilot-ai.git
cd flowpilot-ai
```

---

# 🖥 Frontend Setup

## Navigate to frontend

```bash
cd frontend
```

## Install dependencies

```bash
npm install
```

## Start development server

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:3000
```

---

# 🐍 Backend Setup

## Navigate to backend

```bash
cd backend
```

## Create virtual environment

### macOS/Linux

```bash
python -m venv venv
source venv/bin/activate
```

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

---

## Install dependencies

```bash
pip install -r requirements.txt
```

## Run migrations

```bash
python manage.py migrate
```

## Start backend server

```bash
python manage.py runserver
```

Backend runs on:

```bash
http://127.0.0.1:8000
```

---

# 🔌 API

REST API powered by Django REST Framework.

Example endpoints:

```bash
/api/projects/
/api/accounts/
/api/team/
/api/analytics/
```

---

# 🔐 Environment Variables

Create a `.env` file for both frontend and backend configurations.

Example:

## Frontend

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

## Backend

```env
SECRET_KEY=your_secret_key
DEBUG=True
DATABASE_URL=your_database_url
```

---

# ⚠️ API Keys & Secrets

For security reasons:

* API keys
* secret credentials
* production environment variables
* database credentials

are **NOT included** in this repository.

You must configure your own environment variables before running the project locally or deploying to production.

---

# 🚀 Deployment

## Frontend Deployment

Deployed on Vercel:

[https://vercel.com/](https://vercel.com/)

## Backend Deployment

Deployed on Render:

[https://render.com/](https://render.com/)

---

# 🛣 Roadmap

Planned future improvements:

* AI-powered task prioritization
* Real-time notifications
* WebSocket collaboration
* Stripe subscription integration
* Multi-tenant SaaS support
* Advanced AI analytics assistant

---

# 💡 Inspiration

FlowPilot AI was built as a modern SaaS showcase project inspired by:

* Linear
* Jira
* Notion
* Vercel Dashboard
* Stripe Dashboard

with strong focus on:

* performance
* scalability
* clean UX
* production deployment

---

# 👨‍💻 Developer

Built by Aysha S

GitHub:
[https://github.com/Ayshas0404](https://github.com/Ayshas0404)

---

# ⭐ Support

If you like this project, consider giving it a star on GitHub.

```
```
