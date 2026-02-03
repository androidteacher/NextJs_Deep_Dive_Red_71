import Link from 'next/link';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 font-sans">
            <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex">
                <p className="fixed left-0 top-0 flex w-full justify-center border-b border-neon-green/20 bg-black/50 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto  lg:rounded-xl lg:border lg:p-4 text-neon-green animate-pulse">
                    Status: <span className="text-neon-green font-bold ml-2 text-shadow-neon">SYSTEM ONLINE</span>
                </p>
            </div>

            <div className="mt-16 text-center">
                <h1 className="text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple neon-text-blue">
                    SECURE CORP
                </h1>
                <p className="text-xl text-gray-400 mb-12 tracking-widest uppercase">Next Gen Access Control</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Public Area */}
                    <div className="p-8 glass-panel rounded-xl transition-all hover:scale-105 hover:border-neon-blue">
                        <h2 className="text-2xl font-bold mb-6 text-neon-blue">Public Access</h2>
                        <div className="flex gap-4 justify-center">
                            <Link href="/login" className="px-8 py-3 bg-neon-blue/10 border border-neon-blue text-neon-blue rounded hover:bg-neon-blue hover:text-black transition duration-300">LOGIN</Link>
                            <Link href="/register" className="px-8 py-3 bg-transparent border border-gray-600 text-gray-400 rounded hover:border-gray-400 hover:text-white transition duration-300">REGISTER</Link>
                        </div>
                    </div>

                    {/* Protected Area */}
                    <div className="p-8 glass-panel rounded-xl transition-all hover:scale-105 hover:border-neon-purple">
                        <h2 className="text-2xl font-bold mb-6 text-neon-purple">Restricted Areas</h2>
                        <div className="flex flex-col gap-4">
                            <Link href="/bitcoin" className="px-6 py-3 border border-neon-green/50 text-neon-green rounded hover:bg-neon-green/10 transition duration-300">
                                Bitcoin Analysis (AUTH)
                            </Link>
                            <Link href="/dashboard" className="px-6 py-3 border border-red-500/50 text-red-500 rounded hover:bg-red-900/20 transition duration-300">
                                Admin Dashboard (LOCKED)
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
