# Backend Structure Document

This document outlines the backend setup for the AI Tutor application starter. It breaks down the architecture, database, APIs, hosting, infrastructure, security, and monitoring in clear, everyday language.

## 1. Backend Architecture

### Overview
The backend is built into the Next.js framework using its API Routes feature. Instead of running a separate Express server, we use Next.js to handle both page rendering and API endpoints. This keeps frontend and backend code together in one project, simplifying development and deployment.

### Key Patterns and Frameworks
- Next.js API Routes: each file under `app/api/` becomes a REST endpoint.  
- Better Auth library: handles password hashing, JWT sessions, and middleware for protecting routes.  
- Drizzle ORM: provides type-safe database models and queries in TypeScript.  
- Docker Compose: simplifies local database setup.

### Scalability, Maintainability, Performance
- Serverless Functions: Next.js API routes run as isolated functions that can auto-scale.  
- Type Safety: Drizzle ORM and TypeScript prevent many runtime errors, making code easier to maintain.  
- Shared Codebase: co-locating frontend and backend reduces context switching and duplication.

## 2. Database Management

### Database Technology
- Type: SQL (relational)  
- System: PostgreSQL

### Data Handling Practices
- Local Development: PostgreSQL runs in a Docker container via `docker-compose.yml`.  
- Migrations: Drizzle’s migration CLI applies schema changes.  
- Connection Pooling: Managed by the Next.js serverless environment or a pooling library if needed.  
- Environment Variables: Database URL, credentials, and secret keys are stored in `.env.local` (gitignored).

## 3. Database Schema

### Human-Readable Overview
1. **Users Table**  
   - id: unique identifier  
   - email: user’s email address  
   - password_hash: hashed password  
   - is_verified: has the user confirmed their email?  
   - created_at: timestamp of account creation  

2. **Courses Table**  
   - id: unique course identifier  
   - title: name of the course  
   - content: full course content (e.g., markdown or HTML)  
   - created_at: timestamp when course was added  

### SQL Schema (PostgreSQL)
```sql
-- Users table
drop table if exists users;
create table users (
  id serial primary key,
  email varchar(255) not null unique,
  password_hash varchar(255) not null,
  is_verified boolean not null default false,
  created_at timestamptz not null default now()
);

-- Courses table
drop table if exists courses;
create table courses (
  id serial primary key,
  title varchar(255) not null,
  content text not null,
  created_at timestamptz not null default now()
);
```  

## 4. API Design and Endpoints

We follow a RESTful approach. All API routes live under `app/api/`.

### Authentication Endpoints
- **POST /api/auth/signup**  
  Purpose: Register a new user.  
  Flow: validates input → hashes password → creates user record → generates email token → sends verification email.

- **POST /api/auth/signin**  
  Purpose: Log in an existing user.  
  Flow: checks credentials → verifies `is_verified` flag → returns JWT in a cookie or response.

- **GET /api/auth/verify?token=…**  
  Purpose: Confirm a user’s email.  
  Flow: looks up token → sets `is_verified` to true → redirects to login or dashboard.

### Course Endpoints (Protected)
- **GET /api/courses**  
  Purpose: List all courses available to the user.  
  Protection: requires valid JWT.

- **GET /api/courses/:id**  
  Purpose: Retrieve a single course by ID.  
  Protection: requires valid JWT.

### How Frontend Calls the APIs
1. Frontend pages use `fetch` (or React Query/SWR) to call these endpoints.  
2. Protected pages wrap their `layout.tsx` with an auth check and redirect to `/sign-in` if needed.  

## 5. Hosting Solutions

### Local Development
- Docker Compose: runs PostgreSQL with one command.  
- Environment files: `.env.local` contains database URL and secret keys.

### Production Deployment
- Provider: Vercel  
- Setup: Connect GitHub repo → automatic builds on push → environment variables configured in Vercel dashboard.  

Benefits:
- Auto-scaling serverless functions for API routes.  
- Built-in global CDN for static assets and API caching.  
- Zero-config HTTPS and global edge network.

## 6. Infrastructure Components

- **Load Balancer & Scaling:** Handled by Vercel’s serverless platform.  
- **CDN:** Vercel’s global edge network caches static assets and can cache API responses.  
- **Caching (Optional):** You can layer Redis or Vercel Edge Config if you need request-level caching for course data.  
- **Docker Compose:** Simplifies spinning up local services (Postgres) for development.

These components work together to deliver fast responses, handle traffic spikes, and ensure a smooth user experience.

## 7. Security Measures

- Passwords are hashed (via Better Auth, which uses bcrypt or Argon2).  
- JWT-based sessions are stored in secure, HTTP-only cookies.  
- Email verification ensures only valid users can log in.  
- All traffic in production is served over HTTPS.  
- Environment variables keep secrets out of source control.  
- Input validation and error handling return proper HTTP codes (400, 401, 404).

## 8. Monitoring and Maintenance

- **Logging:** Vercel provides real-time logs for API routes and build events.  
- **Error Tracking:** Integrate Sentry (or a similar service) to capture runtime exceptions in serverless functions.  
- **Performance Metrics:** Vercel Analytics or Google Cloud Monitoring can track function cold starts, latency, and error rates.  
- **Database Health:** Use PgAdmin or a managed PostgreSQL dashboard to monitor connections, slow queries, and storage.  
- **Maintenance Strategies:**  
  - Automated migrations: run Drizzle migrations on each deploy.  
  - Scheduled dependency updates via tools like Dependabot.  
  - Regular backups of the production database (if self-hosted).

## 9. Conclusion and Overall Backend Summary

This backend setup combines a modern JavaScript stack—Next.js API Routes, Better Auth, Drizzle ORM, and PostgreSQL—deployed on Vercel’s serverless infrastructure. It provides:

- A clear, type-safe data layer for users and courses.  
- Built-in authentication, email verification, and protected routes.  
- RESTful endpoints that the React frontend can consume directly.  
- Automatic scaling, global CDN, and zero-config SSL via Vercel.  
- Monitoring, logging, and maintenance practices to keep the system reliable.

By following this structure, any developer—regardless of deep technical background—can understand and work with the AI Tutor’s backend, ensuring long-term scalability, security, and performance.