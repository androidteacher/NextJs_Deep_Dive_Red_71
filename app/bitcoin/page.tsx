"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Bitcoin() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch 7 days of data
                const res = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7&interval=daily');
                if (!res.ok) throw new Error('Failed to fetch');
                const json = await res.json();

                // Format for Recharts: { date: 'Mon', price: 42000 }
                const formatted = json.prices.map((item: any) => {
                    const date = new Date(item[0]);
                    return {
                        date: date.toLocaleDateString(undefined, { weekday: 'short' }),
                        price: item[1]
                    };
                });
                setData(formatted);
            } catch (e) {
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    return (
        <main className="flex min-h-screen flex-col items-center p-24 bg-gray-900 text-white">
            <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-4xl font-bold text-green-500">Bitcoin Market Analysis</h1>
                    <Link href="/" className="text-gray-400 hover:text-white">Logout / Home</Link>
                </div>

                <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-xl">
                    <h2 className="text-xl mb-4 text-gray-300">7-Day Price History (USD)</h2>

                    {loading && <p className="text-yellow-400 animate-pulse">Loading market data...</p>}

                    {error && (
                        <div className="text-red-400 border border-red-900 bg-red-900/20 p-4 rounded">
                            Error: Sorry, the API query failed. Unable to reach external market data provider.
                        </div>
                    )}

                    {!loading && !error && (
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="date" stroke="#9CA3AF" />
                                    <YAxis stroke="#9CA3AF" domain={['auto', 'auto']} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                                        itemStyle={{ color: '#10B981' }}
                                    />
                                    <Line type="monotone" dataKey="price" stroke="#10B981" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                <div className="mt-8 p-4 bg-gray-800/50 rounded border border-gray-700 text-center text-gray-400">
                    <p className="mb-2">Logged in as: <span className="text-blue-400 font-bold">Regular User</span></p>
                    <p>Your access level grants you viewing rights for market data.</p>
                    <p className="text-red-500 mt-2 text-sm italic">Note: You do not have permissions to access /dashboard.</p>
                </div>
            </div>
        </main>
    );
}
