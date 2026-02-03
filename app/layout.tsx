import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Next.js Security Lab',
    description: 'CVE-2025-29927',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className="bg-black text-green-500 min-h-screen">
                <nav className="w-full bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center sticky top-0 z-50">
                    <div className="font-bold text-xl text-green-500">
                        <a href="/" className="hover:text-green-400">Next.js SecLab</a>
                    </div>
                    <div className="space-x-6 text-sm">
                        <a href="/source" className="text-blue-400 hover:text-blue-300 font-bold border-b-2 border-transparent hover:border-blue-400 pb-1">Review Source Code</a>
                        <a href="/" className="hover:text-white">Home</a>
                        <a href="/login" className="hover:text-white">Login</a>
                        <a href="/register" className="hover:text-white">Register</a>
                    </div>
                </nav>
                {children}
            </body>
        </html>
    )
}
