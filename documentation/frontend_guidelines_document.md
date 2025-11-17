# Frontend Guideline Document

This document outlines the structure, design principles, and technologies powering the frontend of the AI Tutor application. It’s written in clear, everyday language so anyone—even without a deep technical background—can understand how things fit together and why.

## 1. Frontend Architecture

**Overview**
- We build our interface with **Next.js (v14+)** using the **App Router**, backed by **React 18** and **TypeScript**. This combination gives us server-side rendering (SSR), file-based routing, and strong type checks at every step.
- For styling and UI building blocks, we use **Tailwind CSS** plus **Radix UI** components and **Lucide React** for icons. **Next Themes** handles light/dark mode.
- Authentication flows are powered by **better-auth**, integrated via Next.js API routes.

**Why this setup?**
- **Scalability**: File-based routing and server components let us add pages and features without global conflicts. Tailwind’s utility classes keep naming consistent as the app grows.
- **Maintainability**: TypeScript and Drizzle ORM (on the backend) enforce type-safe data contracts, ensuring that what the backend sends matches what the frontend expects.
- **Performance**: Next.js streaming, server rendering, and code splitting mean fast initial loads and snappy navigation.

## 2. Design Principles

1. **Usability:** Every element is placed for clarity. Forms have clear labels and inline feedback. Buttons follow a primary/secondary hierarchy.
2. **Accessibility:** All interactive components (buttons, inputs, dialogs) meet WCAG standards. Radix UI ensures proper ARIA tags. We test with keyboard navigation and screen readers.
3. **Responsiveness:** Layouts adapt from mobile to desktop. We use Tailwind’s responsive utilities (`sm:`, `md:`, `lg:`) so breakpoints are consistent.
4. **Consistency:** A shared design system (colors, spacing, typography) means every page feels part of the same whole.

## 3. Styling and Theming

**Styling Approach**
- Utility-first CSS with **Tailwind CSS**. We avoid ad-hoc CSS files by composing small, reusable classes.
- **Radix UI** provides unstyled, accessible primitives (menus, dialogs, tooltips) that we style with Tailwind.

**Theming**
- Light and dark themes are toggled via **Next Themes**. We define CSS variables for colors and switch between them automatically.

**Visual Style**
- Modern, flat design with subtle depth (shadows, rounded corners).
- Glassmorphism elements (semi-transparent cards) on dashboards to highlight content.

**Color Palette**
- Primary: `#4F46E5` (indigo-600)
- Secondary: `#9333EA` (purple-600)
- Accent: `#10B981` (emerald-500)
- Background (light): `#F9FAFB`; (dark): `#111827`
- Surface (cards, panels light): `#FFFFFF`; (dark): `#1F2937`
- Text (light): `#111827`; (dark): `#F9FAFB`
- Error: `#EF4444`; Warning: `#F59E0B`; Success: `#10B981`

**Typography**
- Font family: **Inter**, a modern sans-serif optimized for screens.
- Headings: bold, clear scale (e.g., 2rem → 1.5rem → 1.25rem).
- Body text: 1rem, line-height 1.5 for readability.

## 4. Component Structure

**Organization**
- **`app/` folder**: Each route (page) lives here. Nested folders map to nested URLs.
- **`components/ui/`**: Shared UI primitives (Button, Input, Card, DataTable).
- **`components/`** (top-level): Feature-specific components like `CourseList` or `CourseViewer`.
- **Barrel files** (index.ts): Export related components in a single place to simplify imports.

**Reuse and Composition**
- Build small, focused components (e.g., `TextInput`) and compose them into larger ones (e.g., `SignupForm`).
- One component per file, named after its default export.

**Benefits**
- **Maintainability**: Fix a bug in one component, and every page that uses it is updated.
- **Clarity**: File paths reflect functionality: `components/ui/button.tsx` is clearly where the button lives.

## 5. State Management

**Local State**
- For form inputs and UI toggles, we rely on React’s `useState` and `useReducer` in client components.

**Server Data**
- We fetch course lists and details using **SWR** (or **React Query**) for caching, request deduplication, and automatic re-validation.
- Authentication status is stored in cookies (via `better-auth`) and exposed to React via a custom hook (`useAuth`) that reads the session.

**Global State**
- Theme toggles and user session info are managed via React Context, wrapped around the root layout.

## 6. Routing and Navigation

**File-based Routing** (Next.js App Router)
- `app/sign-up/page.tsx` → `/sign-up`
- `app/sign-in/page.tsx` → `/sign-in`
- `app/courses/layout.tsx` enforces authentication for all `/courses/*` routes.
- `app/courses/page.tsx` → Course list
- `app/courses/[id]/page.tsx` → Course detail (dynamic route)

**Client-side Navigation**
- Use Next.js `<Link>` component for internal links.
- Use `useRouter()` for programmatic redirects (e.g., after login).

**Protected Routes**
- In the `/courses/layout.tsx`, we check the user session on the server or client. If unauthenticated, we redirect to `/sign-in`.

## 7. Performance Optimization

**Built-in Next.js Features**
- **Server Components**: Keep heavy logic on the server and send minimal JavaScript to the client.
- **Streaming & Incremental Rendering**: Faster Time to First Byte (TTFB) and progressive hydration.
- **Image Optimization**: Use `next/image` for automatic resizing and format selection.

**Code Splitting & Lazy Loading**
- Dynamic import (`next/dynamic`) for rarely used components (e.g., rich text editor).

**Asset Optimization**
- Purge unused CSS via Tailwind’s JIT mode.
- Preload critical fonts (`Inter`) and preconnect to external services (email, analytics).

## 8. Testing and Quality Assurance

**Unit Testing**
- **Jest** + **React Testing Library**: Test individual components and hooks (e.g., `useAuth`).

**Integration Testing**
- **MSW (Mock Service Worker)**: Mock API routes in tests to simulate real backend interactions.

**End-to-End (E2E)**
- **Playwright** or **Cypress**: Automate user flows:
  - Sign up → receive verification → verify → sign in → view course list → open course detail.

**Linting & Formatting**
- **ESLint** with Next.js and TypeScript plugins ensures code consistency.
- **Prettier** auto-formats code on save.

**Continuous Integration**
- Run tests, lint, and type-checks on every pull request (e.g., via GitHub Actions).

## 9. Conclusion and Overall Frontend Summary

This guideline lays out how we build, style, and maintain the frontend of our AI Tutor:
- A **Next.js + React + TypeScript** foundation for fast, scalable pages.
- **Tailwind CSS**, **Radix UI**, and **Inter** for a modern, consistent look and feel.
- **Component-based structure** for reuse and clarity.
- **SWR/React Query** and **React Context** for smooth state handling.
- **App Router** and nested layouts for simple, protected navigation.
- Built-in performance features plus targeted optimizations for peak speed.
- A full testing suite (unit, integration, E2E) to guarantee reliability.

By following these guidelines, any developer can confidently add features, fix bugs, or scale the AI Tutor frontend, all while keeping the app fast, accessible, and consistent with our design principles.  

Happy coding!  
— The Frontend Team