# Professional Car Rental Platform

A modern, full-stack car rental platform designed for a premium user experience.

## 🌟 Overview

This project is a monorepo-style structure containing a **Next.js Frontend** and a **NestJS Backend**. It is designed with clean architecture, scalability, and premium design principles in mind.

-   **Frontend:** `frontend/` - Next.js 14, TypeScript, CSS Modules.
-   **Backend:** `backend/` - NestJS, Prisma, PostgreSQL.

## 🚀 Quick Start (Docker)

The easiest way to run the entire stack is with Docker Compose.

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd professional-car-rental
    ```

2.  **Run with Docker Compose:**
    ```bash
    docker-compose up --build
    ```

3.  **Access the application:**
    -   **Frontend:** [http://localhost:3000](http://localhost:3000)
    -   **Backend API:** [http://localhost:3001](http://localhost:3001)

## 🔧 Manual Setup

If you prefer running services individually:

### Backend
```bash
cd backend
npm install
# Configure .env
npx prisma migrate dev
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🏗️ Architecture

-   **Frontend:** Component-based architecture with separated concerns (UI, Features, Layouts).
-   **Backend:** Modular architecture ensuring loose coupling and high cohesion.

## 🤝 Contribution

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes.
4.  Push to the branch.
5.  Open a Pull Request.
