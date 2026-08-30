import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { StoreService } from '../../../core/services/store.service';
import { StoreHours } from '../../../core/models/store.model';

function summarizeHours(hours: StoreHours[]): string {
  if (hours.length === 0) return '';
  const distinct = new Set(hours.map((h) => `${h.opens}-${h.closes}`));
  if (distinct.size === 1) {
    return `Daily: ${hours[0].opens}–${hours[0].closes}`;
  }
  const today = hours[new Date().getDay()];
  return today ? `Today: ${today.opens}–${today.closes}` : '';
}

@Component({
  selector: 'app-store-list',
  imports: [RouterLink],
  templateUrl: './store-list.html',
  styleUrl: './store-list.scss',
})
export class StoreList {
  private readonly storeService = inject(StoreService);

  protected readonly storesResource = rxResource({
    stream: () => this.storeService.getStores(),
  });

  protected readonly activeState = signal<string | null>(null);

  protected readonly states = computed(() => {
    const stores = this.storesResource.value() ?? [];
    return [...new Set(stores.map((s) => s.address.addressRegion).filter((r): r is string => !!r))].sort();
  });

  protected readonly filteredStores = computed(() => {
    const stores = this.storesResource.value() ?? [];
    const state = this.activeState();
    return state ? stores.filter((s) => s.address.addressRegion === state) : stores;
  });

  protected readonly summarizeHours = summarizeHours;

  protected setState(state: string | null): void {
    this.activeState.set(state);
  }
}
