# Security Guidelines for ai-tutor-fullstack-starter

This document outlines the security requirements and best practices for the `ai-tutor-fullstack-starter` repository, ensuring a secure foundation for building the AI Tutor application. It follows industry-standard principles—Security by Design, Least Privilege, Defense in Depth, and Secure Defaults—across authentication, input handling, data protection, API security, web application hygiene, infrastructure hardening, and dependency management.

---

## 1. Authentication & Access Control

### 1.1 Robust Authentication
- Use **bcrypt** or **Argon2** with unique salts for password hashing. Do not use MD5 or SHA-1.  
- Enforce strong password policies: minimum 12 characters, mixed case, digits, symbols, and block commonly used passwords.
- Store session identifiers or JWTs in secure, **HttpOnly**, **Secure**, and **SameSite=Strict** cookies to mitigate XSS and CSRF.

### 1.2 Email Verification & Account Activation
- On signup, generate a cryptographically secure verification token (e.g., `crypto.randomBytes`) and expire it after a short window (e.g., 24 hours).  
- Send verification links via a trusted email service (e.g., Resend, SendGrid).  
- Reject login attempts for users whose `isVerified` flag is `false`, returning HTTP 401 with a generic message.

### 1.3 JWT Security & Session Management
- Use strong signing algorithms (e.g., `HS256` or `RS256`). Disallow `none` or weak algorithms.  
- Validate token signature, expiration (`exp`), and intended audience (`aud`).  
- Set a reasonable token lifetime (e.g., 15 minutes) and implement refresh tokens securely (rotated on use, stored in HttpOnly cookies).  
- Implement idle and absolute session timeouts. Invalidate tokens on logout.

### 1.4 Role-Based Access Control (RBAC)
- Define roles (e.g., `student`, `instructor`, `admin`) and permissions in a central policy module.  
- Enforce authorization checks on every API route: only allow listing/viewing courses for `student`, course creation for `instructor`, etc.
- Fail closed: default to deny if role or permission cannot be determined.

### 1.5 Optional Multi-Factor Authentication (MFA)
- Offer TOTP-based MFA (e.g., Google Authenticator) for instructors or privileged accounts.  
- Securely store MFA secrets in a vault or encrypted database column.  
- Require MFA verification for sensitive actions (password changes, role elevation).

---

## 2. Input Handling & Output Encoding

### 2.1 Server-Side Validation
- Never rely solely on client-side checks. Validate all incoming JSON, route parameters, and query strings server-side.
- Use schema validation libraries (e.g., **Zod**, **Yup**) to enforce field types, lengths, and allowed values.

### 2.2 Prevent Injection Attacks
- Use Drizzle ORM’s parameterized queries—avoid string interpolation in SQL statements.
- Sanitize inputs that will be used in any shell or system calls.

### 2.3 Mitigate Cross-Site Scripting (XSS)
- Apply context-aware encoding when rendering user content in React (`dangerouslySetInnerHTML` only with sanitized HTML).  
- Use a strict **Content Security Policy** (CSP) header to restrict script sources.

### 2.4 CSRF Protection
- Use anti-CSRF tokens for all state-changing endpoints (POST/PUT/DELETE).  
- Alternatively, adopt **SameSite=Strict** cookies combined with double-submit tokens.

### 2.5 Secure File Uploads (if applicable)
- Validate file type, size, and content signatures.  
- Store files outside the webroot with randomized filenames.  
- Scan uploads for malware.

---

## 3. Data Protection & Privacy

### 3.1 Encryption in Transit and at Rest
- Enforce HTTPS/TLS 1.2+ for all client–server communications.  
- Use AES-256 or stronger for any data encryption at rest (e.g., student notes).  

### 3.2 Secrets Management
- Do **not** hardcode credentials or API keys. Use environment variables loaded from a secure vault (HashiCorp Vault, AWS Secrets Manager, etc.).  
- Rotate secrets periodically and upon suspected compromise.

### 3.3 Prevent Information Leakage
- Sanitize error messages: return generic errors (e.g., “Invalid credentials”) and log detailed errors internally.  
- Mask sensitive fields (passwords, tokens) in logs and audit trails.

### 3.4 PII Handling & Compliance
- Minimize PII storage: store only what’s necessary (email, display name).  
- Provide user data deletion endpoints to comply with GDPR/CCPA.

---

## 4. API & Service Security

### 4.1 Secure API Endpoints
- Enforce HTTPS for all API routes in production.  
- Use correct HTTP methods: GET for reads, POST for creates, PUT/PATCH for updates, DELETE for removals.

### 4.2 Rate Limiting & Throttling
- Implement rate limiting per IP and per user (e.g., 100 requests/min) to mitigate brute-force and DoS attacks.

### 4.3 CORS Policies
- Restrict `Access-Control-Allow-Origin` to trusted domains (e.g., your frontend URL).  
- Avoid wildcard (`*`) in production.

### 4.4 API Versioning
- Prefix routes with `/api/v1/` to safely introduce breaking changes in the future.

### 4.5 Least Privilege in Service Accounts
- Database user credentials used by the app should have only SELECT/INSERT/UPDATE/DELETE on necessary tables—avoid admin or schema privileges.

---

## 5. Web Application Security Hygiene

### 5.1 Security Headers
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`  
- `Content-Security-Policy`: restrict scripts, styles, frames.  
- `X-Frame-Options: DENY`  
- `X-Content-Type-Options: nosniff`  
- `Referrer-Policy: no-referrer-when-downgrade`

### 5.2 Secure Cookies
- Set `HttpOnly`, `Secure`, and `SameSite=Strict` on session and CSRF cookies.

### 5.3 Clickjacking & Subresource Integrity
- Use SRI for any third-party scripts.  
- Enforce `frame-ancestors 'none'` or `DENY` to prevent embedding.

---

## 6. Infrastructure & Configuration Management

### 6.1 Server Hardening
- Disable unused services and ports on application servers.  
- Run Node.js as a non-root user.

### 6.2 TLS Configuration
- Use TLS 1.2+ only. Disable SSLv2/3, TLS 1.0/1.1.  
- Prefer strong cipher suites (e.g., ECDHE with AES-GCM).

### 6.3 Environment Segregation
- Separate dev, staging, and production configurations.  
- Ensure debug modes, verbose logging, and health endpoints are disabled or protected in production.

### 6.4 File System Permissions
- Grant least privilege on files and directories; restrict write access to only what is necessary.

---

## 7. Dependency & Supply Chain Management

### 7.1 Secure Dependencies
- Vet all NPM packages for maintenance status and known vulnerabilities.  
- Use lockfiles (`package-lock.json`) to freeze transitive dependency versions.

### 7.2 Vulnerability Scanning
- Integrate automated SCA tools (e.g., GitHub Dependabot, Snyk) in your CI pipeline.  
- Address critical/high CVEs before merging pull requests.

### 7.3 Minimizing Footprint
- Remove unused packages and dev dependencies from production builds.

---

## 8. Monitoring, Logging & Incident Response

- Centralize logs (e.g., ELK stack, Datadog) with role-based access controls.  
- Mask or omit PII in logs.  
- Implement real-time alerts for anomalous behavior (e.g., repeated auth failures, spike in API errors).
- Prepare an incident response plan: roles, communication channels, and post-mortem procedures.

---

By adhering to these guidelines, the `ai-tutor-fullstack-starter` codebase will embody a secure, resilient architecture that protects user data, enforces least privilege, and ensures compliance with modern security standards.