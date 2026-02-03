"use client";
import React from 'react';
import Link from 'next/link';

export default function Register() {
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData);

        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            setSuccess(true);
        } else {
            const json = await res.json();
            setError(json.error || 'Registration failed');
        }
    };

    if (success) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
                <div className="z-10 w-full max-w-md text-center">
                    <h1 className="text-4xl font-bold mb-8 text-green-500">Success</h1>
                    <p className="mb-6 text-xl">Account created.</p>
                    <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
                        Login Now
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
            <div className="z-10 w-full max-w-md items-center justify-between font-mono text-sm">
                <h1 className="text-4xl font-bold mb-8 text-center text-green-500">Register</h1>

                {error && <div className="mb-4 p-2 bg-red-900/50 border border-red-500 text-red-200 rounded text-center">{error}</div>}

                <form onSubmit={handleRegister} className="bg-gray-800 p-8 rounded-lg border border-gray-700">
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-2">Username</label>
                        <input name="username" type="text" placeholder="user" className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-green-500 outline-none" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-400 mb-2">Password</label>
                        <input name="password" type="password" placeholder="password" className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-green-500 outline-none" required />
                    </div>
                    <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors">
                        Create Account
                    </button>
                </form>

                <p className="mt-4 text-center text-gray-500">
                    <Link href="/" className="text-gray-400 hover:underline">← Back to Home</Link>
                </p>
            </div>
        </main>
    );
}
