// src/utils/index.ts

// Format tanggal
export function showFormattedDate(
    date: string | Date,
    locale = "en-US",
    options: Intl.DateTimeFormatOptions = {}
): string {
    return new Date(date).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
        ...options,
    });
}

// Delay eksekusi
export function sleep(time = 1000): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, time));
}
