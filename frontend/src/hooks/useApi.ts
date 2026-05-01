import { useState } from "react";

export const useApi = <T, Args extends unknown[]>(
    apiFunc: (...args: Args) => Promise<T>
) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = async (...args: Args): Promise<T> => {
        setLoading(true);
        setError(null);
        try {
            return await apiFunc(...args);
        } catch (err: any) {
            setError(err.message || "エラーが発生しました");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { execute, loading, error };
};