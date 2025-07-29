// src/app/register/page.tsx

'use client';
import { useState, useEffect } from 'react';
import { Eye, EyeOff, BookOpen, Sparkles, User, Lock, Mail, UserPlus } from 'lucide-react';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    type Sparkle = {
        id: number;
        left: number;
        top: number;
        animationDelay: number;
        fontSize: number;
    };
    const [sparklesData, setSparklesData] = useState<Sparkle[]>([]);
    const [isClient, setIsClient] = useState(false);

    // Generate sparkles data only on client side
    useEffect(() => {
        setIsClient(true);
        const sparkles = [...Array(20)].map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            animationDelay: Math.random() * 3,
            fontSize: Math.random() * 10 + 10
        }));
        setSparklesData(sparkles);
    }, []);

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            alert('Registrasi berhasil! Silakan login.');
            // router.push('/login');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message || 'Registration failed');
            } else {
                setError('Registration failed');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
            </div>

            {/* Floating Sparkles - Only render on client */}
            {isClient && (
                <div className="absolute inset-0 pointer-events-none">
                    {sparklesData.map((sparkle) => (
                        <Sparkles
                            key={sparkle.id}
                            className="absolute text-white opacity-20 animate-pulse"
                            style={{
                                left: `${sparkle.left}%`,
                                top: `${sparkle.top}%`,
                                animationDelay: `${sparkle.animationDelay}s`,
                                fontSize: `${sparkle.fontSize}px`
                            }}
                        />
                    ))}
                </div>
            )}

            <div className="relative z-10 w-full max-w-md">
                {/* Logo and Welcome Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl mb-6 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                        <BookOpen className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                        Story App
                    </h1>
                    <p className="text-teal-100 text-lg font-medium">
                        Bergabung dengan Kami
                    </p>
                    <p className="text-teal-200 text-sm mt-1">
                        Buat akun baru untuk mulai berbagi cerita
                    </p>
                </div>

                {/* Register Form */}
                <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20">
                    <div className="space-y-6">
                        {/* Name Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/90 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Nama Lengkap
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                                    placeholder="Masukkan nama lengkap Anda"
                                    required
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-emerald-400/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                        </div>

                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/90 flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                                    placeholder="Masukkan email Anda"
                                    required
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-emerald-400/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/90 flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-4 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                                    placeholder="Buat password yang kuat"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                                <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-emerald-400/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                            <div className="text-xs text-teal-200/70 mt-1">
                                Minimal 8 karakter dengan kombinasi huruf dan angka
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-100 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Register Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full py-4 px-6 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    Mendaftar...
                                </div>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    Daftar Sekarang
                                </>
                            )}
                        </button>

                        {/* Terms and Conditions */}
                        <div className="text-center text-xs text-teal-200/70 leading-relaxed">
                            Dengan mendaftar, Anda menyetujui{' '}
                            <button className="text-teal-300 hover:text-white underline decoration-1 underline-offset-2 transition-colors duration-200">
                                Syarat & Ketentuan
                            </button>
                            {' '}dan{' '}
                            <button className="text-teal-300 hover:text-white underline decoration-1 underline-offset-2 transition-colors duration-200">
                                Kebijakan Privasi
                            </button>
                            {' '}kami.
                        </div>
                    </div>

                    {/* Login Link */}
                    <div className="mt-8 text-center">
                        <p className="text-teal-100 text-sm">
                            Sudah punya akun?{' '}
                            <button className="text-teal-300 hover:text-white font-semibold underline decoration-2 underline-offset-2 hover:decoration-teal-300 transition-colors duration-200">
                                Masuk di sini
                            </button>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-teal-200/60 text-xs">
                        © 2024 Story App. Semua hak dilindungi.
                    </p>
                </div>
            </div>
        </div>
    );
}