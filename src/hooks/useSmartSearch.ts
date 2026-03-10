'use client';

import { useState, useCallback } from 'react';
import { smartSearchAction } from '@/actions/products';
import { SEARCH_DEBOUNCE_MS } from '@/lib/constants';
import type { SearchResult } from '@/lib/types';

export function useSmartSearch(userId: string | undefined) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

    const search = useCallback(async (searchQuery: string) => {
        if (!userId || !searchQuery.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            const data = await smartSearchAction(searchQuery.trim());
            setResults(data || []);
        } catch (err) {
            console.error('Search error:', err);
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const handleSearch = useCallback((value: string) => {
        setQuery(value);

        if (debounceTimer) clearTimeout(debounceTimer);

        if (!value.trim()) {
            setResults([]);
            return;
        }

        const timer = setTimeout(() => {
            search(value);
        }, SEARCH_DEBOUNCE_MS);

        setDebounceTimer(timer);
    }, [debounceTimer, search]);

    const clearSearch = useCallback(() => {
        setQuery('');
        setResults([]);
        if (debounceTimer) clearTimeout(debounceTimer);
    }, [debounceTimer]);

    return { query, results, loading, handleSearch, clearSearch };
}
