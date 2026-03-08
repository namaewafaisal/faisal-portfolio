/**
 * useFetch — Generic hook for fetching data from our backend API.
 * Handles loading, error, and data states automatically.
 *
 * Usage:
 *   const { data, loading, error } = useFetch('/api/github/pinned');
 */
import { useState, useEffect } from "react";

export function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!url) return;
        let cancelled = false;

        setLoading(true);
        setError(null);

        fetch(url)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((json) => {
                if (!cancelled) {
                    if (json.success) {
                        setData(json.data);
                    } else {
                        setError(json.error || "Unknown error");
                    }
                    setLoading(false);
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    setError(err.message);
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [url]);

    return { data, loading, error };
}
