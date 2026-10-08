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
 * Product photo: the product's first real image (uploaded in the back-office or
 * generated), otherwise the photo at its default path. A missing file shows the
 * premium gradient fallback.
 */
export function productImage(p: Pick<Product, 'slug'> & { images?: string[] }): string {
  return productImages(p)[0];
}

/** All real product images in order (the first one is the main photo). */
export function productImages(p: Pick<Product, 'slug'> & { images?: string[] }): string[] {
  const real = (p.images ?? []).filter((src) => src && !src.startsWith('/assets/placeholder/'));
  return real.length ? real : [`/assets/img/products/${p.slug}.jpg`];
}

/** Store photo set: outside, inside and all-round (panorama) views. */
export function storeImage(
  store: string | { slug: string; photos?: Partial<Record<StoreView, string>> },
  view: StoreView = 'exterior',
): string {
  if (typeof store === 'string') return `/assets/img/stores/${store}-${view}.jpg`;
  return store.photos?.[view] || `/assets/img/stores/${store.slug}-${view}.jpg`;
}
