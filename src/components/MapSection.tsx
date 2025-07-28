'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useCallback, useState } from 'react';
import type { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet';

interface Story {
    id: string;
    title?: string;
    content?: string;
    imageUrl?: string;
    createdAt: string | Date;
    latitude: number;
    longitude: number;
}

interface MapSectionProps {
    stories: Story[];
    isOnline: boolean;
    addressCache: Record<string, string>;
}

// Komponen peta dari react-leaflet (harus ssr: false)
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });

export default function MapSection({ stories, isOnline }: MapSectionProps) {
    const mapRef = useRef<LeafletMap | null>(null);
    const markersRef = useRef<LeafletMarker[]>([]);
    const [L, setL] = useState<typeof import('leaflet') | null>(null);

    // Load leaflet hanya saat di browser
    useEffect(() => {
        import('leaflet').then(setL);
    }, []);

    // Render markers ke map
    const renderMarkers = useCallback(() => {
        if (!mapRef.current || !L) return;

        const map = mapRef.current;
        // Bersihkan marker lama
        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];

        const bounds = L.latLngBounds([]);

        for (const story of stories) {
            if (story.latitude && story.longitude) {
                const latLng = L.latLng(story.latitude, story.longitude);
                const marker = L.marker(latLng)
                    .addTo(map)
                    .bindPopup(`<strong>${story.title || 'Tanpa Judul'}</strong><br>${story.content || 'Tidak ada deskripsi'}`);

                markersRef.current.push(marker);
                bounds.extend(latLng);
            }
        }

        if (markersRef.current.length) {
            map.fitBounds(bounds);
        }
    }, [L, stories]);

    // Jalankan render marker setiap kali stories/isOnline berubah
    useEffect(() => {
        if (isOnline && stories.length && L && mapRef.current) {
            renderMarkers();
        }
    }, [L, stories, isOnline, renderMarkers]);

    // Handler saat MapContainer mendapatkan ref
    const setMapRef = useCallback((ref: LeafletMap | null) => {
        mapRef.current = ref;
    }, []);

    return (
        <section className="maps-container my-6">
            {isOnline ? (
                <div className='flex justify-center items-center'>
                    <div className="flex h-[500px] w-[1500px] gap-4 rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 relative z-0">
                        <MapContainer
                            center={[-6.2, 106.816]}
                            zoom={10}
                            style={{ height: '100%', width: '100%' }}
                            ref={setMapRef}
                            className="z-0"
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            />
                        </MapContainer>
                        <section className="absolute top-0 left-0 p-4 bg-white/65 rounded-lg shadow-md z-10">
                            <h2 className="text-2xl font-bold text-gray-800 mt-4">📍 Lokasi Cerita</h2>
                            <p className="text-gray-600">Klik pada marker untuk melihat detail cerita.</p>
                        </section>
                    </div>
                </div>
            ) : (
                <div className="p-6 bg-yellow-100 border border-yellow-300 rounded-xl shadow">
                    <p className="text-yellow-800 font-medium flex items-center gap-2">
                        🌐 Peta tidak tersedia saat offline. Silakan sambungkan ke internet untuk melihat peta.
                    </p>
                </div>
            )}
        </section>

    );
}
