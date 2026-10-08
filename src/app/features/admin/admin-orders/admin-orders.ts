import { Component, computed, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { OrderService } from '../../../core/services/order.service';
import { ORDER_STATUS_LABEL, OrderStatus } from '../../../core/models/order.model';
import { ORDER_TABS } from '../admin-shared';

@Component({
  selector: 'app-admin-orders',
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './admin-orders.html',
})
export class AdminOrders {
  private readonly orders = inject(OrderService);
  private readonly route = inject(ActivatedRoute);

  protected readonly tabs = ORDER_TABS;
  protected readonly statusLabel = ORDER_STATUS_LABEL;
  private readonly initialTab = toSignal(
    this.route.queryParamMap.pipe(map((q) => (q.get('tab') as OrderStatus | 'all' | null) ?? 'all')),
    { initialValue: 'all' as OrderStatus | 'all' },
  );
  protected readonly tab = signal<OrderStatus | 'all'>('all');
  protected readonly query = signal('');

  constructor() {
    this.tab.set(this.initialTab());
  }

  protected readonly listRes = rxResource({ stream: () => this.orders.list() });
  protected readonly all = computed(() => this.listRes.value() ?? []);

  protected readonly counts = computed(() => {
    const c: Record<string, number> = { all: this.all().length };
    for (const o of this.all()) c[o.status] = (c[o.status] ?? 0) + 1;
    return c;
  });

  protected readonly rows = computed(() => {
    const q = this.query().trim().toLowerCase();
    return this.all().filter(
      (o) =>
        (this.tab() === 'all' || o.status === this.tab()) &&
        (!q || o.id.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q) || o.customer.email.toLowerCase().includes(q)),
    );
  });

  protected setTab(value: OrderStatus | 'all'): void {
    this.tab.set(value);
  }
}
