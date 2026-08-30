import { Component, computed, inject, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { StoreService } from '../../../core/services/store.service';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Ported from sunny2's real store-single thumb row -- the source design uses
// emoji icons here too, not real photos (confirmed against the live prototype).
const STORE_THUMBS = ['🏪', '🛍️', '🏬', '📍'];

@Component({
  selector: 'app-store-detail',
  imports: [RouterLink],
  templateUrl: './store-detail.html',
  styleUrl: './store-detail.scss',
})
export class StoreDetail {
  private readonly storeService = inject(StoreService);

  readonly slug = input.required<string>();

  protected readonly thumbs = STORE_THUMBS;
  protected readonly activeThumb = signal(0);

  protected readonly storeResource = rxResource({
    params: () => ({ slug: this.slug() }),
    stream: ({ params }) => this.storeService.getStoreBySlug(params.slug),
  });

  protected readonly store = computed(() => this.storeResource.value()?.[0] ?? null);

  protected readonly directionsUrl = computed(() => {
    const s = this.store();
    if (!s) return '';
    const query = `${s.address.streetAddress} ${s.address.addressLocality} ${s.address.addressRegion}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  });

  protected readonly todayName = DAY_NAMES[new Date().getDay()];

  protected readonly visitSteps = [
    { n: 1, title: 'Show your ID at reception.', body: 'Bring a valid, non-expired government-issued photo ID. Medical patients must also bring their cannabis card.' },
    { n: 2, title: 'Enter and explore freely.', body: 'Browse products at your own pace. No pressure.' },
    { n: 3, title: 'Consult a Wellness Advisor.', body: 'Our staff help you find the right product for your goals.' },
    { n: 4, title: 'Complete your purchase.', body: 'Your order is sealed in discreet packaging.' },
  ];
}
