import { Component, computed, inject, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ProductService } from '../../../core/services/product.service';
import { SelectedStoreService } from '../../../core/services/selected-store.service';
import { StoreService } from '../../../core/services/store.service';
import { StoreHours, StoreLocation } from '../../../core/models/store.model';
import { PAYMENT_METHODS } from '../../checkout/payment/payment-methods';
import { SmartImage } from '../../../shared/smart-image/smart-image';
import { Reveal } from '../../../shared/directives/reveal.directive';
import { STORE_VIEWS, StoreView, storeImage } from '../../../shared/utils/media';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

@Component({
  selector: 'app-store-detail',
  imports: [RouterLink, SmartImage, Reveal, CurrencyPipe],
  templateUrl: './store-detail.html',
  styleUrl: './store-detail.scss',
})
export class StoreDetail {
  private readonly storeService = inject(StoreService);
  private readonly productService = inject(ProductService);
  private readonly selectedStore = inject(SelectedStoreService);

  readonly slug = input.required<string>();

  protected readonly views = STORE_VIEWS;
  protected readonly activeView = signal<StoreView>('exterior');
  /** Horizontal look-around position for the all-round (panorama) view, 0-100. */
  protected readonly panPosition = signal(50);
  protected readonly storeImage = storeImage;
  protected readonly paymentMethods = PAYMENT_METHODS;
  protected readonly hoursOpen = signal(false);

  protected readonly storeResource = rxResource({
    params: () => ({ slug: this.slug() }),
    stream: ({ params }) => this.storeService.getStoreBySlug(params.slug),
  });

  protected readonly store = computed<StoreLocation | null>(() => this.storeResource.value()?.[0] ?? null);

  protected readonly isSelected = computed(() => this.selectedStore.slug() === this.slug());

  protected readonly productsResource = rxResource({
    stream: () => this.productService.getAllProducts(),
  });

  /** Products with a live discount, shown as "Savings at this store". */
  protected readonly savings = computed(() =>
    (this.productsResource.value() ?? []).filter((p) => p.discountedPrice != null && p.discountedPrice < p.price).slice(0, 6),
  );

  protected readonly directionsUrl = computed(() => {
    const s = this.store();
    if (!s) return '';
    const query = `${s.address.streetAddress} ${s.address.addressLocality} ${s.address.addressRegion}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  });

  protected readonly todayName = DAY_NAMES[new Date().getDay()];

  protected readonly todayHours = computed<StoreHours | null>(() => {
    const s = this.store();
    return s?.openingHours.find((h) => h.day === this.todayName) ?? null;
  });

  protected readonly hasMedical = computed(() => {
    const s = this.store();
    return !!s && (s.capabilities.medPickup || s.capabilities.medDelivery);
  });

  /** Store Details bullets, built only from what this store actually offers. */
  protected readonly detailBullets = computed(() => {
    const s = this.store();
    if (!s) return [] as string[];
    const c = s.capabilities;
    const bullets = [`Open ${s.openingHours.length} days a week`];
    if (c.recPickup) bullets.push('Recreational pickup');
    if (c.recDelivery) bullets.push('Recreational delivery');
    if (c.medPickup) bullets.push('Medical pickup');
    if (c.medDelivery) bullets.push('Medical delivery');
    if (s.timezone) bullets.push(`Local time zone: ${s.timezone.replace('_', ' ')}`);
    return bullets;
  });

  protected readonly visitSteps = [
    { n: '01', title: 'Show your ID', body: 'Bring a valid, government-issued photo ID. Medical patients also bring their card.' },
    { n: '02', title: 'Browse at your pace', body: 'Explore the shelves freely. No pressure, no rush.' },
    { n: '03', title: 'Ask a specialist', body: 'Our team will help you match the right product to your goals.' },
    { n: '04', title: 'Take it home', body: 'Your order is sealed in discreet, recyclable packaging.' },
  ];

  protected setView(view: StoreView): void {
    this.activeView.set(view);
  }

  protected toggleHours(): void {
    this.hoursOpen.update((v) => !v);
  }

  protected shopHere(): void {
    this.selectedStore.set(this.slug());
  }
}
