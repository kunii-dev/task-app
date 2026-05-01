export const createApiClient = (logout) => {
    return async function apiFetch(url, options = {}) {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(url, {
                ...options,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                    ...options.headers,
                },
            });

            if (res.status === 401) {
                logout();
                throw new Error("Unauthorized");
            }

            return res;
        } catch (error) {
            // 🔥 これが超重要
            throw error;
        }
    };
};