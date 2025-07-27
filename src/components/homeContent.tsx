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
            <section className='p-4 h-screen'>
                <MapSection stories={stories} isOnline={isOnline} addressCache={addressCache} />
                <StoriesList/>
            </section>
        </main>
    );
}
