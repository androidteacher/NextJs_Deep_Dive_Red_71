import Link from 'next/link';
import React from 'react';

export default function SourceReview() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-dark text-gray-300">
            <div className="z-10 w-full max-w-5xl items-center justify-between font-sans lg:flex-col">
                <h1 className="text-5xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple neon-text-blue">
                    Source Code Review
                </h1>

                {/* Network Visualization */}
                <div className="w-full mb-12 glass-panel rounded-lg overflow-hidden p-6 transition-all hover:shadow-[0_0_30px_rgba(0,243,255,0.2)]">
                    <div className="flex justify-center mb-6">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/network_flow.png"
                            alt="Network Flow Diagram: Client -> Nginx Proxy -> Next.js Internal"
                            className="max-w-md w-full h-auto rounded border border-neon-blue/30 shadow-[0_0_15px_rgba(0,243,255,0.3)]"
                        />
                    </div>
                    <p className="text-gray-300 text-center max-w-3xl mx-auto font-light">
                        This lab simulates a realistic enterprise environment where a trusted <strong className="text-neon-green">Nginx Proxy</strong> passes traffic to an <strong className="text-neon-purple">Internal Next.js Server</strong>.
                        The proxy is responsible for stamping requests with a specific "trust header" that the internal server looks for.
                    </p>
                </div>

                <h2 className="mb-8 text-3xl font-bold text-center text-neon-blue neon-text-blue">
                    Exploit Summary
                </h2>



                {/* Component 1: Nginx */}
                <div className="w-full mb-12 glass rounded-lg overflow-hidden border-l-4 border-neon-green">
                    <div className="bg-gray-900/50 p-4 border-b border-gray-800 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-neon-green">1. Nginx Proxy Configuration</h2>
                        <span className="text-xs px-2 py-1 bg-neon-green/10 text-neon-green rounded border border-neon-green/20">nginx/default.conf</span>
                    </div>
                    <div className="p-6">
                        <p className="mb-4 text-gray-400">
                            The Nginx proxy sits in front of the Next.js application. It is responsible for routing and
                            injecting headers that the backend (might) trust.
                        </p>
                        <div className="bg-black/80 p-4 rounded border border-gray-800 font-mono text-xs overflow-x-auto text-green-400">
                            <pre>{`server {
    listen 80;
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        
        # KEY MECHANISM:
        # Nginx injects this header to say: "This request is coming from me (the trusted proxy)."
        # Important: The web server uses this header to verify the request originated 
        # from the internal infrastructure, relying on Nginx to have already filtered bad traffic.
        proxy_set_header x-middleware-rewrite "1";
    }
}`}</pre>
                        </div>
                        <div className="mt-4 p-4 bg-neon-green/5 border border-neon-green/30 rounded text-neon-green/90">
                            <strong>Mechanism:</strong> Nginx serves as the border guard. By injecting the <code>x-middleware-rewrite</code> header,
                            it digitally "stamps" the request. Next.js sees this stamp and treats the request as Trusted/Internal
                            rather than Public/Untrusted.
                        </div>
                    </div>
                </div>

                {/* Component 2: Middleware */}
                <div className="w-full mb-12 glass rounded-lg overflow-hidden border-l-4 border-neon-blue">
                    <div className="bg-gray-900/50 p-4 border-b border-gray-800 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-neon-blue">2. Next.js Middleware</h2>
                        <span className="text-xs px-2 py-1 bg-neon-blue/10 text-neon-blue rounded border border-neon-blue/20">middleware.ts</span>
                    </div>
                    <div className="p-6">
                        <p className="mb-4 text-gray-400">
                            The middleware is the "Gatekeeper". It intercepts requests before they reach the page logic.
                        </p>
                        <div className="bg-black/80 p-4 rounded border border-gray-800 font-mono text-xs overflow-x-auto text-blue-300">
                            <pre>{`export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    
    // 1. Get Authentication State via JWT
    // We verify the token signature and expiration here.
    const token = request.cookies.get('auth_token')?.value;
    let authRole = null;
    // ... code verifies token and extracts role ...

    // 2. Access Control (The Guard)
    
    // Rule A: /bitcoin requires a valid signed token (any role)
    if (path.startsWith('/bitcoin')) {
        if (!authRole) return NextResponse.redirect(new URL('/login', request.url));
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
    // The Vulnerability Surface: 
    // The matchers define WHEN this code runs. 
    // If we can trick Next.js into caching a "skippable" result for these paths, we win.
    matcher: ['/dashboard/:path*', '/bitcoin/:path*'],
}`}</pre>
                        </div>
                        <div className="mt-4 p-6 bg-gray-900 border border-gray-700 rounded text-gray-300">
                            <h3 className="text-xl font-bold text-white mb-4">Architecture Summary</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <span className="bg-neon-green/20 text-neon-green font-bold text-xs px-2 py-1 rounded mr-3 mt-1">STEP 1</span>
                                    <span>User sends a request to the public URL.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="bg-neon-green/20 text-neon-green font-bold text-xs px-2 py-1 rounded mr-3 mt-1">STEP 2</span>
                                    <span><strong>Nginx</strong> receives it, adds the <code className="text-neon-orange">x-middleware-rewrite</code> stamp, and forwards it to Next.js.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="bg-neon-blue/20 text-neon-blue font-bold text-xs px-2 py-1 rounded mr-3 mt-1">STEP 3</span>
                                    <span><strong>Next.js Middleware</strong> runs. It checks for a valid JWT and enforces role-based access control.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="bg-red-500/20 text-red-500 font-bold text-xs px-2 py-1 rounded mr-3 mt-1">STEP 4</span>
                                    <span>If checks pass, the page loads. If not, the user is blocked or redirected.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Standard Request Flow */}
                <div className="w-full mb-12 glass-panel rounded-lg overflow-hidden p-6 hover:border-neon-green transition-all">
                    <h3 className="text-xl font-bold text-neon-green mb-4">Phase 1: The Standard Request</h3>
                    <div className="flex flex-col lg:flex-row gap-8 items-center">
                        <div className="w-full lg:w-1/2 flex justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/standard_request_flow.png"
                                alt="Standard Request Flow: Nginx Swallows User Headers"
                                className="max-w-md w-full h-auto rounded border border-neon-green/30 shadow-[0_0_15px_rgba(0,255,159,0.3)]"
                            />
                        </div>
                        <div className="w-full lg:w-1/2">
                            <p className="text-gray-300 mb-4">
                                When a user sends a standard request (e.g., <code>GET /dashboard</code>), the Nginx Proxy acts as a strict sanitizer.
                            </p>
                            <p className="text-gray-300 mb-4">
                                <strong>Sanitization ("Swallowing"):</strong> If a user tries to spoof the trust header (<code>x-middleware-rewrite</code>), Nginx "swallows" (overwrites) it. This ensures that <em>only</em> Nginx can stamp the request.
                            </p>
                            <div className="bg-black/50 p-3 rounded border border-gray-700 text-sm font-mono text-gray-400">
                                <strong>Result:</strong> Next.js sees the valid stamp, runs the Middleware, sees no token, and correctly blocks the user (307 Redirect).
                            </div>
                        </div>
                    </div>
                </div>

                {/* Phase 2: The Response */}
                <div className="w-full mb-12 glass-panel rounded-lg overflow-hidden p-6 hover:border-neon-purple transition-all">
                    <h3 className="text-xl font-bold text-neon-purple mb-4">Phase 2: The Response</h3>
                    <div className="flex flex-col lg:flex-row-reverse gap-8 items-center">
                        <div className="w-full lg:w-1/2 flex justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/response_strip_flow.png"
                                alt="Response Stripping Flow: Nginx Removes Internal Headers"
                                className="max-w-md w-full h-auto rounded border border-neon-purple/30 shadow-[0_0_15px_rgba(189,0,255,0.3)]"
                            />
                        </div>
                        <div className="w-full lg:w-1/2">
                            <p className="text-gray-300 mb-4">
                                As the response travels back from the Next.js server toward the internet, it hits the Edge Proxy (Nginx).
                            </p>
                            <p className="text-gray-300 mb-4">
                                <strong>The Action:</strong> The proxy receives the response containing <code className="text-neon-purple">x-middleware-redirect</code>. Recognizing it as an internal header, the proxy removes it before sending the response to the user, effectively concealing the Next.js backend.
                            </p>
                            <div className="bg-black/50 p-4 rounded border border-gray-700 font-mono text-xs text-green-400 mb-4">
                                <pre>{`# Nginx Configuration (nginx/default.conf)
# SECURITY: Strip internal Next.js headers from the response
proxy_hide_header x-middleware-redirect;`}</pre>
                            </div>
                            <div className="bg-black/50 p-3 rounded border border-gray-700 text-sm font-mono text-gray-400">
                                <strong>Result:</strong> The user receives a clean response without seeing the internal routing mechanics.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detecting the Vulnerability */}
                <div className="w-full mb-12 glass-panel rounded-lg overflow-hidden p-6 hover:border-neon-blue transition-all">
                    <h3 className="text-xl font-bold text-neon-blue mb-4">Detecting the Vulnerability</h3>
                    <div className="flex flex-col lg:flex-row gap-8 items-center">
                        <div className="w-full lg:w-1/2 flex justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/vuln_detection_flow.png"
                                alt="Vulnerability Detection Flow: Injecting x-nextjs-data"
                                className="max-w-md w-full h-auto rounded border border-neon-blue/30 shadow-[0_0_15px_rgba(0,243,255,0.3)]"
                            />
                        </div>
                        <div className="w-full lg:w-1/2">
                            <h4 className="text-lg font-bold text-gray-200 mb-2">The Attack!</h4>
                            <p className="text-gray-300 mb-4 text-sm">
                                An attacker adds a <code className="text-neon-green">x-nextjs-data: 1</code> header to a web request.
                            </p>
                            <ul className="space-y-4 mb-4 text-sm">
                                <li className="flex flex-col items-start">
                                    <div className="flex items-center mb-2">
                                        <span className="bg-neon-blue/20 text-neon-blue font-bold text-xs px-2 py-1 rounded mr-3">STEP 1</span>
                                        <strong>The Logic Trigger</strong>
                                    </div>
                                    <span className="mb-2">
                                        Inside the Next.js source code (e.g., <code>base-server.ts</code>), the server explicitly checks for our injected header.
                                    </span>
                                    <div className="bg-black/80 p-3 rounded border border-gray-700 font-mono text-xs text-blue-300 w-full mb-2">
                                        <pre>{`// Simplified logic from Next.js Server
const isNextDataRequest = !!req.headers['x-nextjs-data'];

if (isNextDataRequest) {
    // Force the internal rewrite header to be set
    response.headers.set('x-nextjs-rewrite', destination);
}`}</pre>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <span className="bg-neon-blue/20 text-neon-blue font-bold text-xs px-2 py-1 rounded mr-3 mt-1">STEP 2</span>
                                    <span>
                                        The <code className="text-neon-green">x-nextjs-data</code> header is received by the server. Because it's a <span className="text-neon-blue font-bold uppercase">Data</span> request, the middleware responds with a <code className="text-neon-green">x-nextjs-redirect</code> header (instead of a standard 307 Location header), which the proxy allows to pass.
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <span className="bg-neon-blue/20 text-neon-blue font-bold text-xs px-2 py-1 rounded mr-3 mt-1">STEP 3</span>
                                    <span>
                                        <strong>The Bypass:</strong> The nginx server interprets this as a 'Data' header rather than an 'Internal Control' header. This new header is allowed to pass back to the user.
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <span className="bg-neon-green/20 text-neon-green font-bold text-xs px-2 py-1 rounded mr-3 mt-1">STEP 4</span>
                                    <span>
                                        <strong>The Detection:</strong> The presence of the leaked <code className="text-neon-green">x-nextjs-redirect: /</code> header is enough for us to detect the back end technology.
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Why Did this Slip Through? */}
                <div className="w-full mb-12 glass rounded-lg overflow-hidden border-l-4 border-red-500">
                    <div className="bg-gray-900/50 p-4 border-b border-gray-800">
                        <h3 className="text-xl font-bold text-red-500">Why Did This Header Slip Through?</h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-bold text-gray-200 mb-2 border-b border-gray-700 pb-2">1. The "Control" Header (Filtered)</h4>
                            <p className="text-sm text-gray-400 mb-2">Headers like <code className="text-red-400">x-middleware-redirect</code> are considered <strong>Internal Orchestration</strong>.</p>
                            <div className="bg-black/50 p-3 rounded text-xs text-gray-500 italic">
                                "This header looks like a command for server logic. The user doesn't need to see my internal guts. I'll strip it."
                            </div>
                            <p className="mt-2 text-sm text-red-400 font-bold">Result: SWALLOWED</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-200 mb-2 border-b border-gray-700 pb-2">2. The "Data" Header (Passed)</h4>
                            <p className="text-sm text-gray-400 mb-2">Headers like <code className="text-neon-green">x-nextjs-rewrite</code> or <code>x-nextjs-data</code> are treated as <strong>Application State</strong>.</p>
                            <div className="bg-black/50 p-3 rounded text-xs text-gray-500 italic">
                                "This looks like metadata for the frontend app. If I strip this, the JavaScript might break. I'll leave it alone."
                            </div>
                            <p className="mt-2 text-sm text-neon-green font-bold">Result: PASSED TO USER</p>
                        </div>
                    </div>
                </div>

                {/* The Exploit */}
                <div className="w-full mb-12 glass-panel rounded-lg overflow-hidden p-6 hover:border-red-500 transition-all" id="exploit">
                    <h3 className="text-2xl font-bold text-red-500 mb-6 tracking-wide uppercase">The Exploit</h3>

                    {/* The Payload */}
                    <div className="mb-8">
                        <h4 className="text-lg font-bold text-gray-200 mb-2">The Payload</h4>
                        <p className="text-gray-400 text-sm mb-2">An attacker sends a request with a specifically crafted header:</p>
                        <div className="bg-black/80 p-4 rounded border border-red-500/30 font-mono text-xs text-red-300 break-all select-all">
                            X-Middleware-Subrequest: src/middleware:nowaf:src/middleware:src/middleware:src/middleware:src/middleware:middleware:middleware:nowaf:middleware:middleware:middleware:pages/dashboard
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        <div className="w-full lg:w-1/2">
                            <h4 className="text-lg font-bold text-gray-200 mb-4">Why It Works (Step-by-Step)</h4>
                            <ul className="space-y-4 text-sm">
                                <li className="flex flex-col">
                                    <strong className="text-neon-green mb-1">1. Trust</strong>
                                    <span className="text-gray-400">Next.js assumes that the <code className="text-neon-green">x-middleware-subrequest</code> header is only generated internally by the server. It does not sanitize this header from incoming requests.</span>
                                </li>
                                <li className="flex flex-col">
                                    <strong className="text-neon-green mb-1">2. Recursion Check</strong>
                                    <span className="text-gray-400">When the request hits the server, <code className="text-neon-blue">next-server.ts</code> parses <code className="text-red-400">x-middleware-subrequest</code> to check for recursion.</span>
                                    <div className="bg-black/80 p-3 mt-2 rounded border border-gray-700 font-mono text-xs text-blue-300">
                                        <pre>
                                            <span className="text-gray-500">// Next.js Recursion Logic</span>
                                            {'\n'}const subreq = req.headers['x-middleware-subrequest'];
                                            {'\n'}const depth = subreq.split(':').length;
                                            {'\n\n'}if (depth &gt; 5) {'{'}{'\n'}
                                            {'   '}<span className="text-red-400 font-bold uppercase">// SECURITY HALT: STOP MIDDLEWARE to prevent crash</span>{'\n'}
                                            {'   '}return;{'\n'}
                                            {'}'}
                                        </pre>
                                    </div>
                                </li>
                                <li className="flex flex-col">
                                    <strong className="text-red-500 mb-1">3. The Bypass</strong>
                                    <span className="text-gray-400">
                                        Because our payload forces the depth count over 5, the server hits the "Security Halt" and <strong>stops running middleware</strong>.
                                        It assumes it's saving the server from a crash, but in doing so, it skips the <code>matcher.ts</code> checks and Auth verification entirely. The request is then allowed to proceed directly to the protected page.
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div className="w-full lg:w-1/2 flex justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/exploit_bypass_flow.png"
                                alt="Exploit Bypass Method: Recursion Limit"
                                className="w-full h-auto rounded border border-red-500/30 shadow-[0_0_25px_rgba(239,68,68,0.2)]"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
