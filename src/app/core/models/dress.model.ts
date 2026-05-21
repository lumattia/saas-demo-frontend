export interface Dress {
  id: number;
  title: string;
  sku: string;
  size?: string;
  color?: string;
  stock?: number;
  price?: number;
}

export interface DressFilter {
  title?: string;
  sku?: string;
  size?: string;
  color?: string;
  minStock?: number;
  maxStock?: number;
  minPrice?: number;
  maxPrice?: number;
}
