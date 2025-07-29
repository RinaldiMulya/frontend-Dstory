// src/components/homeContent.tsx
/* eslint-disable */
'use client';

import { useAuthRedirect } from '../hooks/useAuthRedirect';
import { useStories } from '../utils/StoryContext';
import { useState, useEffect } from 'react';
import Hero from './hero';
import MapSection from './MapSection';
import StoriesList from './StoriesList';
import ModernFooter from '../components/footer';

async function getAddressFromCoordinates(
    lat: number,
    lon: number,
    setAddressCache: React.Dispatch<React.SetStateAction<Record<string, string>>>
) {
    const cacheKey = `${lat},${lon}`;
    try {
        const res = await fetch(`/api/geocode/reverse?lat=${lat}&lon=${lon}`);
        const data = await res.json();
        if (data.address) {
            setAddressCache(prev => ({ ...prev, [cacheKey]: data.address }));
        }
    } catch (err) {
        console.error('Gagal mendapatkan alamat:', err);
    }
}

export default function HomeContent() {
    useAuthRedirect();
    const { stories, loading } = useStories();
    const [isOnline, setIsOnline] = useState(true);
    const [addressCache, setAddressCache] = useState<Record<string, string>>({});

    // Handle online/offline status
    useEffect(() => {
        setIsOnline(typeof navigator !== 'undefined' && navigator.onLine);

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Load addresses for stories
    useEffect(() => {
        const loadAddresses = async () => {
            if (stories.length > 0) {
                await Promise.all(
                    stories.map(async (story) => {
                        if (story.latitude && story.longitude) {
                            const cacheKey = `${story.latitude},${story.longitude}`;
                            if (!addressCache[cacheKey]) {
                                await getAddressFromCoordinates(
                                    story.latitude,
                                    story.longitude,
                                    setAddressCache
                                );
                            }
                        }
                    })
                );
            }
        };

        loadAddresses();
    }, [stories]);

    return (
        <main>
            <Hero />
            <section className="relative p-4 h-full overflow-hidden">
                {/* Background Image with Blur Effect */}
                <div
                    className="absolute inset-0 z-0 bg-center bg-no-repeat blur-xs scale-110"
                    style={{
                        backgroundImage: `url('/freepik__upload__76156.png')`
                    }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/10 via-black/10 to-black/20" />
                <div className="absolute inset-0 z-15 backdrop-blur-xs bg-black/10" />

                {/* Content */}
                <div className="relative z-20 h-full flex flex-col">
                    <div className="flex-shrink-0">
                        <MapSection
                            stories={stories}
                            isOnline={isOnline}
                            addressCache={addressCache}
                        />
                    </div>
                    <div className="flex-1 min-h-0">
                        <StoriesList />
                    </div>
                </div>
            </section>
            <ModernFooter />
        </main>
    );
}
