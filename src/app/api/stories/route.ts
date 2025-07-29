// src/app/api/stories/route.ts
import { storiesApi } from "../storiesApi";

export async function GET() {
    try {
        const stories = await storiesApi.getStories();
        return Response.json(stories);
    } catch (err: unknown) {
        console.error("Get stories error:", err);
        const errorMessage = err instanceof Error ? err.message : "Gagal mengambil stories";
        return new Response(
            JSON.stringify({ error: errorMessage }), 
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const data = {
            title: formData.get("title") as string,
            content: formData.get("content") as string,
            image: formData.get("image") as File,
            latitude: Number(formData.get("latitude")),
            longitude: Number(formData.get("longitude")),
        };

        const result = await storiesApi.createStory(data);
        return Response.json(result);
    } catch (err: unknown) {
        console.error("Create story error:", err);
        const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan tak dikenal";
        return new Response(
            JSON.stringify({ error: errorMessage }), 
            { status: 500 }
        );
    }
}