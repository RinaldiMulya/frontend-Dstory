// src/app/api/storiesApi.ts
import { getToken } from "../lib/token";
import { BASE_URL } from "../../utils/config";
import {
    CreateStoryFormData,
    Story,
    ApiResponse,
} from "../../lib/validations/story";

export const storiesApi = {
    // Get all stories
    getStories: async (): Promise<Story[]> => {
        try {
            const token = getToken();
            const response = await fetch(`${BASE_URL}/api/stories`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! ${response.status}`);
            }

            const stories = await response.json();
            return stories;
        } catch (err) {
            console.error("Failed to fetch stories:", err);
            throw err;
        }
    },

    // Create new story
    createStory: async (
        data: CreateStoryFormData
    ): Promise<ApiResponse<Story>> => {
        try {
            const token = getToken();
            const formData = new FormData();

            formData.append("title", data.title);
            formData.append("content", data.content);
            formData.append("image", data.image);

            if (data.latitude !== undefined) {
                formData.append("latitude", data.latitude.toString());
            }
            if (data.longitude !== undefined) {
                formData.append("longitude", data.longitude.toString());
            }

            const response = await fetch(`${BASE_URL}/api/stories`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    // Jangan set Content-Type untuk FormData, biarkan browser yang handle
                },
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                console.error("Server response:", result);
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

            if (!token) {
                throw new Error("No authentication token found");
            }

            console.log(`Attempting to delete story with ID: ${id}`);

            const response = await fetch(`${BASE_URL}/api/stories/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                let errorMessage = `Failed to delete story (${response.status})`;

                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch {
                    // Jika response bukan JSON, gunakan status text
                    errorMessage = response.statusText || errorMessage;
                }

                console.error("Delete request failed:", {
                    status: response.status,
                    statusText: response.statusText,
                    url: response.url,
                });

                throw new Error(errorMessage);
            }

            const result = await response.json();
            return result;
        } catch (err) {
            console.error("Failed to delete story:", err);
            throw err;
        }
    },
};
