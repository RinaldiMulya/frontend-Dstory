"use client";

import { useState, useEffect } from "react";
import {storiesApi} from "../app/api/stories/route";
import { getAddressFromCoordinates } from "../app/api/stories/geocode";


type Story = {
    id: string;
    title?: string;
    content?: string;
    imageUrl?: string;
    createdAt: string | Date;
    latitude: number;
    longitude: number;
    user: {
        id: number;
        username: string;
    };
};


export function useStories() {
    const [stories, setStories] = useState<Story[]>([]);
    const [isOnline, setIsOnline] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [addressCache, setAddressCache] = useState({});

    useEffect(() => {
        setIsOnline(typeof navigator !== "undefined" && navigator.onLine);
        const online = () => setIsOnline(true);
        const offline = () => setIsOnline(false);
        window.addEventListener("online", online);
        window.addEventListener("offline", offline);
        return () => {
            window.removeEventListener("online", online);
            window.removeEventListener("offline", offline);
        };
    }, []);

    const loadStories = async () => {
        setIsLoading(true);
        try {
            const data = await storiesApi.getStories();
            setStories(data);
            await Promise.all(
                data.map(async (story: Story) => {
                    if (story.latitude && story.longitude) {
                        await getAddressFromCoordinates(
                            story.latitude,
                            story.longitude,
                            setAddressCache
                        );
                    }
                })
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadStories();
    }, []);

    const handleClearCache = () => {
        localStorage.removeItem("storiesCache");
        alert("Cache cerita dihapus");
    };

    const handleDeleteStory = async (id: string) => {
        try {
            await api.deleteStory(id);
            setStories((prev) => prev.filter((story) => story.id !== id));
        } catch (e) {
            alert("Gagal hapus cerita");
        }
    };

    return {
        stories,
        isOnline,
        isLoading,
        addressCache,
        handleClearCache,
        handleDeleteStory,
    };
}
