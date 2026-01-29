# Professional Car Rental

This project consists of a NestJS backend and a Next.js frontend.

## Getting Started with Docker (Recommended)

The easiest way to get the project running is using Docker Compose. This will start the backend, frontend, and a PostgreSQL database.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Installation & Setup

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd professional-car-rental
   ```

2. **Run with Docker Compose**:
   ```bash
   docker-compose up --build
   ```

3. **Access the application**:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:3001](http://localhost:3001)

### Environment Variables

The `docker-compose.yml` file comes with default environment variables for development. If you need to change them, you can modify the `environment` section in `docker-compose.yml`.

## Manual Setup

If you prefer not to use Docker, follow the instructions in the respective directories:

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
