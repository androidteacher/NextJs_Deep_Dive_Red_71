import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // 1. Get Authentication State via JWT
    // We verify the token signature and expiration here.
    const token = request.cookies.get('auth_token')?.value;
    let authRole = null;

    if (token) {
        try {
            const payload = await verifyToken(token);
            // Payload contains: { username: string, role: 'user' | 'admin', iat, exp }
            if (payload && typeof payload === 'object' && 'role' in payload) {
                authRole = (payload as any).role;
            }
        } catch (e) {
            // Invalid token (tampered signature or expired)
        }
    }

    // 2. Define Access Rules

    // Rule A: /bitcoin requires a valid signed token (any role)
    if (path.startsWith('/bitcoin')) {
        if (!authRole) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        // Access granted for any authenticated user
        return NextResponse.next();
    }

    // Rule B: /dashboard requires 'admin' role
    if (path.startsWith('/dashboard')) {
        // Logc: Check if the user has the 'admin' role claims
        if (authRole === 'admin') {
            return NextResponse.next();
        }
        // Default: Block everyone else (including 'user' role)
        return NextResponse.redirect(new URL('/', request.url));
    }
}

export const config = {
    // We must match BOTH protected paths to run this logic
    matcher: ['/dashboard/:path*', '/bitcoin/:path*'],
}
