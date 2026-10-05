import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { StoreService } from '../../../core/services/store.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-checkout',
  imports: [FormsModule, RouterLink, DecimalPipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout {
  protected readonly cartService = inject(CartService);
  protected readonly authService = inject(AuthService);
  private readonly orderService = inject(OrderService);
  private readonly storeService = inject(StoreService);
  private readonly router = inject(Router);

  protected readonly storesResource = rxResource({
    stream: () => this.storeService.getStores(),
  });

  private readonly explicitStoreSlug = signal<string | null>(null);
  protected readonly selectedStoreSlug = computed(
    () => this.explicitStoreSlug() ?? this.storesResource.value()?.[0]?.slug ?? null,
  );
  protected customerType: 'recreational' | 'medical' = 'recreational';
  protected ageConfirmed = false;
  protected paymentMethod: 'cash' | 'debit' | 'canpay' = 'cash';

  protected selectStore(slug: string): void {
    this.explicitStoreSlug.set(slug);
  }

  protected placeOrder(): void {
    const items = this.cartService.items();
    if (items.length === 0 || !this.ageConfirmed) return;

    const stores = this.storesResource.value() ?? [];
    const store = stores.find((s) => s.slug === this.selectedStoreSlug());
    const pickupStoreName = store?.name ?? 'Evergreen';

    const order = this.orderService.placeOrder(items, pickupStoreName);
    if (this.authService.isAuthenticated()) {
      this.authService.addRewardsPoints(order.pointsEarned);
    }
    this.cartService.clear();
    this.router.navigate(['/confirmation'], { queryParams: { order: order.id } });
  }
}
