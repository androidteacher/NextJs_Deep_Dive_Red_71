# Next.js Deep Dive: CVE-2025-29927 (Red 71)

## Purpose of the Lab
This lab is designed to provide a hands-on deep dive into **CVE-2025-29927**, a critical middleware bypass vulnerability in Next.js. The goal is to move beyond simple "patching" and truly understand the internal mechanics that lead to this failure.

The lab follows a three-phase pedagogical approach:

### 1. Understand
Learn how Next.js handles internal request orchestration.
- **Middleware Logic**: How `middleware.ts` intercepts requests.
- **Internal Headers**: The role of `x-middleware-subrequest` in preventing infinite loops.
- **The Failure**: How trusting unsanitized input headers leads to logic errors.

### 2. Detect
Learn how to identify if a target application is vulnerable without exploiting it.
- **Fingerprinting**: Using the `x-nextjs-data: 1` header to trigger specific internal behaviors.
- **Observation**: Watching for leaked internal headers like `x-nextjs-redirect` passing through reverse proxies (Nginx).

### 3. Exploit
Execute the full bypass to access protected resources.
- **The Concept**: Triggering the "Security Halt" mechanism to fail open.
- **The Payload**: Constructing a forged polyglot `x-middleware-subrequest` header that exceeds the recursion limit (depth > 5).
- **The Result**: Bypassing `matcher.ts` and Authentication checks to access the `/dashboard`.

## Usage

### Running via Docker
```bash
./build_and_run.sh
```
This will start the Next.js application behind an Nginx proxy, simulating a real-world deployment where headers might be stripped or passed.

### Access
- **Application**: http://localhost:9052
- **Source Code Review**: http://localhost:9052/source

## Structure
- `app/`: Next.js application source code.
- `app/source/page.tsx`: The interactive educational walkthrough page.
- `nginx/`: Nginx configuration simulating the edge proxy.
- `exploit.md`: Detailed breakdown of the exploit mechanism.

---
*Created for the AndroidTeacher Cyber Range.*
