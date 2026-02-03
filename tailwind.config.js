/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'brand': '#00ff9f', // neon-green as brand
                'dark': '#050505', // cyber-black
                'cyber-gray': '#121212',
                'neon-blue': '#00f3ff',
                'neon-purple': '#bd00ff',
                'neon-green': '#00ff9f',
            },
            fontFamily: {
                mono: ['Courier New', 'monospace'],
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            backgroundImage: {
                'cyber-gradient': 'radial-gradient(circle at 50% 0%, #1a1a2e 0%, #050505 100%)',
            }
        },
    },
    plugins: [],
}
