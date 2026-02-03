# Proxy Authentication Integration

This document clarifies the "Proxy Auth integration" message found on the Registration page and details the architectural pattern used "under the hood".

## 1. What "Proxy Auth Integration" Means

In a high-security Enterprise Environment (simulated here), individual applications often **do not handle user registration or authentication directly**. 

Instead, a centralized **Access Gateway** (Reverse Proxy) handles:
1.  **Identity Management**: Verifying who the user is (SSO, LDAP, AD).
2.  **Access Control**: Deciding if the user *can* access the app.
3.  **Registration**: New users register with the Central Identity Provider (e.g., Okta, Keycloak), not the specific app.

The message *"Registration is open via Proxy Auth integration"* on `/register` means: 
> "You cannot register *here* in this application database. You must have an account provisioned by the overarching network security provider."

## 2. Under the Hood: The Header Handshake

When "Proxy Auth" is active, the Application (Next.js) relies entirely on the Proxy (Nginx) to tell it who the user is. This is done via **Trust Headers**.

### The Nginx Configuration (The Sender)
In `nginx/default.conf` (Line 16), Nginx injects a header to signal trust. In a real scenario with `auth_request`, it would also inject the User ID.

```nginx
# nginx/default.conf
15:         # KEY PART: This header authenticates the request to the backend middleware
16:         proxy_set_header x-middleware-rewrite "1";
```

### The Middleware Logic (The Receiver)
In `middleware.ts`, the application's first line of defense is checking these trusted signals or the resulting session artifacts (Cookies).

```typescript
// middleware.ts
8:     // 1. Get Authentication State (Simulating Proxy Auth)
9:     const authRole = request.cookies.get('auth_role')?.value;
```

In our simulation:
1.  **Login**: `/login` sets a cookie (`auth_role=user`), representing the token the Proxy would have issued after a successful SSO login.
2.  **Validation**: `middleware.ts` reads this cookie to grant access to `/bitcoin`.

## 3. How to Handle "Proxy Auth" in Development

When you see "Proxy Auth Integration", you typically cannot "fix" or "bypass" it by attacking the application's login form (because one barely exists).

**To interact with it legitimately:**
1.  You must authenticate with the IDP (represented by our `/login` page).
2.  You must ensure your browser sends the Session Cookie or Header that the Proxy expects.

**To attack it (The CTF Goal):**
Since we cannot easily forge the Proxy's trust (Internal Nginx Configuration), we look for ways to **bypass the check entirely**. 
*   **The vulnerability (CVE-2025-29927)** allows us to trick the Next.js framework into ignoring the code in `middleware.ts` that enforces these checks.
