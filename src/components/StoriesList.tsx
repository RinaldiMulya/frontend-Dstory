'use client';
import StoryCard from './StoryCard';
import { useStories } from '../utils/StoryContext'; // pastikan path sesuai

export default function StoriesList() {
    const { stories, loading } = useStories();

    return (
        <section className="stories-title my-10 p-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">📖 Recent Stories</h1>
            </div>

            {loading ? (
                <p className="text-gray-500 italic">Memuat cerita...</p>
            ) : stories.length === 0 ? (
                <p className="text-gray-500 italic">Belum ada cerita.</p>
            ) : (
                <div className="flex flex-wrap justify-center gap-6">
                    {stories.map((story) => (
                        <StoryCard key={story.id} storyId={story.id} />
                    ))}
                </div>
            )}
        </section>
    );
}
