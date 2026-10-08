import { Component, computed, inject, input, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { OrderService } from '../../../core/services/order.service';
import { paymentMethod } from '../payment/payment-methods';
import { SmartImage } from '../../../shared/smart-image/smart-image';
import { Reveal } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-confirmation',
  imports: [RouterLink, CurrencyPipe, SmartImage, Reveal],
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
  protected readonly method = computed(() => (this.placedOrder() ? paymentMethod(this.placedOrder()!.payment) : null));
  protected readonly copied = signal(false);

  protected copyRef(ref: string): void {
    navigator.clipboard?.writeText(ref).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1600);
    });
  }
}
