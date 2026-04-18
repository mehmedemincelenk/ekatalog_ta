import { useMemo } from 'react';
import { TECH } from '../../data/config';
import { Product } from '../../types';

interface UseProductGridLogicProps {
  products: Product[];
  sortedCategories: string[];
  activeCategories: string[];
  isAdmin: boolean;
}

/**
 * HOOK: useProductGridLogic
 * -----------------------------------------------------------
 * Centralizes grouping and filtering logic for the product grid.
 */
export function useProductGridLogic({ 
  products, 
  sortedCategories, 
  activeCategories, 
  isAdmin 
}: UseProductGridLogicProps) {
  
  // 1. Group products by category
  const groupedProducts = useMemo(() => {
    const acc: Record<string, Product[]> = {};
    products.forEach(product => {
      const category = product.category || TECH.products.fallbackCategory;
      if (!acc[category]) acc[category] = [];
      acc[category].push(product);
    });
    return acc;
  }, [products]);

  // 2. Filter categories based on selection and product existence
  const displayCategories = useMemo(() => {
    // Start with the globally sorted list
    let filtered = sortedCategories;

    // Apply Active Category Filter (if any)
    if (activeCategories.length > 0) {
      filtered = sortedCategories.filter(cat => activeCategories.includes(cat));
    }

    // Admin mode: Show everything in order
    if (isAdmin) return filtered;

    // User mode: Only show categories that have products
    return filtered.filter(cat => 
      (groupedProducts[cat] || []).length > 0
    );
  }, [sortedCategories, activeCategories, groupedProducts, isAdmin]);

  return {
    groupedProducts,
    displayCategories
  };
}
