// src/app/api/stories/geocode.tsx

import { BASE_URL } from '../../../utils/config';
export async function getAddressFromCoordinates(
    lat: number,
    lon: number,
    setAddressCache: React.Dispatch<React.SetStateAction<Record<string, string>>>
) {
    const cacheKey = `${lat},${lon}`;
    try {
        const response = await fetch(`${BASE_URL}/api/geocode/reverse?lat=${lat}&lon=${lon}`);
        const { address } = await response.json();
        setAddressCache((prev: Record<string, string>) => ({ ...prev, [cacheKey]: address }));
    } catch (e) {
        console.error("Error reverse geocoding:", e);
    }
}