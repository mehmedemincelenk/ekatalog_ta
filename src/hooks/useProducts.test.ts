import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useProducts } from './useProducts';

// Vite env mock - Kritik kısım
vi.mock('../hooks/useProducts', async (importOriginal) => {
  return {
    ...await importOriginal<any>(),
  };
});

// Global mock for meta.env
(import.meta as any).env = {
  VITE_SHEET_URL: 'https://mock-sheet-url.com',
  VITE_SHEET_SCRIPT_URL: 'https://mock-script-url.com'
};

// Global Fetch Mock Data
const mockProducts = Array.from({ length: 50 }, (_, i) => ({
  id: String(i + 1),
  name: `Ürün ${i + 1}`,
  category: i < 10 ? 'KÖPÜK' : 'DİĞER',
  price: '₺100,00',
  inStock: 'true',
  is_archived: 'false'
}));

const csvData = "id,name,category,price,inStock,is_archived\n" + 
  mockProducts.map(p => `${p.id},${p.name},${p.category},${p.price},${p.inStock},${p.is_archived}`).join("\n");

describe('useProducts Hook (QA Deep Scan)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    
    // Proje kodundaki SHEET_URL kontrolünü geçmek için mock env
    vi.stubEnv('VITE_SHEET_URL', 'https://mock-sheet-url.com');

    // Mock fetch
    global.fetch = vi.fn().mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        text: () => Promise.resolve(csvData)
      });
    });
  });

  it('should load initial 40 products and set hasMore to true if total > 40', async () => {
    const { result } = renderHook(() => useProducts('', [], false));
    
    // Yüklenmenin bitmesini bekle
    await waitFor(() => expect(result.current.loading).toBe(false), { timeout: 3000 });
    
    expect(result.current.products.length).toBe(40);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.totalCount).toBe(50);
  });

  it('should show all products when loadMore is called', async () => {
    const { result } = renderHook(() => useProducts('', [], false));
    
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    act(() => {
      result.current.loadMore();
    });
    
    expect(result.current.products.length).toBe(50);
    expect(result.current.hasMore).toBe(false);
  });

  it('should show all products immediately in Admin mode', async () => {
    const { result } = renderHook(() => useProducts('', [], true));
    
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    expect(result.current.products.length).toBe(50);
    expect(result.current.hasMore).toBe(false);
  });

  it('should cache products to localStorage on successful fetch', async () => {
    const { result } = renderHook(() => useProducts('', [], false));
    
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    const cachedData = localStorage.getItem('toptanambalaj_products_v12_data_cache');
    expect(cachedData).not.toBeNull();
    expect(JSON.parse(cachedData!).length).toBe(50);
  });

  it('should filter products by search term', async () => {
    const { result } = renderHook(() => useProducts('Ürün 10', [], false));
    
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    // Filtrelenmiş listeyi kontrol et
    expect(result.current.products.length).toBeGreaterThan(0);
    expect(result.current.products.every(p => p.name.toLowerCase().includes('ürün 10'))).toBe(true);
  });

  it('should filter products by category', async () => {
    const { result } = renderHook(() => useProducts('', ['KÖPÜK'], false));
    
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    expect(result.current.products.length).toBe(10);
    expect(result.current.products.every(p => p.category === 'KÖPÜK')).toBe(true);
  });
});
