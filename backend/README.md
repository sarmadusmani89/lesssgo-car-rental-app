# Professional Car Rental - Backend

A scalable, modular REST API built with NestJS and PostgreSQL.

## 🚀 Tech Stack

-   **Framework:** [NestJS](https://nestjs.com/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Database:** PostgreSQL
-   **ORM:** [Prisma](https://www.prisma.io/)
-   **Authentication:** JWT (JSON Web Tokens)
-   **Email:** Nodemailer

## 📂 Architecture

The application follows a **Modular Monolith** architecture, where each feature is encapsulated in its own module.

```bash
src/
├── auth/            # Authentication logic (Login, Signup, JWT)
├── user/            # User management
├── email/           # Email sending service
├── prisma/          # Database connection module
└── main.ts          # Application entry point
```

## ✨ Features

-   **JWT Authentication:** Secure user sessions.
-   **Role-Based Access Control:** Setup for future admin/user roles.
-   **Email Notifications:** Verification and password reset emails.
-   **Data Validation:** Strict DTO validation using `class-validator`.

## 🛠️ Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Set up Database:**
    Ensure you have PostgreSQL running and update `.env` with your database credentials.
    ```bash
    npx prisma migrate dev
    ```

3.  **Run the development server:**
    ```bash
    npm run start:dev
    ```

4.  The API will be available at [http://localhost:3001](http://localhost:3001).

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
JWT_SECRET="your-secret-key"
FRONTEND_URL="http://localhost:3000"
# Add Email Configuration
```
