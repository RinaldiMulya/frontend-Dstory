// src/components/hero.tsx
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface HeroProps {
    theme?: 'fantasy' | 'adventure' | 'mystery' | 'romance' | 'scifi';
    customTitle?: string;
    customSubtitle?: string;
    customBackground?: string;
}

const Hero: React.FC<HeroProps> = ({
    theme = 'fantasy',
    customTitle,
    customSubtitle,
    customBackground
}) => {
    const [currentTheme, setCurrentTheme] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Berbagai tema cerita dengan background dan text
    const themes = {
        fantasy: {
            background: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            title: "Masuki Dunia Fantasi",
            subtitle: "Temukan keajaiban dalam setiap halaman cerita yang menakjubkan",
            accent: "from-purple-600 to-pink-600",
            textShadow: "text-shadow-purple"
        },
        adventure: {
            background: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            title: "Petualangan Tak Terbatas Menanti",
            subtitle: "Jelajahi dunia penuh misteri dan tantangan yang mendebarkan",
            accent: "from-orange-600 to-red-600",
            textShadow: "text-shadow-orange"
        },
        mystery: {
            background: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            title: "Pecahkan Misteri Terdalam",
            subtitle: "Setiap kata menyimpan petunjuk, setiap bab membuka rahasia baru",
            accent: "from-indigo-600 to-purple-800",
            textShadow: "text-shadow-indigo"
        },
        romance: {
            background: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            title: "Kisah Cinta Yang Abadi",
            subtitle: "Rasakan kehangatan dan keindahan cerita cinta yang menyentuh hati",
            accent: "from-pink-500 to-rose-600",
            textShadow: "text-shadow-pink"
        },
        scifi: {
            background: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            title: "Masa Depan Dalam Genggaman",
            subtitle: "Jelajahi teknologi canggih dan peradaban masa depan yang menakjubkan",
            accent: "from-cyan-500 to-blue-600",
            textShadow: "text-shadow-cyan"
        }
    };

    // Predefined particles positions untuk menghindari Math.random() di render
    const particlesData = [
        { left: 10, top: 20, delay: 0, duration: 8 },
        { left: 85, top: 15, delay: 1, duration: 9 },
        { left: 25, top: 80, delay: 2, duration: 10 },
        { left: 70, top: 60, delay: 3, duration: 8.5 },
        { left: 45, top: 30, delay: 4, duration: 9.5 },
        { left: 90, top: 75, delay: 5, duration: 8.2 },
        { left: 15, top: 50, delay: 6, duration: 9.8 },
        { left: 55, top: 10, delay: 7, duration: 8.7 },
        { left: 35, top: 90, delay: 0.5, duration: 9.2 },
        { left: 75, top: 25, delay: 1.5, duration: 8.8 },
        { left: 5, top: 70, delay: 2.5, duration: 9.3 },
        { left: 95, top: 45, delay: 3.5, duration: 8.4 },
        { left: 60, top: 85, delay: 4.5, duration: 9.7 },
        { left: 20, top: 35, delay: 5.5, duration: 8.6 },
        { left: 80, top: 5, delay: 6.5, duration: 9.1 },
        { left: 40, top: 65, delay: 7.5, duration: 8.9 },
        { left: 65, top: 40, delay: 1.2, duration: 9.4 },
        { left: 30, top: 75, delay: 2.8, duration: 8.3 },
        { left: 85, top: 55, delay: 4.2, duration: 9.6 },
        { left: 50, top: 20, delay: 6.8, duration: 8.1 }
    ];

    const themeKeys = Object.keys(themes) as (keyof typeof themes)[];

    // Mount effect
    useEffect(() => {
        setIsMounted(true);
        setIsVisible(true);
    }, []);

    // Auto slide themes - hanya jalan setelah mounted
    useEffect(() => {
        if (!isMounted) return;

        const interval = setInterval(() => {
            setCurrentTheme((prev) => (prev + 1) % themeKeys.length);
        }, 8000);

        return () => clearInterval(interval);
    }, [isMounted, themeKeys.length]);

    // Gunakan custom atau theme yang dipilih
    const currentThemeData = customBackground ? {
        background: customBackground,
        title: customTitle || themes[theme].title,
        subtitle: customSubtitle || themes[theme].subtitle,
        accent: themes[theme].accent,
        textShadow: themes[theme].textShadow
    } : themes[themeKeys[currentTheme]];

    // Render nothing sampai component mounted untuk menghindari hydration mismatch
    if (!isMounted) {
        return (
            <section className="relative h-screen w-full overflow-hidden bg-gray-900">
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
                <div className="relative z-10 flex items-center justify-center h-full px-4">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
                            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                                {customTitle || themes[theme].title}
                            </span>
                        </h1>
                        <p className="text-xl text-gray-200 mb-8">
                            {customSubtitle || themes[theme].subtitle}
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="relative h-screen w-full overflow-hidden">
            {/* Background Image dengan Parallax Effect */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-fixed transition-all duration-1000 ease-in-out transform scale-105"
                style={{
                    backgroundImage: `url(${currentThemeData.background})`,
                    filter: 'brightness(0.7)'
                }}
            />

            {/* Gradient Overlay untuk readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />

            {/* Floating Particles Effect - menggunakan data predefined */}
            <div className="absolute inset-0">
                {particlesData.map((particle, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
                        style={{
                            left: `${particle.left}%`,
                            top: `${particle.top}%`,
                            animationDelay: `${particle.delay}s`,
                            animationDuration: `${particle.duration}s`
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
                <div className={`text-center max-w-4xl mx-auto transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}>

                    {/* Main Title */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                        <span className={`bg-gradient-to-r ${currentThemeData.accent} bg-clip-text text-transparent animate-pulse`}>
                            {currentThemeData.title}
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl sm:text-2xl md:text-3xl text-gray-200 mb-8 font-light leading-relaxed max-w-3xl mx-auto">
                        {currentThemeData.subtitle}
                    </p>

                    {/* Decorative Line */}
                    <div className="flex items-center justify-center mb-8">
                        <div className="h-0.5 w-12 bg-white/30"></div>
                        <div className="h-1 w-8 bg-gradient-to-r from-white/60 to-white/30 mx-2"></div>
                        <div className="h-0.5 w-12 bg-white/30"></div>
                    </div>

                    {/* Call to Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/stories"
                            className={`group px-8 py-4 bg-gradient-to-r ${currentThemeData.accent} text-white rounded-full font-semibold text-lg transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl border border-white/20`}
                        >
                            <span className="flex items-center">
                                Mulai Membaca
                                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                        </Link>

                        <Link
                            href="/stories"
                            className="group px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold text-lg transform hover:scale-105 transition-all duration-300 border border-white/30 hover:bg-white/20"
                        >
                            <span className="flex items-center">
                                Tulis Cerita
                                <svg className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </span>
                        </Link>
                    </div>

                    {/* Theme Indicators */}
                    <div className="flex justify-center mt-12 space-x-2">
                        {themeKeys.map((_, index) => (

                            <button
                                aria-label="Go to slide theme"
                                key={index}
                                onClick={() => setCurrentTheme(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentTheme
                                    ? 'bg-white scale-125'
                                    : 'bg-white/40 hover:bg-white/60'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <div className="flex flex-col items-center text-white/70 animate-bounce">
                    <span className="text-sm mb-2">Scroll untuk lanjut</span>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </div>
        </section>
    );
};

export default Hero;