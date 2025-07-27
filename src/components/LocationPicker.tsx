'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet';

interface LocationData {
    lat: number;
    lng: number;
    address?: string;
}

interface LocationPickerProps {
    onLocationSelect: (location: LocationData) => void;
    initialLocation?: LocationData | null;
}

// Dynamic imports untuk leaflet components
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });

export default function LocationPicker({ onLocationSelect, initialLocation }: LocationPickerProps) {
    const mapRef = useRef<LeafletMap | null>(null);
    const markerRef = useRef<LeafletMarker | null>(null);
    const [L, setL] = useState<typeof import('leaflet') | null>(null);
    const [isMapReady, setIsMapReady] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<LocationData | null>(initialLocation || null);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [mapExpanded, setMapExpanded] = useState(false);

    // Load leaflet library
    useEffect(() => {
        import('leaflet').then((leaflet) => {
            setL(leaflet);
            setIsMapReady(true);
        });
    }, []);

    // Initialize marker saat map dan L sudah ready
    useEffect(() => {
        if (!mapRef.current || !L || !isMapReady) return;

        const map = mapRef.current;

        // Default location (Jakarta)
        const defaultLat = currentLocation?.lat || -6.200000;
        const defaultLng = currentLocation?.lng || 106.816666;

        // Create or update marker
        if (markerRef.current) {
            markerRef.current.remove();
        }

        markerRef.current = L.marker([defaultLat, defaultLng], { draggable: true })
            .addTo(map)
            .bindPopup('Drag untuk memilih lokasi')
            .openPopup();

        // Handle marker drag
        markerRef.current.on('dragend', () => {
            if (!markerRef.current) return;
            const { lat, lng } = markerRef.current.getLatLng();
            const locationData = { lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) };
            setCurrentLocation(locationData);
            onLocationSelect(locationData);
            reverseGeocode(lat, lng);
        });

        // Handle map click
        map.on('click', (e) => {
            const { lat, lng } = e.latlng;
            if (markerRef.current) {
                markerRef.current.setLatLng([lat, lng]);
            }
            const locationData = { lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) };
            setCurrentLocation(locationData);
            onLocationSelect(locationData);
            reverseGeocode(lat, lng);
        });

        // Set initial view
        map.setView([defaultLat, defaultLng], 13);

    }, [L, isMapReady, onLocationSelect]);

    // Reverse geocoding untuk mendapatkan alamat
    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
            );
            const data = await response.json();

            if (data.display_name) {
                const locationWithAddress = {
                    lat: Number(lat.toFixed(6)),
                    lng: Number(lng.toFixed(6)),
                    address: data.display_name
                };
                setCurrentLocation(locationWithAddress);
                onLocationSelect(locationWithAddress);
            }
        } catch (error) {
            console.error('Error getting address:', error);
        }
    };

    // Get current location menggunakan browser geolocation
    const getCurrentLocation = () => {
        setIsGettingLocation(true);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const locationData = {
                        lat: Number(latitude.toFixed(6)),
                        lng: Number(longitude.toFixed(6))
                    };

                    setCurrentLocation(locationData);
                    onLocationSelect(locationData);

                    // Update map view dan marker
                    if (mapRef.current && markerRef.current) {
                        mapRef.current.setView([latitude, longitude], 15);
                        markerRef.current.setLatLng([latitude, longitude]);
                        reverseGeocode(latitude, longitude);
                    }

                    setIsGettingLocation(false);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert('Tidak dapat mengakses lokasi. Pastikan Anda mengizinkan akses lokasi.');
                    setIsGettingLocation(false);
                }
            );
        } else {
            alert('Browser Anda tidak mendukung geolocation.');
            setIsGettingLocation(false);
        }
    };

    const setMapRef = useCallback((ref: LeafletMap | null) => {
        mapRef.current = ref;
    }, []);

    return (
        <Card>
            <CardContent className="p-4">
                <div className="space-y-4">
                    {/* Controls */}
                    <div className="flex gap-2 flex-wrap">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={getCurrentLocation}
                            disabled={isGettingLocation}
                        >
                            {isGettingLocation ? '📍 Mencari...' : '📍 Lokasi Saya'}
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setMapExpanded(!mapExpanded)}
                        >
                            {mapExpanded ? '📐 Perkecil' : '🗺️ Perbesar'}
                        </Button>
                    </div>

                    {/* Location Info */}
                    {currentLocation && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="text-sm font-medium text-blue-800">
                                📍 Lokasi: {currentLocation.lat}, {currentLocation.lng}
                            </div>
                            {currentLocation.address && (
                                <div className="text-xs text-blue-600 mt-1">
                                    {currentLocation.address}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Map Container */}
                    <div className={`rounded-lg overflow-hidden border ${mapExpanded ? 'h-96' : 'h-64'}`}>
                        {isMapReady ? (
                            <MapContainer
                                center={[currentLocation?.lat || -6.200000, currentLocation?.lng || 106.816666]}
                                zoom={13}
                                style={{ height: '100%', width: '100%' }}
                                ref={setMapRef}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                                />
                            </MapContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full bg-gray-100">
                                <p className="text-gray-500">Loading map...</p>
                            </div>
                        )}
                    </div>

                    <p className="text-xs text-gray-500">
                        💡 Klik pada peta atau drag marker untuk memilih lokasi
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}