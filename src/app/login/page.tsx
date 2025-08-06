// src/app/login/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { setToken, isLoggedIn } from "../lib/token";
import { Eye, EyeOff, BookOpen, Sparkles, User, Lock } from "lucide-react";

interface SparklePosition {
    left: string;
    top: string;
    animationDelay: string;
    fontSize: string;
}

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sparklePositions, setSparklePositions] = useState<SparklePosition[]>([]);
    const router = useRouter();

    // Initialize sparkle positions after component mounts
    useEffect(() => {

        const positions = Array.from({ length: 20 }, () => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            fontSize: `${Math.random() * 10 + 10}px`,
        }));
        setSparklePositions(positions);
    }, []);

    // Cek jika user sudah login, redirect ke home
    useEffect(() => {
        if (typeof window !== "undefined" && isLoggedIn()) {
            console.log("User already logged in, redirecting to home");
            router.replace('/');
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            // Validasi client-side
            if (!email.trim() || !password.trim()) {
                throw new Error("Email dan password harus diisi");
            }

            // Call API login
            const response = await fetch("/api/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password: password.trim()
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login gagal");
            }

            // Simpan token
            if (data.token) {
                console.log("Login successful, saving token and redirecting");
                setToken(data.token);
                // Pastikan token tersimpan sebelum redirect
                await new Promise(resolve => setTimeout(resolve, 100));
                // Gunakan window.location untuk hard redirect yang lebih reliable
                window.location.href = '/';
            } else {
                throw new Error("Token tidak ditemukan");
            }

        } catch (err: unknown) {
            console.error("Login error:", err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Terjadi kesalahan saat login");
            }
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
            </div>

            {/* Floating Sparkles */}
            <div className="absolute inset-0 pointer-events-none">
                {sparklePositions.map((position, i) => (
                    <Sparkles
                        key={i}
                        className="absolute text-white opacity-20 animate-pulse"
                        style={{
                            left: position.left,
                            top: position.top,
                            animationDelay: position.animationDelay,
                            fontSize: position.fontSize,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Logo and Welcome Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-6 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                        <BookOpen className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                        Story App
                    </h1>
                    <p className="text-blue-100 text-lg font-medium">
                        Selamat Datang Kembali
                    </p>
                    <p className="text-blue-200 text-sm mt-1">
                        Silakan login untuk mulai menggunakan aplikasi
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="backdrop-blur-lg bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20">
                    <div className="space-y-6">
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/90 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                                    placeholder="Masukkan email Anda"
                                    required
                                    disabled={isLoading}
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
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
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-4 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                                    placeholder="Masukkan password Anda"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200 disabled:opacity-50"
                                    disabled={isLoading}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-100 text-sm animate-shake">
                                {error}
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    Sedang masuk...
                                </div>
                            ) : (
                                "Masuk"
                            )}
                        </button>
                    </div>

                    {/* Register Link */}
                    <div className="mt-8 text-center">
                        <p className="text-blue-100 text-sm">
                            Belum punya akun?{" "}
                            <button
                                type="button"
                                onClick={() => router.push("/register")}
                                className="text-blue-300 hover:text-white font-semibold underline decoration-2 underline-offset-2 hover:decoration-blue-300 transition-colors duration-200"
                                disabled={isLoading}
                            >
                                Daftar di sini
                            </button>
                        </p>
                    </div>

                    {/* Forgot Password */}
                    <div className="mt-4 text-center">
                        <button
                            type="button"
                            className="text-blue-200 hover:text-white text-sm underline decoration-1 underline-offset-2 hover:decoration-blue-200 transition-colors duration-200"
                            disabled={isLoading}
                        >
                            Lupa password?
                        </button>
                    </div>
                </form>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-blue-200/60 text-xs">
                        © 2024 Story App. Semua hak dilindungi.
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes shake {
                    0%, 100% {
                        transform: translateX(0);
                    }
                    25% {
                        transform: translateX(-5px);
                    }
                    75% {
                        transform: translateX(5px);
                    }
                }

                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }

                .animation-delay-2000 {
                    animation-delay: 2s;
                }

                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
}