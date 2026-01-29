# Professional Car Rental - Frontend

A premium, high-performance car rental frontend built with Next.js 14, React, and TypeScript.

## 🚀 Tech Stack

-   **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** CSS Modules with [Google Fonts](https://fonts.google.com/) (Inter, Outfit)
-   **Icons:** [Lucide React](https://lucide.dev/)
-   **Forms:** [React Hook Form](https://react-hook-form.com/)
-   **Notifications:** [Sonner](https://sonner.emilkowal.ski/)
-   **HTTP Client:** [Axios](https://axios-http.com/)

## 📂 Project Structure

```bash
src/
├── app/
│   ├── (public)/          # Publicly accessible routes (Home, Auth)
│   ├── (dashboard)/       # Protected user dashboard routes
│   ├── globals.css        # Global styles and variables
│   └── layout.tsx         # Root layout
├── components/
│   ├── common/            # Domain-specific shared components (e.g. CarCard)
│   ├── features/          # Feature-specific components (e.g. Home sections)
│   ├── layout/            # Layout components (Header, Footer)
│   └── ui/                # Generic UI components (Buttons, Inputs)
├── lib/
│   └── api.ts             # Centralized Axios instance
```

## ✨ Features

-   **Premium UI Design:** Dark/Light mode sleek aesthetics with glassmorphism and animations.
-   **Responsive Layout:** Fully optimized for mobile, tablet, and desktop.
-   **Authentication:** Secure Login, Signup, and Password Reset flows.
-   **Smooth Interactions:** Global transitions for interactive elements.
-   **Modular Architecture:** Component-based structure for scalability.

## 🛠️ Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

3.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📝 Scripts

-   `dev`: Runs the development server.
-   `build`: Builds the application for production.
-   `start`: Starts the production server.
-   `lint`: Runs ESLint checks.
