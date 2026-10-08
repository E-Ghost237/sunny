import { Injectable, signal } from '@angular/core';

import { CartItem } from '../models/cart.model';
import { Fulfilment, Order, PaymentMethodId } from '../models/order.model';

const ORDERS_KEY = 'delight-orders';

function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

function randomOrderId(): string {
  return `DL-${Math.floor(10000 + Math.random() * 90000)}`;
}

export interface PlaceOrderInput {
  items: CartItem[];
  shipping: number;
  fulfilment: Fulfilment;
  pickupStoreName: string | null;
  destination: string | null;
  payment: PaymentMethodId;
}

/**
 * Local order store. Replace the body of placeOrder() with a real API call later;
 * components only depend on this signature.
 */
@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly _orders = signal<Order[]>(loadOrders());
  readonly orders = this._orders.asReadonly();

  placeOrder(input: PlaceOrderInput): Order {
    const subtotal = input.items.reduce((sum, i) => sum + i.priceAtAdd * i.quantity, 0);
    const order: Order = {
      id: randomOrderId(),
      items: input.items,
      subtotal,
      shipping: input.shipping,
      total: subtotal + input.shipping,
      pointsEarned: Math.round(subtotal),
      pickupStoreName: input.pickupStoreName,
      fulfilment: input.fulfilment,
      destination: input.destination,
      payment: input.payment,
      placedAt: new Date().toISOString(),
    };
    this._orders.update((orders) => {
      const next = [order, ...orders];
      localStorage.setItem(ORDERS_KEY, JSON.stringify(next));
      return next;
    });
    return order;
  }
}
