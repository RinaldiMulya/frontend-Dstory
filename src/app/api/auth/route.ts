// src/app/api/auth/route.ts
import { NextResponse } from "next/server";

import { BASE_URL } from '../../../utils/config';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validasi input
        if (!body.email || !body.password) {
            return NextResponse.json(
                { message: "Email dan password harus diisi" },
                { status: 400 }
            );
        }

        // Forward request ke backend API
        const response = await fetch(`${BASE_URL}/api/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: body.email,
                password: body.password,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { message: data.message || "Login gagal" },
                { status: response.status }
            );
        }

        // Return success response
        return NextResponse.json({
            message: data.message,
            token: data.token,
        });
    } catch (error: unknown) {
        console.error("Login API Error:", error);

        let message = "Terjadi kesalahan server";
        if (error instanceof Error) {
            message = error.message;
        }

        return NextResponse.json({ message }, { status: 500 });
    }
}


