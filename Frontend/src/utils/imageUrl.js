export const DEFAULT_PRODUCT_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500' viewBox='0 0 24 24' fill='%23F3F4F6' stroke='%239CA3AF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2' fill='%23F3F4F6'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5' fill='%239CA3AF'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";

/**
 * Formats image path into a full frontend-accessible URL pointing to the backend (http://localhost:5000)
 */
export const getImageUrl = (imagePath) => {
    if (!imagePath || typeof imagePath !== "string" || imagePath.trim() === "") {
        return DEFAULT_PRODUCT_IMAGE;
    }

    const trimmed = imagePath.trim();

    // Already full HTTP/HTTPS or Data URI
    if (
        trimmed.startsWith("http://") ||
        trimmed.startsWith("https://") ||
        trimmed.startsWith("data:")
    ) {
        return trimmed;
    }

    const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;

    // Path already includes /uploads/ or /upload/
    if (cleanPath.startsWith("/uploads/") || cleanPath.startsWith("/upload/")) {
        return cleanPath;
    }

    // Default to /uploads/
    return `/uploads/${trimmed}`;
};
