import { Product } from '../../core/models/product.model';

export type StoreView = 'exterior' | 'interior' | 'panorama';

export const STORE_VIEWS: { key: StoreView; label: string }[] = [
  { key: 'exterior', label: 'Outside' },
  { key: 'interior', label: 'Inside' },
  { key: 'panorama', label: 'All round' },
];

/** Category photo (generated), used for product cards and category tiles. */
export function categoryImage(slug: string): string {
  return `/assets/img/cat-${slug}.jpg`;
}

/**
 * Product photo. The catalog only has placeholder art, so every product shows its
 * category photo until real per-product photos are dropped into /assets/img/products/.
 */
export function productImage(p: Pick<Product, 'images' | 'category'>): string {
  const first = p.images?.[0];
  if (first && !first.startsWith('/assets/placeholder/')) return first;
  return categoryImage(p.category);
}

/** Store photo set: outside, inside and all-round (panorama) views. */
export function storeImage(slug: string, view: StoreView = 'exterior'): string {
  return `/assets/img/stores/${slug}-${view}.jpg`;
}
