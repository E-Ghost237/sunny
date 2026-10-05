import { Injectable, signal } from '@angular/core';

import { CartItem } from '../models/cart.model';
import { Order } from '../models/order.model';

const ORDERS_KEY = 'evergreen-orders';

function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

function randomOrderId(): string {
  return `SS-${Math.floor(10000 + Math.random() * 90000)}`;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly _orders = signal<Order[]>(loadOrders());
  readonly orders = this._orders.asReadonly();

  placeOrder(items: CartItem[], pickupStoreName: string): Order {
    const subtotal = items.reduce((sum, i) => sum + i.priceAtAdd * i.quantity, 0);
    const order: Order = {
      id: randomOrderId(),
      items,
      subtotal,
      pointsEarned: Math.round(subtotal),
      pickupStoreName,
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
