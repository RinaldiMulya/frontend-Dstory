// src/lib/api/stories.ts
import { getToken } from '../../lib/token'
import { BASE_URL } from '../../../utils/config';
import { CreateStoryFormData, Story, ApiResponse } from '../../../lib/validations/story';

export const storiesApi = {
    // Get all stories
    getStories: async (): Promise<Story[]> => {
        try {
            const token = getToken();
            const response = await fetch(`${BASE_URL}/api/stories`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error(`HTTP error! ${response.status}`);
            const stories = await response.json();
            return stories;
        } catch (err) {
            console.error("Failed to fetch stories:", err);
            throw err;
        }
    },

    // Create new story - sesuai dengan backend controller
    createStory: async (
        data: CreateStoryFormData
    ): Promise<ApiResponse<Story>> => {
        try {
            const token = getToken();
            const formData = new FormData();

            // Sesuai dengan backend: title, content, latitude, longitude, file (image)
            formData.append("title", data.title);
            formData.append("content", data.content);
            formData.append("image", data.image); // Backend menggunakan req.file untuk ini

            if (data.latitude !== undefined) {
                formData.append("latitude", data.latitude.toString());
            }
            if (data.longitude !== undefined) {
                formData.append("longitude", data.longitude.toString());
            }

            const response = await fetch(`${BASE_URL}/stories`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    // Jangan set Content-Type untuk FormData, browser akan set otomatis
                },
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || result.error || "Failed to create story"
                );
            }

            return result;
        } catch (err) {
            console.error("Failed to create story:", err);
            throw err;
        }
    },

    // Delete story
    deleteStory: async (id: number): Promise<ApiResponse> => {
        try {
            const token = getToken();
            const response = await fetch(`${BASE_URL}/stories/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(
                    result.message || result.error || "Gagal menghapus story"
                );
            }
            return result;
        } catch (err) {
            console.error("Failed to delete story:", err);
            throw err;
        }
    },
};
