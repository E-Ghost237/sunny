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
 * Product photo: one generated photo per product, showing its partner brand
 * (public/assets/img/products/{slug}.jpg). Until a product's photo exists the
 * product card shows the premium gradient fallback, never the category photo.
 */
export function productImage(p: Pick<Product, 'slug'>): string {
  return `/assets/img/products/${p.slug}.jpg`;
}

/** Store photo set: outside, inside and all-round (panorama) views. */
export function storeImage(slug: string, view: StoreView = 'exterior'): string {
  return `/assets/img/stores/${slug}-${view}.jpg`;
}
