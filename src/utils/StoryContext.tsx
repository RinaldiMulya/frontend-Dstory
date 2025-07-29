// src/contexts/StoryContext.tsx
/* eslint-disable */
"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getToken, clearToken, isLoggedIn } from "../app/lib/token";
import { BASE_URL } from '../utils/config';


// Interfaces
export interface User {
    id: number;
    username: string;
    email?: string;
}

export interface Story {
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
}

// Context Types
interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean;
    error: string | null;
    fetchUserProfile: () => Promise<void>;
    logout: () => void;
}

interface StoryContextType {
    stories: Story[];
    setStories: (stories: Story[]) => void;
    addStory: (story: Story) => void;
    removeStory: (id: string) => void;
    fetchStories: () => Promise<void>;
    deleteStory: (id: string) => Promise<boolean>;
    loading: boolean;
    error: string | null;
}

// Create Contexts
const UserContext = createContext<UserContextType | undefined>(undefined);
const StoryContext = createContext<StoryContextType | undefined>(undefined);

// User Provider
export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch user profile from API
    const fetchUserProfile = async () => {
        if (!isLoggedIn()) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const token = getToken();
            const response = await fetch(`${BASE_URL}/api/stories`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    clearToken();
                    setUser(null);
                    window.location.href = '/login';
                    return;
                }
                throw new Error("Failed to fetch user profile");
            }

            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                // Ambil data user dari story pertama
                const currentUser = data[0].user;
                setUser(currentUser);
            } else {
                setUser(null);
            }

        } catch (err) {
            console.error("Error fetching user profile:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch user profile");
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = () => {
        clearToken();
        setUser(null);
        window.location.href = '/login';
    };

    // Check authentication on mount
    useEffect(() => {
        if (isLoggedIn()) {
            fetchUserProfile();
        } else {
            setLoading(false);
        }
    }, []);

    const value = {
        user,
        setUser,
        loading,
        error,
        fetchUserProfile,
        logout,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

// Story Provider
export const StoryProvider = ({ children }: { children: ReactNode }) => {
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch stories from API
    const fetchStories = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = getToken();
            const response = await fetch(`${BASE_URL}/api/stories`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    clearToken();
                    window.location.href = '/login';
                    return;
                }
                throw new Error("Failed to fetch stories");
            }

            const data = await response.json();
            setStories(data.stories || data);
        } catch (err) {
            console.error("Error fetching stories:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch stories");
        } finally {
            setLoading(false);
        }
    };

    // Delete story via API
    const deleteStory = async (id: string): Promise<boolean> => {
        try {
            const token = getToken();
            const response = await fetch(`${BASE_URL}/api/stories/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Unauthorized - please login again");
                } else if (response.status === 404) {
                    throw new Error("Story not found");
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || `Failed to delete story (${response.status})`);
                }
            }
            
            removeStory(id);
            return true;
        } catch (err) {
            console.error("Error deleting story:", err);
            setError(err instanceof Error ? err.message : "Failed to delete story");
            return false;
        }
    };

    // Add story to local state
    const addStory = (story: Story) => {
        setStories((prev) => [story, ...prev]);
    };

    // Remove story from local state
    const removeStory = (id: string) => {
        setStories((prev) => prev.filter((s) => s.id !== id));
    };

    // Auto-fetch stories when component mounts and user is logged in
    useEffect(() => {
        if (isLoggedIn()) {
            fetchStories();
        }
    }, []);

    const value = {
        stories,
        setStories,
        addStory,
        removeStory,
        fetchStories,
        deleteStory,
        loading,
        error,
    };

    return (
        <StoryContext.Provider value={value}>
            {children}
        </StoryContext.Provider>
    );
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
    return (
        <UserProvider>
            <StoryProvider>
                {children}
            </StoryProvider>
        </UserProvider>
    );
};

// Custom Hooks
export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

export const useStories = (): StoryContextType => {
    const context = useContext(StoryContext);
    if (!context) {
        throw new Error("useStories must be used within a StoryProvider");
    }
    return context;
};

// Loading Component
export const LoadingWrapper = ({ children }: { children: ReactNode }) => {
    const { loading: userLoading } = useUser();
    const { loading: storyLoading } = useStories();

    if (userLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};