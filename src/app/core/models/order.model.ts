import { CartItem } from './cart.model';

export interface Order {
  id: string; // e.g. "SS-49102", matching sunny2's confirmation mockup format
  items: CartItem[];
  subtotal: number;
  pointsEarned: number;
  pickupStoreName: string;
  placedAt: string;
}
