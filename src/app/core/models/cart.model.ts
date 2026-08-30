import { ProductCategory } from './product.model';

// Snapshots display fields at add-time so the cart doesn't need to refetch each
// product just to render -- standard e-commerce pattern (also matches how sunny2's
// cart mockup shows brand/name/meta/price directly on the cart-item).
export interface CartItem {
  productId: number;
  slug: string;
  category: ProductCategory;
  name: string;
  brand: string | null;
  image: string;
  meta: string; // e.g. "Indica · 27.68% THC"
  priceAtAdd: number;
  quantity: number;
}
