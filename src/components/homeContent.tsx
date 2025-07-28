// src/components/homeContent.tsx
'use client';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import { useStories } from '../hooks/useStories';
import Hero from './hero';
import MapSection from './MapSection';
import StoriesList from './StoriesList';

export default function HomeContent() {
    useAuthRedirect();
    const { stories, isOnline, addressCache } = useStories();

    return (
        <main>
            <Hero />
            <section className='relative p-4 h-full overflow-hidden'>
                {/* Background Image with Blur Effect */}
                <div
                    className="absolute inset-0 z-0 bg-center bg-no-repeat blur-xs scale-110"
                    style={{
                        backgroundImage: `url('/freepik__upload__41771.png')` // Sesuaikan dengan nama file di folder public
                    }}
                />

                {/* Gradient Overlay untuk depth dan readability */}
                <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/10 via-black/10 to-black/20" />

                {/* Alternative: Backdrop blur jika browser support */}
                <div className="absolute inset-0 z-15 backdrop-blur-xs bg-black/10" />

                {/* Content Container */}
                <div className="relative z-20 h-full flex flex-col">
                    <div className="flex-shrink-0">
                        <MapSection stories={stories} isOnline={isOnline} addressCache={addressCache} />
                    </div>
                    <div className="flex-1 min-h-0">
                        <StoriesList />
                    </div>
                </div>
            </section>
        </main>
    );
}