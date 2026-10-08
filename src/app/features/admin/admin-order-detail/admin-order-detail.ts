import { Component, computed, inject, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { of } from 'rxjs';

import { OrderService } from '../../../core/services/order.service';
import { ORDER_STATUS_LABEL, Order, OrderStatus } from '../../../core/models/order.model';
import { errorMessage } from '../admin-shared';

/** Moves an admin may make from each status. The server enforces the same rules. */
const NEXT: Record<OrderStatus, OrderStatus[]> = {
  'awaiting-payment': ['cancelled'],
  'proof-submitted': ['approved', 'proof-rejected', 'cancelled'],
  'proof-rejected': ['cancelled'],
  approved: ['dispatched', 'cancelled'],
  dispatched: ['completed'],
  completed: [],
  cancelled: [],
};

@Component({
  selector: 'app-admin-order-detail',
  imports: [RouterLink, CurrencyPipe, DatePipe, FormsModule],
  templateUrl: './admin-order-detail.html',
})
export class AdminOrderDetail {
  private readonly orders = inject(OrderService);

  /** Bound from the :id route param. */
  readonly id = input<string>();

  protected readonly orderRes = rxResource({
    params: () => this.id(),
    stream: ({ params }) => (params ? this.orders.get(params) : of(null)),
  });
  protected readonly order = computed<Order | null>(() => this.orderRes.value() ?? null);
  protected readonly statusLabel = ORDER_STATUS_LABEL;

  protected readonly rejectNote = signal('');
  protected readonly tracking = signal('');
  protected readonly busy = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly notice = signal<string | null>(null);
  protected readonly proofIsPdf = computed(() => !!this.order()?.proof?.path.toLowerCase().endsWith('.pdf'));

  protected available(o: Order): OrderStatus[] {
    return NEXT[o.status] ?? [];
  }

  protected act(to: OrderStatus): void {
    const o = this.order();
    if (!o || this.busy()) return;
    if (to === 'proof-rejected' && !this.rejectNote().trim()) {
      this.error.set('Add a short note so the customer knows what to fix.');
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    this.notice.set(null);
    this.orders.transition(o.id, to, this.rejectNote().trim(), this.tracking().trim()).subscribe({
      next: (updated) => {
        this.orderRes.set(updated);
        this.busy.set(false);
        this.rejectNote.set('');
        this.notice.set(`Order moved to “${ORDER_STATUS_LABEL[to]}”.`);
      },
      error: (err) => {
        this.busy.set(false);
        this.error.set(errorMessage(err, 'That change could not be saved.'));
      },
    });
  }

  protected dispatchLabel(o: Order): string {
    return o.fulfilment === 'pickup' ? 'Mark ready for collection' : 'Mark dispatched';
  }

  protected actionLabel(to: OrderStatus, o: Order): string {
    switch (to) {
      case 'approved':
        return 'Approve payment';
      case 'proof-rejected':
        return 'Reject proof';
      case 'dispatched':
        return this.dispatchLabel(o);
      case 'completed':
        return 'Mark completed';
      case 'cancelled':
        return 'Cancel order';
      default:
        return to;
    }
  }
}
