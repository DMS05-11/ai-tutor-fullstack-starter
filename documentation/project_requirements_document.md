# Project Requirements Document (PRD)

## 1. Project Overview

This project, built from the `ai-tutor-fullstack-starter` template, is a full-stack web application that enables users to sign up, verify their email addresses, and access a curated list of courses. Students can browse available courses in a protected dashboard, view detailed course content, and manage their learning journey. By leveraging a modern JavaScript/TypeScript ecosystem with Next.js, Drizzle ORM, and Radix UI components, the template accelerates development so the team can focus on business logic rather than boilerplate setup.

Our main goal is to deliver a secure, type-safe, and user-friendly AI Tutor platform. Success will be measured by:

• A smooth sign-up and email verification flow that prevents unverified access.  
• Protected API routes delivering course lists and individual course details.  
• Responsive and accessible UI components for both desktop and mobile views.  
• Fast setup and deployment using Docker locally and Vercel in production.

## 2. In-Scope vs. Out-of-Scope

In-Scope (v1):
• User authentication with email/password sign-up and sign-in  
• Custom email verification flow with token generation and verification endpoint  
• JWT-based session management and protected Next.js layouts  
• Drizzle ORM schemas for `User` (with `isVerified` flag) and `Course`  
• API routes: `/api/auth/*`, `/api/courses`, and `/api/courses/[id]`  
• Frontend pages: `/signup`, `/signin`, `/verify`, `/courses`, `/courses/[id]`  
• Reusable UI components (buttons, inputs, cards, data table)  
• Docker Compose for local PostgreSQL and environment parity  
• Basic integration and end-to-end tests (API + user flow)

Out-of-Scope (v1):
• Instructor/admin portals or course creation/editing  
• Payment processing or subscription management  
• AI-generated course content or real-time tutoring chat  
• Advanced analytics or reporting dashboards  
• Mobile-only native applications  

## 3. User Flow

A new user lands on the `/signup` page and fills out their email and password. Upon submitting, the backend creates a user in the PostgreSQL database (with `isVerified = false`), generates a unique verification token, and emails the user a link to `/verify?token=<token>`. The user clicks the link, which calls an API route to confirm the token, flips their `isVerified` flag to `true`, and redirects them to the `/signin` page with a success message.

Once verified, the user logs in at `/signin`. The login API checks credentials and `isVerified` status, then issues a JWT in an HTTP-only cookie. Upon successful login, they land on `/courses`, seeing a table of available courses fetched from `/api/courses`. Clicking any course row navigates them to `/courses/[id]`, where the course title and content show. A common header includes a “Sign Out” button, which clears the session cookie and returns the user to `/signin`.

## 4. Core Features

• **Authentication Module**: Sign-up, sign-in forms (email + password), password hashing, JWT issuance.  
• **Email Verification**: Token generation, email dispatch (via Resend or Nodemailer), verification endpoint, `isVerified` enforcement.  
• **Protected Layouts**: Next.js App Router layouts under `/courses` that redirect unauthenticated or unverified users to `/signin`.  
• **Course API**:  
  – GET `/api/courses` returns a list of courses  
  – GET `/api/courses/[id]` returns a single course by ID  
  Both endpoints require a valid JWT.  
• **Data Schemas**: Drizzle ORM definitions for `User` (id, email, password, isVerified) and `Course` (id, title, content).  
• **Frontend Components**: Reusable UI library (`components/ui`) with Tailwind + Radix: buttons, inputs, cards, data tables.  
• **Dockerized Development**: `docker-compose.yaml` to spin up PostgreSQL, environment variables loading.  
• **Testing**: Integration tests for API routes and end-to-end tests (Playwright or Cypress) covering sign-up, verify, sign-in, and course viewing.

## 5. Tech Stack & Tools

Frontend:
• Next.js 14+ (App Router)  
• React 18 & TypeScript  
• Tailwind CSS & Radix UI (accessibility-focused components)  
• Lucide React (icons) and Next Themes (dark mode)

Backend:
• Next.js API Routes (Node.js 20+)  
• Better Auth library for streamlined auth helpers  
• PostgreSQL database  
• Drizzle ORM (type-safe schema definitions and queries)

Email & Deployment:
• Email service: Resend or Nodemailer  
• Docker & Docker Compose (local dev)  
• Vercel (production hosting)

IDE & Plugins:
• VS Code with ESLint, Prettier, Drizzle VS Code extension  
• (Optional) Cursor or Windsurf for AI-assisted coding

## 6. Non-Functional Requirements

• **Performance**: API response time < 200ms under normal load; page load time < 2s.  
• **Security**:  
  – Passwords hashed with bcrypt or Argon2.  
  – JWT stored in HTTP-only, Secure cookies.  
  – Input validation on all API routes.  
  – HTTPS enforced in production.  
• **Usability & Accessibility**:  
  – WCAG 2.1 AA compliance on all forms and interactive elements.  
  – Mobile-responsive layouts.  
• **Scalability**:  
  – Dockerized services for easy horizontal scaling.  
  – Stateless API routes with JWT for session management.

## 7. Constraints & Assumptions

• Node.js 20+ and PostgreSQL 14+ environment available locally and in production.  
• Availability of Better Auth and Drizzle ORM npm packages.  
• Access to an email-sending service (API keys set in environment variables).  
• Docker installed for local development.  
• Vercel account configured for CI/CD

## 8. Known Issues & Potential Pitfalls

• **Email Deliverability**: Verification emails may land in spam; use verified sending domains and SPF/DKIM records.  
• **Token Expiration**: Ensure tokens expire (e.g., 24 hours) and handle expired-token errors gracefully.  
• **Drizzle Migrations**: Schema changes need careful versioning; keep migration files in sync.  
• **API Rate Limits**: If the email service or Vercel imposes limits, implement retry/backoff.  
• **CSS Purge**: Tailwind’s purge settings must include dynamic class names (e.g., from Radix UI) to avoid missing styles.

---
This PRD outlines all critical aspects for the AI Tutor application’s first release. Developers and AI assistants can now derive detailed technical docs (tech stack specifics, frontend guidelines, backend architecture, test plans) without ambiguity.