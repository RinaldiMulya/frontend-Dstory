
'use client';
import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import StoryCard from './StoryCard';
import { useStories } from '../utils/StoryContext';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

export default function StoriesList() {
    const { stories, loading } = useStories();

    const plugin = React.useRef(
        Autoplay({
            delay: 3000,
            stopOnInteraction: true,
            jump: false
        })
    )

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
                <div className="w-full max-w-6xl mx-auto">
                    <Carousel
                        plugins={[plugin.current]}
                        className="w-full"
                        opts={{
                            align: "start",
                            slidesToScroll: 1,
                            containScroll: "trimSnaps",
                            loop: true
                        }}
                        onMouseEnter={plugin.current.stop}
                        onMouseLeave={plugin.current.reset}
                    >
                        <CarouselContent className="-ml-4">
                            {stories.map((story) => (
                                <CarouselItem key={story.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/2">
                                    <StoryCard storyId={story.id} />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-2" />
                        <CarouselNext className="right-2" />
                    </Carousel>
                </div>
            )}
        </section>
    );
}