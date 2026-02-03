import { NextResponse } from 'next/server';
import { addUser, getUsers } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const users = getUsers();
        if (users.find((u: any) => u.username === username)) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        // In a real app, HASH PASSWORD HERE. 
        // For CTF simplicity/readability, plain text is fine or simple hash.
        addUser({ username, password, role: 'user' });

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
