import { SmartImage } from '../../../shared/smart-image/smart-image';
import { Reveal } from '../../../shared/directives/reveal.directive';
import { storeImage } from '../../../shared/utils/media';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { StoreService } from '../../../core/services/store.service';
import { StoreHours } from '../../../core/models/store.model';

const fmtHours = (h: StoreHours): string => (h.opens ? `${h.opens}–${h.closes}` : 'Closed');

function summarizeHours(hours: StoreHours[]): string {
  if (hours.length === 0) return '';
  const distinct = new Set(hours.map(fmtHours));
  if (distinct.size === 1) {
    return `Daily: ${fmtHours(hours[0])}`;
  }
  const today = hours[new Date().getDay()];
  return today ? `Today: ${fmtHours(today)}` : '';
}

@Component({
  selector: 'app-store-list',
  imports: [RouterLink, SmartImage, Reveal],
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
  protected readonly storeImage = storeImage;

  protected setState(state: string | null): void {
    this.activeState.set(state);
  }
}
