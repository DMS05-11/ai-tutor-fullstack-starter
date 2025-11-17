# Tech Stack Document

This document outlines the technology choices made for the AI Tutor application starter template, `ai-tutor-fullstack-starter`. It explains each component in everyday language and clarifies how they work together to build a modern, secure, and maintainable web application.

## Frontend Technologies

- **Next.js 14+ (App Router)**
  - Provides file-based routing and server-side rendering out of the box.
  - Lets us define pages and nested layouts easily (e.g., `/signup`, `/courses`, `/courses/[id]`).
  - Improves performance with automatic code splitting and static optimization.

- **React 18 & TypeScript**
  - React handles user interface components and state management in a declarative way.
  - TypeScript adds strong typing to catch errors early, both in your code and in your data structures.

- **Tailwind CSS**
  - A utility-first CSS framework for rapid styling without leaving your HTML/JSX.
  - Ensures consistent spacing, colors, and typography across the app.

- **Radix UI**
  - A library of unstyled, accessible UI primitives (dialogs, menus, tabs).
  - Works hand-in-hand with Tailwind to build custom, accessible components quickly.

- **Lucide React & Next Themes**
  - Lucide React supplies a collection of crisp, open-source icons.
  - Next Themes makes it simple to add dark-mode support and theme switching.

- **Reusable UI Component Library**
  - Pre-built components (buttons, inputs, cards, data tables) live in `components/ui/`.
  - Promotes visual consistency and speeds up development.

## Backend Technologies

- **Next.js API Routes**
  - Allows creation of serverless endpoints inside the same project.
  - Keeps frontend and backend code in one place (`app/api/` directory).

- **Better Auth**
  - Simplifies authentication setup with JWT-based sessions and secure cookies.
  - Handles password hashing and credential validation.
  - Easily extended to enforce email verification (`isVerified` flag).

- **PostgreSQL & Drizzle ORM**
  - PostgreSQL: A reliable, open-source relational database for structured data.
  - Drizzle ORM: A TypeScript-first ORM that ensures type-safe database queries.
  - Schemas live in `db/schema/` (e.g., `auth.ts`, `courses.ts`), guaranteeing consistency from database to frontend.

## Infrastructure and Deployment

- **Version Control: Git (e.g., GitHub)**
  - Tracks code changes, enables collaboration, and supports pull-request workflows.

- **Docker & Docker Compose**
  - Provides a one-command setup for local development (PostgreSQL container, environment variables).
  - Ensures every team member has an identical local environment.

- **Vercel**
  - Optimized hosting for Next.js apps.
  - Automatic CI/CD: pushes to main branch trigger deployments.
  - Environment variable management and preview deployments for feature branches.

- **CI/CD Pipelines**
  - Linting (ESLint) and formatting (Prettier) run on every pull request to enforce code quality.
  - Optional testing steps (Jest for unit tests, Playwright/Cypress for end-to-end) can be integrated.

## Third-Party Integrations

- **Email Service (e.g., Resend or Nodemailer)**
  - Sends verification emails with secure tokens after signup.
  - Delivers password-reset or notification emails in the future.

- **JWT Tokens & Cookies**  
  - Managed by Better Auth for secure, stateless sessions.

- **Analytics (Optional)**
  - Tools like Google Analytics or Plausible can be added to track user behavior, course progress, and engagement.

## Security and Performance Considerations

- **Authentication & Authorization**
  - All protected routes (`/courses`, `/api/courses`) enforce session checks via Better Auth.
  - Unverified users are blocked from login until they confirm their email.

- **Data Validation**
  - API routes validate incoming data and return clear error codes (400 for bad input, 401 for unauthorized, 404 for not found).

- **Secure Password Handling**
  - Passwords are hashed before saving in PostgreSQL.
  - No raw passwords stored or logged.

- **Performance Optimizations**
  - Next.js does automatic code splitting and image optimization.
  - Server-side rendering (SSR) and caching strategies can be added per page.
  - Type-safe Drizzle queries reduce runtime errors and unexpected database calls.

## Conclusion and Overall Tech Stack Summary

This tech stack aligns closely with the AI Tutor application’s goals:

- **Rapid UI development** through Next.js, React, Tailwind CSS, and Radix UI.
- **Robust backend** powered by Next.js API routes, Better Auth, and PostgreSQL with Drizzle ORM.
- **Smooth developer experience** using TypeScript, Docker, and Vercel’s CI/CD.
- **Extensible integrations** for email verification, analytics, and more.

By combining these technologies, the starter kit offers a cohesive, type-safe, and performant foundation, allowing your team to focus on building course content, AI-driven tutoring logic, and delightful student experiences without worrying about boilerplate setup.