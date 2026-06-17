import { useState, useEffect, useCallback } from 'react';
import type { SystemMetrics } from '../types/metrics';

export interface MetricsState {
    data: SystemMetrics | null;
    error: string | null;
    loading: boolean;
}

export function useMetrics(): MetricsState {
    const [state, setState] = useState<MetricsState>({
        data: null, error: null, loading: true,
    });

    const fetchMetrics = useCallback(async () => {
        try {
            const res = await fetch('/api/metrics');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data: SystemMetrics = await res.json();
            setState({ data, error: null, loading: false });
        } catch (err) {
            setState(prev => ({
                ...prev,
                error: err instanceof Error ? err.message : 'Unknown error',
                loading: false,
            }));
        }
    }, []);

    useEffect(() => {
        fetchMetrics();
        const id = setInterval(fetchMetrics, 2500);
        return () => clearInterval(id);
    }, [fetchMetrics]);

    return state;
}