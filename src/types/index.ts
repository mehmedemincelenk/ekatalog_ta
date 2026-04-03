export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string | null;
  description: string;
  inStock: boolean;
  is_archived: boolean;
}

export interface Category {
  name: string;
  display_order: number;
}

export interface SearchLog {
  timestamp: string;
  term: string;
}
