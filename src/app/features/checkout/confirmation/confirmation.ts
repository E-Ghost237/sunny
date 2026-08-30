import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-confirmation',
  imports: [RouterLink],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.scss',
})
export class Confirmation {
  private readonly orderService = inject(OrderService);

  // Bound from the `order` query param via withComponentInputBinding().
  readonly order = input<string>();

  protected readonly placedOrder = computed(() => {
    const id = this.order();
    if (!id) return this.orderService.orders()[0] ?? null;
    return this.orderService.orders().find((o) => o.id === id) ?? this.orderService.orders()[0] ?? null;
  });
}
