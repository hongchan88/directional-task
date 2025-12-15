import { redirect } from "react-router-dom";

/**
 * Helper to check authentication in loaders.
 * Throws a redirect to login if not authenticated.
 * Use at the start of protected route loaders.
 */
export function requireAuth() {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        throw redirect("/auth/login");
    }
    return token;
}
