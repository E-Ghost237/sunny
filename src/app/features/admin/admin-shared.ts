import { ProductCategory } from '../../core/models/product.model';
import { OrderStatus, ORDER_STATUS_LABEL } from '../../core/models/order.model';

export const PRODUCT_CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'flower', label: 'Flower' },
  { value: 'prerolls', label: 'Pre-rolls' },
  { value: 'vapes', label: 'Vapes' },
  { value: 'concentrates', label: 'Concentrates' },
  { value: 'edibles', label: 'Edibles' },
  { value: 'tinctures', label: 'Tinctures' },
  { value: 'capsules', label: 'Capsules' },
  { value: 'topicals', label: 'Topicals' },
  { value: 'beverages', label: 'Beverages' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'ingestibles', label: 'Ingestibles' },
  { value: 'troches', label: 'Troches' },
];

export const STORE_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/** Order statuses in the order an admin works through them, for the list tabs. */
export const ORDER_TABS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'proof-submitted', label: 'Proof to review' },
  { value: 'approved', label: 'Ready to dispatch' },
  { value: 'awaiting-payment', label: 'Awaiting payment' },
  { value: 'proof-rejected', label: 'Proof rejected' },
  { value: 'dispatched', label: 'Dispatched' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const ORDER_STATUS_TEXT = ORDER_STATUS_LABEL;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Short random suffix so new slugs never collide with existing ones. */
export function uniqueSuffix(): string {
  return Math.random().toString(16).slice(2, 8);
}

/** Pull a readable message out of an HttpErrorResponse-like object. */
export function errorMessage(err: unknown, fallback: string): string {
  const body = (err as { error?: { error?: string } })?.error;
  return body?.error ?? fallback;
}
