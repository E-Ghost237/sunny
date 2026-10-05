// Field names match the real, extracted catalog exactly (see
// sunny/extract/extract_products.py) -- no invented fields.

export type ProductCategory =
  | 'accessories'
  | 'beverages'
  | 'capsules'
  | 'concentrates'
  | 'edibles'
  | 'flower'
  | 'ingestibles'
  | 'prerolls'
  | 'tinctures'
  | 'topicals'
  | 'troches'
  | 'vapes';

export interface Product {
  id: number;
  slug: string;
  name: string;
  brand: string | null;
  strain: string | null; // e.g. 'Indica' | 'Sativa' | 'Hybrid'
  strainName: string | null;
  strainDescription: string | null;
  productDescription: string | null;
  thc: string | null; // pre-formatted, e.g. "27.68%"
  cbd: string | null;
  cbn: string | null;
  thcRaw: number | null;
  thcaRaw: number | null;
  cbdRaw: number | null;
  cbdaRaw: number | null;
  isPctBased: boolean | null;
  size: string | null;
  price: number;
  discountedPrice: number | null;
  badge: string | null;
  isExclusive: boolean;
  images: string[];
  category: ProductCategory;
}
