import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-green-100 to-green-300">
                <div className="flex flex-col md:flex-row bg-white/90 rounded-3xl shadow-2xl overflow-hidden max-w-3xl w-full">
                    {/* Left: Illustration */}
                    <div className="md:w-1/2 flex items-center justify-center bg-gradient-to-br from-green-400 to-green-200 p-8">
                        {/* SVG or image illustration */}
                        <svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <ellipse cx="110" cy="180" rx="100" ry="30" fill="#A7F3D0" />
                            <ellipse cx="60" cy="120" rx="40" ry="20" fill="#6EE7B7" />
                            <ellipse cx="160" cy="130" rx="50" ry="25" fill="#34D399" />
                            <rect x="30" y="100" width="20" height="20" rx="4" fill="#FDE68A" />
                            <rect x="170" y="110" width="18" height="18" rx="4" fill="#FCA5A5" />
                            <polygon points="60,170 70,150 80,170" fill="#047857" />
                            <polygon points="140,170 150,150 160,170" fill="#047857" />
                            <polygon points="100,160 110,140 120,160" fill="#047857" />
                            <circle cx="60" cy="110" r="6" fill="#F87171" />
                            <circle cx="180" cy="120" r="6" fill="#FBBF24" />
                            <text x="50" y="60" fontSize="24" fill="#047857" fontWeight="bold">WELCOME</text>
                            <text x="40" y="90" fontSize="14" fill="#047857">We are glad to see you :)</text>
                        </svg>
                    </div>
                    {/* Right: Form & Social */}
                    <div className="md:w-1/2 p-8 flex flex-col justify-center">
                        <h2 className="text-2xl font-bold text-green-900 mb-2">Hello!</h2>
                        <p className="text-green-800 mb-4">We are glad to see you :)</p>
                        <div className="flex gap-4 mb-8 justify-center">
                            <Link
                                href={route('login')}
                                className="flex-1 rounded-full px-8 py-3 font-semibold text-white bg-green-600 hover:bg-green-700 shadow transition text-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-center"
                                style={{ minWidth: 140 }}
                            >
                                Log in
                            </Link>
                            <Link
                                href={route('register')}
                                className="flex-1 rounded-full px-8 py-3 font-semibold text-green-700 bg-green-50 border border-green-400 hover:bg-green-100 transition text-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-center"
                                style={{ minWidth: 140 }}
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
