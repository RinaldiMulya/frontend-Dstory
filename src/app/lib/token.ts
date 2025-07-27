
// src\app\lib\auth.ts
export const getToken = (): string | null => {
    if (typeof window !== "undefined") {
        try {
            return localStorage.getItem("token");
        } catch (error) {
            console.error("Error getting token:", error);
            return null;
        }
    }
    return null;
};

export const setToken = (token: string): void => {
    if (typeof window !== "undefined") {
        try {
            localStorage.setItem("token", token);
        } catch (error) {
            console.error("Error setting token:", error);
        }
    }
};

export const isValidToken = (token: string | null): boolean => {
    if (!token) return false;
    try {
        // Check JWT format (3 parts separated by dots)
        const parts = token.split('.');
        return parts.length === 3;
    } catch {
        return false;
    }
};

export const clearToken = (): void => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("token");
    }
};

export const isLoggedIn = (): boolean => {
    return !!getToken();
};
