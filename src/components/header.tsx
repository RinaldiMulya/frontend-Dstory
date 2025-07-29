// src/components/header.tsx
/* eslint-disable */
'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { isLoggedIn, clearToken } from '../app/lib/token'
import { useUser } from '../utils/StoryContext';

export default function Header() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const { user, logout, loading } = useUser();
    const [mounted, setMounted] = useState(false);

    const closeDrawer = () => {
        setDrawerOpen(false);
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        // Auto-close drawer saat navigasi
        setDrawerOpen(false);
    }, [pathname]);

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            setScrolled(offset > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fungsi untuk menangani klik pada overlay
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            closeDrawer();
        }
    };


    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
                {/* Background dengan backdrop blur dan gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/10 to-black/20 backdrop-blur-md border-b border-white/10"></div>

                <div className="relative main-header flex items-center justify-between p-4 text-white">
                    <Link href="/" className="brand-name text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-200 hover:from-blue-300 hover:to-purple-400 transition-all duration-300 drop-shadow-lg">
                        STORIES
                    </Link>

                    {/* Right Section - User + Menu */}
                    <div className="flex items-center space-x-4">
                        {/* User Section */}
                        {user ? (
                            <div className="relative group">
                                {/* User Avatar */}
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                                    <span className="text-white font-semibold text-sm uppercase tracking-wide">
                                        {user.username?.charAt(0) || 'U'}
                                    </span>
                                </div>

                                {/* Hover tooltip */}
                                <div className="absolute top-full right-0 mt-2 px-3 py-2 bg-gray-900/95 backdrop-blur-sm text-white text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50">
                                    <div className="font-medium">{user.username}</div>
                                    {user.email && (
                                        <div className="text-gray-300 text-xs">{user.email}</div>
                                    )}
                                    {/* Small arrow */}
                                    <div className="absolute -top-1 right-3 w-2 h-2 bg-gray-900/95 rotate-45"></div>
                                </div>

                                {/* Online indicator */}
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2 text-white/70 hover:text-white/90 transition-colors duration-200">
                                <div className="w-8 h-8 border-2 border-white/30 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium hidden sm:block">Guest</span>
                            </div>
                        )}

                        {/* Menu Button */}
                        <button
                            onClick={() => setDrawerOpen(!drawerOpen)}
                            className="drawer-button flex flex-col items-center justify-center w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-opacity-50 relative z-[60] border border-white/20 shadow-lg"
                            aria-label="Toggle menu"
                        >
                            <div className={`w-6 h-0.5 bg-white drop-shadow-sm transition-all duration-300 ${drawerOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                            <div className={`w-6 h-0.5 bg-white drop-shadow-sm transition-all duration-300 mt-1.5 ${drawerOpen ? 'opacity-0' : ''}`}></div>
                            <div className={`w-6 h-0.5 bg-white drop-shadow-sm transition-all duration-300 mt-1.5 ${drawerOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
                        </button>
                    </div>
                </div>

            </header>

            {/* Overlay dengan blur effect */}
            {drawerOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[45] transition-all duration-300"
                    onClick={handleOverlayClick}
                />
            )}

            {/* Drawer dengan glass effect */}
            <div className={`fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 ease-in-out z-[55] border-l border-white/20 ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Header Drawer dengan glass effect */}
                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-md text-white border-b border-white/10">
                        <h2 className="text-xl font-bold drop-shadow-sm">Menu</h2>
                        <button
                            onClick={closeDrawer}
                            className="p-2 rounded-xl hover:bg-white/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 z-[60] border border-white/10"
                            aria-label="Close menu"
                        >
                            <svg className="w-6 h-6 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation Content dengan glass effect */}
                    <nav className="flex-1 p-6 bg-white/80 backdrop-blur-sm">
                        <ul className="space-y-4">
                            <li>
                                <Link
                                    href="/"
                                    className={`flex items-center p-4 rounded-xl transition-all duration-200 backdrop-blur-sm border ${pathname === '/'
                                        ? 'bg-blue-100/80 text-blue-600 border-l-4 border-blue-600 shadow-md border-blue-200/50'
                                        : 'text-gray-700 hover:bg-white/60 hover:text-blue-600 hover:shadow-md border-white/20'
                                        }`}
                                    onClick={closeDrawer}
                                >
                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    Beranda
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/stories"
                                    className={`flex items-center p-4 rounded-xl transition-all duration-200 backdrop-blur-sm border ${pathname === '/stories'
                                        ? 'bg-blue-100/80 text-blue-600 border-l-4 border-blue-600 shadow-md border-blue-200/50'
                                        : 'text-gray-700 hover:bg-white/60 hover:text-blue-600 hover:shadow-md border-white/20'
                                        }`}
                                    onClick={closeDrawer}
                                >
                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    Buat Cerita
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* User Actions dengan glass effect */}
                    <div className="p-6 border-t border-white/20 bg-white/60 backdrop-blur-md">
                        {mounted && user  && isLoggedIn() ? (
                            <div className="space-y-3">
                                <div className="flex items-center p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/30 shadow-sm">
                                    <svg className="w-8 h-8 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Selamat datang!</p>
                                        <p className="text-xs text-gray-500">{user.username}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        logout();
                                    }}
                                    className="w-full flex items-center justify-center p-4 bg-red-500/90 hover:bg-red-600/90 text-white rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 backdrop-blur-sm border border-red-400/20 shadow-md"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <Link
                                    href="/login"
                                    className="w-full flex items-center justify-center p-4 bg-red-500/80 hover:bg-red-600/90 text-white rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 backdrop-blur-sm border border-red-400/20 shadow-md"
                                    onClick={() => {
                                        logout();
                                        closeDrawer();
                                    }}
                                >
                                    Logout
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}