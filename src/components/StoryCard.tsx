/* eslint-disable */
'use client';

import Image from 'next/image';
import { showFormattedDate } from '../utils/index';
import { Trash2 } from 'lucide-react';
import { useStories } from '../utils/StoryContext';
import { getAddressFromCoordinates } from '../app/api/stories/geocode'; 
import { useEffect, useState } from 'react';

interface StoryCardProps {
    storyId: string;
}

export default function StoryCard({ storyId }: StoryCardProps) {
    const { stories, deleteStory } = useStories();
    const story = stories.find(s => s.id === storyId);
    const [addressCache, setAddressCache] = useState<Record<string, string>>({});
    const [isDeleting, setIsDeleting] = useState(false);

    const cacheKey = `${story?.latitude},${story?.longitude}`;
    const address = addressCache[cacheKey];

    useEffect(() => {
        if (story && !addressCache[cacheKey]) {
            getAddressFromCoordinates(story.latitude, story.longitude, setAddressCache);
        }
    }, [story]);

    if (!story) return null;

    const handleDelete = async () => {
        if (isDeleting) return; // Prevent double-click

        setIsDeleting(true);

        // Optional: Add confirmation dialog
        const confirmed = window.confirm("Apakah Anda yakin ingin menghapus cerita ini?");
        if (!confirmed) {
            setIsDeleting(false);
            return;
        }

        const success = await deleteStory(story.id.toString()); // Pastikan id dalam format string
        setIsDeleting(false);
        if (success) {
            // Optional: Show success message
            console.log("Story deleted successfully");
        }
    };


    return (
        <div className="bg-[#1a1d29] rounded-2xl shadow-2xl overflow-hidden border border-white/10 backdrop-blur-sm transition-all transform hover:scale-[1.01] relative">
            {/* Gambar atau Gradien */}
            <div className="h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-medium">
                {story.imageUrl ? (
                    <Image
                        src={story.imageUrl}
                        alt={story.title || 'Story Image'}
                        width={400}
                        height={200}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 brightness-95 contrast-110"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-white text-lg font-medium opacity-90">
                        Tidak ada gambar
                    </div>
                )}
            </div>

            {/* Konten Utama */}
            <div className="p-6 space-y-4 text-white">
                {/* Info User */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                        {story.user.username.charAt(0).toUpperCase()}
                    </div>
                    <p className="font-semibold text-purple-400">
                        {story.user.username}
                    </p>
                </div>

                {/* Meta Info */}
                <div className="bg-white/10 text-gray-300 p-4 rounded-lg text-sm space-y-2">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
                        </svg>
                        <span>{showFormattedDate(story.createdAt, 'id-ID')}</span>
                    </div>
                    {address && (
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z" />
                            </svg>
                            <span>{address}</span>
                        </div>
                    )}
                </div>

                {/* Deskripsi */}
                <p className="text-sm text-gray-100">
                    <span className="text-white">•</span> {story.content || 'Tidak ada deskripsi'}
                </p>

                {/* Aksi */}
                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                    <button className="px-5 py-2 mt-4 rounded-full text-white text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-500 hover:to-pink-500 transition-all flex items-center gap-2">
                        Selengkapnya →
                    </button>

                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="w-10 h-10 rounded-full text-red-600 flex items-center justify-center relative overflow-hidden transition-all group"
                    >
                        <Trash2 className="relative z-10 text-lg group-hover:text-white group-hover:rotate-15 transition-all duration-300" />
                        <span className="absolute inset-0 bg-gradient-to-br from-red-200 to-red-300 rounded-full z-0 transition-all duration-300 group-hover:from-red-500 group-hover:to-red-600 "></span>
                        <span className="absolute inset-1 bg-white rounded-full z-0 transition-all duration-300 group-hover:scale-0"></span>
                    </button>
                </div>
            </div>
        </div>
    );
}
