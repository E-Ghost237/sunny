import { CartItem } from './cart.model';

/** Payment method ids come from the back-office payment list, so they are open strings. */
export type PaymentMethodId = string;
export type Fulfilment = 'pickup' | 'ship';

export type OrderStatus =
  | 'awaiting-payment'
  | 'proof-submitted'
  | 'proof-rejected'
  | 'approved'
  | 'dispatched'
  | 'completed'
  | 'cancelled';

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  'awaiting-payment': 'Awaiting payment proof',
  'proof-submitted': 'Proof under review',
  'proof-rejected': 'Proof rejected: please upload again',
  approved: 'Payment confirmed',
  dispatched: 'Dispatched',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
}

export interface OrderProof {
  path: string;
  fileName: string;
  uploadedAt: string;
}

export interface OrderHistoryEntry {
  status: OrderStatus;
  at: string;
  note: string;
}

export interface Order {
  id: string; // e.g. "DL-49102", assigned by the server
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
  customer: OrderCustomer;
  status: OrderStatus;
  proof: OrderProof | null;
  rejectionNote: string | null;
  tracking: string | null;
  history: OrderHistoryEntry[];
}
