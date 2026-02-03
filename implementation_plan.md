# Implementation Plan: Auth Flow & Bitcoin Feature

## Goal
Implement a register/login flow, a `/bitcoin` feature for regular users, and role-based access control (RBAC). Document the flow in `walkthrough.md`.

## Features
1.  **Home Page**: Update to mention `/dashboard` (Admin) and `/bitcoin` (User) protection. Links to Register/Login.
2.  **Auth Pages**: Simple `/register` and `/login` (using local state/cookies for simplicity to simulate "Proxy Auth" success).
    *   *Note: In a real "Proxy Auth" scenario, Nginx handles this. Here, we'll simulate the "authenticated state" by setting a cookie that the middleware respects, treating logged-in users as "Regular Users".*
3.  **Bitcoin Page**: Fetch 7-day Bitcoin history from a public API (e.g., CoinGecko or CoinDesk) and chart it (Recharts or Chart.js). Handle API failure gracefully.
4.  **Middleware Update**:
    *   Allow access to `/bitcoin` if authenticated.
    *   Block `/dashboard` even if authenticated as "Regular User" (Admin only).
5.  **Walkthrough Update**: Detailed explanation of the "Legitimate" flow vs. the "Exploit" flow.

## Implementation Steps

### 1. Frontend Pages
- [NEW] `app/login/page.tsx`: Simulates login, sets `auth_role=user` cookie.
- [NEW] `app/register/page.tsx`: Simulates registration (just redirects to login).
- [MODIFY] `app/page.tsx`: "Landing Page" with status links.
- [NEW] `app/bitcoin/page.tsx`: Fetches data and renders chart.

### 2. Middleware Logic `middleware.ts`
- Check for `auth_role` cookie.
- If `auth_role=user`: Allow `/bitcoin`. Deny `/dashboard`.
- If no cookie: Deny both.
- *Blind Spot remains*: The CVE bypass will still work for `/dashboard` regardless of this logic because it skips the middleware entirely.

### 3. Dependencies
- Install `recharts` for the chart.

### 4. Walkthrough
- Document the flows.
