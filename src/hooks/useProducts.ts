'use client';

import { useState, useCallback } from 'react';
import type { Product, SKU } from '@/lib/types';

export function useProducts(userId: string | undefined) {
    const [products, setProducts] = useState<(Product & { skus: SKU[] })[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/products');
            if (!res.ok) throw new Error('Failed to fetch products');
            const data = await res.json();
            setProducts(data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching products');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const addProduct = useCallback(async (
        productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>,
        skuCodes: string[]
    ) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productData, skuCodes })
            });

            if (!res.ok) throw new Error('Failed to add product');
            const newProduct = await res.json();
            await fetchProducts();
            return newProduct;
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Failed to add product';
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    }, [fetchProducts]);

    const deleteProduct = useCallback(async (productId: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/products/${productId}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error('Failed to delete product');

            await fetchProducts();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete product');
        } finally {
            setLoading(false);
        }
    }, [fetchProducts]);

    return { products, loading, error, fetchProducts, addProduct, deleteProduct };
}
