import { CartItem } from './cart.model';

export type PaymentMethodId = 'zelle' | 'cashapp' | 'chime' | 'venmo' | 'paypal' | 'bank' | 'applepay';
export type Fulfilment = 'pickup' | 'ship';

export interface Order {
  id: string; // e.g. "DL-49102"
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  pointsEarned: number;
  pickupStoreName: string | null;
  fulfilment: Fulfilment;
  destination: string | null;
  payment: PaymentMethodId;
  placedAt: string;
}
