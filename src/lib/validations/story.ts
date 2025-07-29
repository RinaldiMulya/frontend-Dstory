import { z } from "zod";

export const createStorySchema = z.object({
    title: z
        .string()
        .min(1, "Judul wajib diisi")
        .max(100, "Judul maksimal 100 karakter"),
    content: z
        .string()
        .min(1, "Deskripsi wajib diisi")
        .max(1000, "Deskripsi maksimal 1000 karakter"),
    image: z
        .instanceof(File, { message: "File tidak valid" })
        .refine((file) => file.size <= 5 * 1024 * 1024, "Ukuran file maksimal 5MB")
        .refine(
            (file) =>
                ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
                    file.type
                ),
            "Format file harus JPEG, PNG, atau WebP"
        ),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
});

export type CreateStoryFormData = z.infer<typeof createStorySchema>;

export interface Story {
    id: number;
    title: string;
    content: string;
    imageUrl: string | null;
    latitude: number;
    longitude: number;
    createdAt: string;
    user: {
        id: number;
        username: string;
    };
}

export interface ApiResponse<T = unknown> {
    message: string;
    story?: T;
    error?: string;
}
