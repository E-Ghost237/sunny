import { Component, computed, inject, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { StoreService } from '../../../core/services/store.service';
import { StoreHours } from '../../../core/models/store.model';
import { SmartImage } from '../../../shared/smart-image/smart-image';
import { Reveal } from '../../../shared/directives/reveal.directive';
import { STORE_VIEWS, StoreView, storeImage } from '../../../shared/utils/media';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

@Component({
  selector: 'app-store-detail',
  imports: [RouterLink, SmartImage, Reveal],
  templateUrl: './store-detail.html',
  styleUrl: './store-detail.scss',
})
export class StoreDetail {
  private readonly storeService = inject(StoreService);

  readonly slug = input.required<string>();

  protected readonly views = STORE_VIEWS;
  protected readonly activeView = signal<StoreView>('exterior');
  /** Horizontal look-around position for the all-round (panorama) view, 0-100. */
  protected readonly panPosition = signal(50);
  protected readonly storeImage = storeImage;

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

  protected readonly todayHours = computed<StoreHours | null>(() => {
    const s = this.store();
    return s?.openingHours.find((h) => h.day === this.todayName) ?? null;
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
}
