import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { StoreService } from '../../../core/services/store.service';
import { AuthService } from '../../../core/services/auth.service';
import { MarketService, MarketRegion } from '../../../core/services/market.service';
import { Fulfilment, PaymentMethodId } from '../../../core/models/order.model';
import { SmartImage } from '../../../shared/smart-image/smart-image';
import { storeImage } from '../../../shared/utils/media';
import { PaymentService } from '../../../core/services/payment.service';
import { PaymentMethod } from '../../../core/models/payment.model';

export const SHIPPING_FEE = 12;
export const FREE_SHIPPING_OVER = 150;

const DESTINATIONS: Record<MarketRegion, string[]> = {
  us: [
    'Alaska', 'Arizona', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Hawaii', 'Illinois',
    'Kentucky', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Missouri', 'Montana', 'Nevada',
    'New Jersey', 'New Mexico', 'New York', 'Ohio', 'Oregon', 'Pennsylvania', 'Rhode Island', 'Vermont',
    'Virginia', 'Washington',
  ],
  ca: [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Nova Scotia',
    'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Northwest Territories', 'Nunavut', 'Yukon',
  ],
  eu: [
    'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czechia', 'Denmark', 'Estonia', 'Finland', 'France',
    'Germany', 'Greece', 'Hungary', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta',
    'Netherlands', 'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden',
  ],
};

const REGION_LABEL: Record<MarketRegion, string> = { us: 'State', ca: 'Province / territory', eu: 'Country' };

@Component({
  selector: 'app-checkout',
  imports: [FormsModule, RouterLink, CurrencyPipe, SmartImage],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout {
  protected readonly cartService = inject(CartService);
  protected readonly authService = inject(AuthService);
  protected readonly market = inject(MarketService);
  private readonly orderService = inject(OrderService);
  private readonly storeService = inject(StoreService);
  private readonly router = inject(Router);

  protected readonly storeImage = storeImage;
  private readonly paymentService = inject(PaymentService);
  /** Enabled payment methods from the back-office, in display order. */
  protected readonly paymentMethodsResource = rxResource({
    stream: () => this.paymentService.getEnabled(),
  });
  protected readonly paymentMethods = computed<PaymentMethod[]>(() => this.paymentMethodsResource.value() ?? []);
  protected readonly placing = signal(false);
  protected readonly placeError = signal<string | null>(null);
  protected readonly freeShippingOver = FREE_SHIPPING_OVER;
  protected readonly shippingFee = SHIPPING_FEE;
  protected readonly regionLabel = computed(() => REGION_LABEL[this.market.market()]);
  protected readonly destinations = computed(() => DESTINATIONS[this.market.market()]);

  protected readonly storesResource = rxResource({
    stream: () => this.storeService.getStores(),
  });
  protected readonly stores = computed(() => this.storesResource.value() ?? []);

  // ---- Form state -------------------------------------------------------------
  protected fulfilment = signal<Fulfilment>('pickup');
  protected readonly explicitStoreSlug = signal<string | null>(null);
  protected readonly selectedStoreSlug = computed(() => this.explicitStoreSlug() ?? this.stores()[0]?.slug ?? null);
  protected customerType: 'recreational' | 'medical' = 'recreational';
  protected ageConfirmed = false;
  protected readonly paymentMethod = signal<PaymentMethodId | null>(null);
  protected readonly submitted = signal(false);
  protected readonly copied = signal(false);

  protected contact = { firstName: '', lastName: '', email: '', phone: '' };
  protected address = { line1: '', city: '', region: '', postal: '' };

  // ---- Derived ----------------------------------------------------------------
  protected readonly subtotal = this.cartService.subtotal;
  protected readonly shipping = computed(() => {
    if (this.fulfilment() === 'pickup') return 0;
    return this.subtotal() >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE;
  });
  protected readonly total = computed(() => this.subtotal() + this.shipping());
  protected readonly amountToFreeShipping = computed(() => Math.max(0, FREE_SHIPPING_OVER - this.subtotal()));
  protected readonly selectedStore = computed(() => this.stores().find((s) => s.slug === this.selectedStoreSlug()) ?? null);
  protected readonly selectedMethod = computed<PaymentMethod | null>(
    () => this.paymentMethods().find((m) => m.id === this.paymentMethod()) ?? null,
  );

  protected readonly errors = computed(() => {
    const e: string[] = [];
    if (!this.contact.firstName || !this.contact.lastName) e.push('Enter your name.');
    if (!this.contact.email.includes('@')) e.push('Enter a valid email address.');
    if (this.fulfilment() === 'ship' && (!this.address.line1 || !this.address.city || !this.address.postal || !this.address.region))
      e.push('Complete your shipping address.');
    if (this.fulfilment() === 'pickup' && !this.selectedStoreSlug()) e.push('Choose a pickup location.');
    if (!this.ageConfirmed) e.push('Confirm you are 21 or older.');
    if (!this.paymentMethod()) e.push('Choose a payment method.');
    return e;
  });

  protected readonly canSubmit = computed(() => this.errors().length === 0 && this.cartService.items().length > 0);

  // ---- Actions ----------------------------------------------------------------
  protected selectStore(slug: string): void {
    this.explicitStoreSlug.set(slug);
  }

  protected choosePayment(id: PaymentMethodId): void {
    this.paymentMethod.set(id);
  }

  protected copyRecipient(value: string): void {
    navigator.clipboard?.writeText(value).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1600);
    });
  }

  protected placeOrder(): void {
    this.submitted.set(true);
    if (!this.canSubmit() || this.placing()) return;

    const store = this.selectedStore();
    const isPickup = this.fulfilment() === 'pickup';
    this.placing.set(true);
    this.placeError.set(null);
    this.orderService
      .place({
        items: this.cartService.items(),
        shipping: this.shipping(),
        fulfilment: this.fulfilment(),
        pickupStoreName: isPickup ? (store?.name ?? null) : null,
        destination: isPickup ? null : `${this.address.line1}, ${this.address.city}, ${this.address.region} ${this.address.postal}`,
        payment: this.paymentMethod()!,
        customer: {
          name: `${this.contact.firstName} ${this.contact.lastName}`.trim(),
          email: this.contact.email,
          phone: this.contact.phone,
        },
      })
      .subscribe({
        next: (order) => {
          if (this.authService.isAuthenticated()) {
            this.authService.addRewardsPoints(order.pointsEarned);
          }
          this.cartService.clear();
          this.placing.set(false);
          this.router.navigate(['/confirmation'], { queryParams: { order: order.id } });
        },
        error: () => {
          this.placing.set(false);
          this.placeError.set('We could not place your order just now. Please try again.');
        },
      });
  }
}
