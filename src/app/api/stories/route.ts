import { storiesApi } from "../storiesApi";

export async function GET() {
    const stories = await storiesApi.getStories();
    return Response.json(stories);
}

export async function POST(request: Request) {
    const formData = await request.formData();
    const data = {
        title: formData.get("title") as string,
        content: formData.get("content") as string,
        image: formData.get("image") as File,
        latitude: Number(formData.get("latitude")),
        longitude: Number(formData.get("longitude")),
    };

    try {
        const result = await storiesApi.createStory(data);
        return Response.json(result);
    } catch (err: unknown) {
        const errorMessage =
            err instanceof Error ? err.message : "Terjadi kesalahan tak dikenal";
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
        });
    }
}
