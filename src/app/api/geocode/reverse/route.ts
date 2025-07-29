// src/app/api/geocode/reverse/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
        return NextResponse.json({ error: "Missing coordinates" }, { status: 400 });
    }

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
            {
                headers: {
                    "User-Agent": "YourAppName/1.0 (email@example.com)",
                },
            }
        );

        if (!response.ok) {
            throw new Error("Nominatim error");
        }

        const data = await response.json();
        return NextResponse.json({ address: data.display_name });
    } catch (err: unknown) {
        console.error("Error fetching address:", err);
        return NextResponse.json(
            { error: "Failed to fetch address" },
            { status: 500 }
        );
    }
}
