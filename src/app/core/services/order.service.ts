import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map, of, switchMap, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CartItem } from '../models/cart.model';
import { Fulfilment, Order, OrderCustomer, OrderStatus, PaymentMethodId } from '../models/order.model';
import { UploadService } from './upload.service';

const ORDER_IDS_KEY = 'delight-order-ids';

export interface PlaceOrderInput {
  items: CartItem[];
  shipping: number;
  fulfilment: Fulfilment;
  pickupStoreName: string | null;
  destination: string | null;
  payment: PaymentMethodId;
  customer: OrderCustomer;
}

/** Orders live on the server. This browser remembers which order ids it placed. */
@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly uploads = inject(UploadService);
  private readonly base = `${environment.apiBaseUrl}/orders`;

  myOrderIds(): string[] {
    try {
      return JSON.parse(localStorage.getItem(ORDER_IDS_KEY) ?? '[]') as string[];
    } catch {
      return [];
    }
  }

  private rememberOrder(id: string): void {
    const ids = [id, ...this.myOrderIds().filter((x) => x !== id)].slice(0, 50);
    try {
      localStorage.setItem(ORDER_IDS_KEY, JSON.stringify(ids));
    } catch {
      // Storage blocked: the confirmation page can still be opened from the order reference.
    }
  }

  place(input: PlaceOrderInput): Observable<Order> {
    const subtotal = input.items.reduce((sum, i) => sum + i.priceAtAdd * i.quantity, 0);
    const body = {
      items: input.items,
      subtotal,
      shipping: input.shipping,
      total: subtotal + input.shipping,
      pointsEarned: Math.round(subtotal),
      pickupStoreName: input.pickupStoreName,
      fulfilment: input.fulfilment,
      destination: input.destination,
      payment: input.payment,
      customer: input.customer,
    };
    return this.http.post<Order>(this.base, body).pipe(tap((o) => this.rememberOrder(o.id)));
  }

  get(id: string): Observable<Order | null> {
    return this.http.get<Order[]>(this.base, { params: { id } }).pipe(map((list) => list[0] ?? null));
  }

  /** The orders this browser placed, newest first. */
  mine(): Observable<Order[]> {
    const ids = this.myOrderIds();
    if (!ids.length) return of([]);
    return forkJoin(ids.map((id) => this.get(id))).pipe(
      map((list) => list.filter((o): o is Order => !!o).sort((a, b) => b.placedAt.localeCompare(a.placedAt))),
    );
  }

  /** Customer uploads payment proof (image or PDF). */
  uploadProof(orderId: string, file: File): Observable<Order> {
    return this.uploads.readAsDataUrl(file).pipe(
      switchMap((dataUrl) =>
        this.http.post<Order>(`${this.base}/${encodeURIComponent(orderId)}/proof`, {
          fileName: file.name,
          dataUrl,
        }),
      ),
    );
  }

  /** Back-office status change. The server checks the move is allowed. */
  transition(orderId: string, to: OrderStatus, note = '', tracking = ''): Observable<Order> {
    return this.http.post<Order>(`${this.base}/${encodeURIComponent(orderId)}/transition`, { to, note, tracking });
  }

  /** Back-office list, optionally filtered by status. */
  list(status?: OrderStatus): Observable<Order[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http
      .get<Order[]>(this.base, { params })
      .pipe(map((list) => [...list].sort((a, b) => b.placedAt.localeCompare(a.placedAt))));
  }
}
