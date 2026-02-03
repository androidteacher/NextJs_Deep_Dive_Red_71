export default function Dashboard() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 z-0 opacity-20" style={{
                backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }}></div>

            <div className="z-10 text-center">
                <h1 className="text-6xl font-bold text-red-500 mb-8 tracking-tighter text-shadow-neon glitch" data-text="ADMIN ACCESS GRANTED">ADMIN ACCESS GRANTED</h1>

                <div className="border border-red-500/50 p-12 rounded-xl bg-black/80 backdrop-blur-xl shadow-[0_0_50px_rgba(239,68,68,0.3)] hover:scale-105 transition-transform duration-500">
                    <p className="text-sm text-red-400 mb-4 uppercase tracking-[0.3em]">Top Secret // Level 5 Clearance</p>
                    <p className="text-5xl text-white font-mono border-b-2 border-red-500 pb-2 inline-block">Flag-639ffa875f7c503f13c6ed1dc05b4766</p>
                </div>
            </div>
        </main>
    )
}
