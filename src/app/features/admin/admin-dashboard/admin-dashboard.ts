import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { OrderService } from '../../../core/services/order.service';
import { AdminDataService } from '../../../core/services/admin-data.service';
import { ORDER_STATUS_LABEL } from '../../../core/models/order.model';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './admin-dashboard.html',
})
export class AdminDashboard {
  private readonly orders = inject(OrderService);
  private readonly data = inject(AdminDataService);

  protected readonly ordersRes = rxResource({ stream: () => this.orders.list() });
  protected readonly productsRes = rxResource({ stream: () => this.data.products() });
  protected readonly storesRes = rxResource({ stream: () => this.data.stores() });

  protected readonly all = computed(() => this.ordersRes.value() ?? []);
  protected readonly needsReview = computed(() => this.all().filter((o) => o.status === 'proof-submitted').length);
  protected readonly readyToDispatch = computed(() => this.all().filter((o) => o.status === 'approved').length);
  protected readonly awaitingProof = computed(
    () => this.all().filter((o) => o.status === 'awaiting-payment' || o.status === 'proof-rejected').length,
  );
  protected readonly revenue = computed(() =>
    this.all()
      .filter((o) => o.status !== 'cancelled' && o.status !== 'awaiting-payment' && o.status !== 'proof-rejected')
      .reduce((sum, o) => sum + o.total, 0),
  );
  protected readonly recent = computed(() => this.all().slice(0, 6));
  protected readonly statusLabel = ORDER_STATUS_LABEL;
}
