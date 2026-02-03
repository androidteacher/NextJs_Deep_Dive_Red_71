"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
    const [error, setError] = React.useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData);

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            window.location.href = '/bitcoin';
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
            <div className="z-10 w-full max-w-md items-center justify-between font-mono text-sm">
                <h1 className="text-4xl font-bold mb-8 text-center text-blue-500">Login</h1>

                {error && <div className="mb-4 p-2 bg-red-900/50 border border-red-500 text-red-200 rounded text-center">{error}</div>}

                <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg border border-gray-700">
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-2">Username</label>
                        <input name="username" type="text" placeholder="user" className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-400 mb-2">Password</label>
                        <input name="password" type="password" placeholder="password" className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none" required />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
                        Sign In
                    </button>
                </form>

                <p className="mt-4 text-center text-gray-500">
                    Don't have an account? <Link href="/register" className="text-blue-400 hover:underline">Register</Link>
                </p>
                <p className="mt-4 text-center text-gray-500">
                    <Link href="/" className="text-gray-400 hover:underline">← Back to Home</Link>
                </p>
            </div>
        </main>
    );
}
