import { useMemo } from 'react';
import { sortCategories, TECH } from '../../data/config';
import { Product } from '../../types';

interface UseProductGridLogicProps {
  products: Product[];
  categoryOrder: string[];
  activeCategories: string[];
  isAdmin: boolean;
}

/**
 * HOOK: useProductGridLogic
 * -----------------------------------------------------------
 * Centralizes grouping, filtering, and sorting logic for the product grid.
 */
export function useProductGridLogic({ 
  products, 
  categoryOrder, 
  activeCategories, 
  isAdmin 
}: UseProductGridLogicProps) {
  
  // 1. Group products by category
  const groupedProducts = useMemo(() => {
    return products.reduce((acc, product) => {
      const category = product.category || TECH.products.fallbackCategory;
      if (!acc[category]) acc[category] = [];
      acc[category].push(product);
      return acc;
    }, {} as Record<string, Product[]>);
  }, [products]);

  // 2. Determine display categories based on filters and admin status
  const displayCategories = useMemo(() => {
    const existingInProducts = Object.keys(groupedProducts);
    const allCategories = [...new Set([...categoryOrder, ...existingInProducts])];

    let filtered = allCategories;
    if (activeCategories.length > 0) {
      filtered = allCategories.filter(cat => activeCategories.includes(cat));
    }

    const sorted = sortCategories(filtered, categoryOrder);

    if (isAdmin) return sorted;

    // User mode: Show categories with products OR explicitly selected categories
    return sorted.filter(cat => 
      (groupedProducts[cat] || []).length > 0 || activeCategories.includes(cat)
    );
  }, [groupedProducts, categoryOrder, activeCategories, isAdmin]);

  return {
    groupedProducts,
    displayCategories
  };
}
