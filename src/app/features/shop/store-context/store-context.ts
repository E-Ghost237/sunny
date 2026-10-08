import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { SelectedStoreService } from '../../../core/services/selected-store.service';
import { StoreService } from '../../../core/services/store.service';
import { StoreHours } from '../../../core/models/store.model';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** "You're shopping at" bar shown above every shop page. */
@Component({
  selector: 'app-store-context',
  imports: [RouterLink],
  templateUrl: './store-context.html',
  styleUrl: './store-context.scss',
})
export class StoreContext {
  private readonly selected = inject(SelectedStoreService);
  private readonly storeService = inject(StoreService);

  protected readonly storesResource = rxResource({
    stream: () => this.storeService.getStores(),
  });

  protected readonly store = computed(() => {
    const slug = this.selected.slug();
    return (this.storesResource.value() ?? []).find((s) => s.slug === slug) ?? null;
  });

  protected readonly hoursOpen = signal(false);
  private readonly todayName = DAY_NAMES[new Date().getDay()];

  protected readonly todayHours = computed<StoreHours | null>(
    () => this.store()?.openingHours.find((h) => h.day === this.todayName) ?? null,
  );

  protected readonly directionsUrl = computed(() => {
    const s = this.store();
    if (!s) return '';
    const query = `${s.address.streetAddress} ${s.address.addressLocality} ${s.address.addressRegion}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  });

  protected toggleHours(): void {
    this.hoursOpen.update((v) => !v);
  }
}
