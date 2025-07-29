// src/app/api/stories/[id]/route.ts
import { storiesApi } from "../../storiesApi";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idParam } = await params;
        const id = Number(idParam);

        if (isNaN(id)) {
            return new Response(
                JSON.stringify({ error: "'id' harus berupa angka" }),
                { status: 400 }
            );
        }

        const result = await storiesApi.deleteStory(id);
        return Response.json(result);
    } catch (err: unknown) {
        console.error("Delete error:", err);
        const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan saat menghapus";
        return new Response(
            JSON.stringify({ error: errorMessage }),
            { status: 500 }
        );
    }
}