# Walkthrough: CVE-2025-29927 Next.js Middleware Bypass & Header Leak

This document details the mechanisms of the deployed CTF challenge, focusing on how the middleware configuration, matching logic, and header handling create a verifiable exploit scenario.

## 1. The Setup: Legit vs Exploit Flows

This challenge simulates a secure corporate environment with tiered access.

### A. Legitimate User Flow (The "Happy Path")
1.  **Unauthenticated**: You visit the home page. You see "Public Access" and "Restricted Areas". If you try to visit `/bitcoin` or `/dashboard`, you are redirected.
2.  **Authentication**: You click **Register** -> **Login**.
    *   **Register**: Creates a user in the local temporary store (`data/users.json`).
    *   **Login**: Validates credentials and issues an **HTTP-Only JWT Cookie** (`auth_token`).
3.  **Authorized Access**: `middleware.ts` verifies the JWT signature using `jose`.
    *   If valid, you (Regular User) can access `/bitcoin` to view the chart.
4.  **Denied Access**: Even with a valid User JWT, accessing `/dashboard` redirects to Home.
    *   **Reason**: The middleware blocks non-Admin users.

### B. The Exploit Flow (The Bypass)
As a hacker, your goal is to access `/dashboard`.

The vulnerability (CVE-2025-29927) is a **Middleware Cache Poisoning** attack.
Next.js treats "prefetch" requests differently—they are often cacheable. By sending a request that *looks* like a prefetch but *acts* like a navigation, we can trick the server.

**The Mechanics**:
1.  **The Trigger**: You send a request with headers that signal "This is a prefetch" (e.g., `x-middleware-prefetch: 1`).
2.  **The Poison**: Next.js processes this. Due to a bug in `v13.4.19`, it might skip the full middleware execution for this "prefetch" or cache the result of a "no-op" middleware execution.
3.  **The Victim (You)**: You then access the same URL normally. Next.js sees a "fresh" cache hit for this route (poisoned by step 1) and serves the content *without running the blocking middleware again*.

**Note for this Challenge**:
You might not see the bypass immediately with a single `curl` command because it often requires a race condition or a specific sequence of "Prefetch -> Normal Request" to trigger the cache serving mechanism. The `x-nextjs-data: 1` header mentioned earlier was a *hint* to this internal data flow, but the real exploit uses **`x-middleware-prefetch: 1`** and **`Purpose: prefetch`**.

## 3. The Exploit: Bypassing the Guard

The middleware acts as the gatekeeper:

```typescript
// middleware.ts
// Rule B: /dashboard requires 'admin' role
if (path.startsWith('/dashboard')) {
     return NextResponse.redirect(new URL('/', request.url));
}
```

The CVE typically involves manipulating internal headers or cache keys to trick Next.js into believing the request doesn't need middleware processing, or that it has already been processed.

## 4. Infrastructure Context

The single-container setup (refactored from dual containers) ensures that:
- **Nginx** (listening on port 80/9052) handles the initial ingress and sets the `x-middleware-rewrite` header (nginx/default.conf:16).
- **Next.js** (listening on 3000) receives this header.
- The `x-middleware-rewrite` header acts as a "trust token" between Nginx and Next.js, but it **does not prevent the CVE bypass** because the bypass happens before the middleware even inspects this header.

## 5. Legitimate Access Architecture

We have moved from a simulated Proxy Auth to a **Real Application Authentication** model.

### Authentication Flow
1.  **Frontend**: `/login` POSTs credentials to `/api/auth/login`.
2.  **Backend**:
    *   Verifies credentials against `data/users.json`.
    *   Signs a JWT (`HS256`) containing `{ role: 'user' }`.
    *   Sets it as an `httpOnly` cookie named `auth_token`.
3.  **Middleware**:
    *   Intercepts requests to `/bitcoin`.
    *   Uses `jose` to verify the `auth_token` signature.
    *   If valid, allows the request.

This setup proves that the CVE bypass is **critical**: it bypasses *real* cryptographic authentication and logic, not just a simple cookie check.


