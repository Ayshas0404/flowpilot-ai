# FlowPilot AI

FlowPilot AI is a modern, AI-powered SaaS project management platform built for startups and fast-moving teams. It streamlines your workflow by combining Kanban boards, dynamic analytics, and AI-driven sprint planning into one beautiful, lightning-fast dashboard.

![FlowPilot UI Mockup](https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop) *(Placeholder for real screenshot)*

## 🚀 Features

- **AI Sprint Planner**: Input a goal and let the AI generate a complete sprint structure.
- **Kanban Task Board**: Drag-and-drop task management.
- **Real-time Analytics**: Beautiful charts built with Recharts.
- **Glassmorphism UI**: Premium dark mode design with Framer Motion animations.
- **Team Collaboration**: Manage members, roles, and status.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend (Prepared for scale)
- **Framework**: Django REST Framework
- **Database**: SQLite (local) / PostgreSQL (production via Supabase)
- **Auth**: JWT Authentication

## 💻 Running Locally

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000)

### Backend Setup (Optional for UI demo)

The frontend currently uses a robust mock data layer for instant demonstration purposes. To run the full Django backend:

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Activate virtual environment:
   ```bash
   source venv/bin/activate
   ```
3. Run migrations:
   ```bash
   python manage.py migrate
   ```
4. Start the server:
   ```bash
   python manage.py runserver
   ```

## 🌐 Deployment

- **Frontend**: Optimized for [Vercel](https://vercel.com). Just connect the GitHub repository and deploy the `frontend/` folder.
- **Backend**: Ready for [Render](https://render.com) using the included `render.yaml` configuration.

## 🎨 Design Inspiration
The UI draws inspiration from top-tier tools like Linear, Vercel, and Stripe, focusing heavily on subtle gradients, deep dark themes, and buttery smooth micro-interactions.

---
*Developed for Portfolio & Showcase*
