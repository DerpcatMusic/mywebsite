// lib/hooks.ts
"use client";

import { useState, useEffect, useCallback } from 'react';
import { getAllFourthwallProducts, FourthwallProduct } from './fourthwall';

export function useProducts() {
  const [products, setProducts] = useState<FourthwallProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedProducts = await getAllFourthwallProducts();
      
      console.log('API Response Data from useProducts hook:', fetchedProducts);

      setProducts(fetchedProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}