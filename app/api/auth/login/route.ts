import { NextResponse } from 'next/server';
import { getUsers } from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        const users = getUsers();
        const user = users.find((u: any) => u.username === username && u.password === password);

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Issue JWT
        const token = await signToken({ username: user.username, role: user.role });

        const response = NextResponse.json({ success: true });

        // Set HTTP-Only Cookie
        response.cookies.set('auth_token', token, {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60, // 1 hour
            sameSite: 'lax'
        });

        return response;
    } catch (e) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
